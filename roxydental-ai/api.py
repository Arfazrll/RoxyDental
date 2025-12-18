import os
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sqlalchemy import create_engine, text
from statsmodels.tsa.holtwinters import ExponentialSmoothing
import google.generativeai as genai
from dotenv import load_dotenv

# 1. Load Config
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
GEMINI_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=GEMINI_KEY)

# 2. Setup Database Engine
try:
    engine = create_engine(DATABASE_URL)
    print("✅ Koneksi ke Supabase Berhasil")
except Exception as e:
    print(f"❌ Koneksi Gagal: {e}")

app = FastAPI(title="RoxyDental AI Service")

# --- FUNGSI BANTUAN (Helper) ---
def get_data_weekly():
    """Mengambil data payments dan mengubahnya jadi mingguan"""
    try:
        query = text("""
            SELECT payment_date as tanggal, amount as total_bayar 
            FROM payments 
            ORDER BY payment_date ASC
        """)
        with engine.connect() as conn:
            df = pd.read_sql(query, conn)
        
        if df.empty: return None

        df['tanggal'] = pd.to_datetime(df['tanggal'])
        # Resample Mingguan (Senin)
        df_weekly = df.set_index('tanggal').resample('W-MON').agg(
            Revenue=('total_bayar', 'sum'),
            Transaction_Count=('total_bayar', 'count')
        )
        return df_weekly.fillna(0)
    except Exception as e:
        print(f"DB Error: {e}")
        return None

# --- FITUR 1: FORECASTING (FR-28) ---
@app.get("/predict")
def predict_performance():
    df = get_data_weekly()
    
    # Butuh minimal 5 minggu data agar rumus bekerja
    if df is None or len(df) < 5:
        return {"status": "warning", "message": "Data belum cukup (min 5 minggu)", "data": []}

    try:
        # Rumus Holt-Winters (Retraining on-the-fly)
        model_rev = ExponentialSmoothing(df['Revenue'], trend='add', damped_trend=True, seasonal=None).fit()
        pred_rev = model_rev.forecast(4)
        
        model_tx = ExponentialSmoothing(df['Transaction_Count'], trend='add', seasonal=None).fit()
        pred_tx = model_tx.forecast(4)
        
        results = []
        for date, rev, tx in zip(pred_rev.index, pred_rev, pred_tx):
            results.append({
                "date": date.strftime('%Y-%m-%d'),
                "revenue": max(0, round(rev)),
                "patients": max(0, int(round(tx)))
            })
        return {"status": "success", "data": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- FITUR 2: CHATBOT TIKA (FR-27) ---
class ChatInput(BaseModel):
    message: str
    user_name: str = "User"

@app.post("/chat")
def chat_with_tika(item: ChatInput):
    df = get_data_weekly()
    
    # Ambil ringkasan 5 minggu terakhir sebagai konteks
    context = "Data Kosong"
    if df is not None:
        context = df.tail(5).to_string()

    try:
        system_prompt = f"""
        Kamu adalah Tika, asisten manajer klinik gigi RoxyDental.
        Jawablah pertanyaan user dengan ramah dan ringkas.
        Gunakan data 5 minggu terakhir ini sebagai acuan:
        {context}
        """
        
        # GANTI MODEL: Pakai model yang TERSEDIA di list (gemini-2.5-flash)
        GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_KEY}"
        
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{
                "parts": [{"text": f"{system_prompt}\nUser: {item.message}"}]
            }]
        }

        import requests
        import time
        
        # Retry mechanism for 503 (Server Overloaded)
        for attempt in range(3):
            response = requests.post(GEMINI_URL, headers=headers, json=payload)
            
            if response.status_code == 200:
                result = response.json()
                reply_text = result['candidates'][0]['content']['parts'][0]['text']
                return {"status": "success", "reply": reply_text}
            elif response.status_code == 503:
                # Server busy, wait and retry
                print(f"⚠️ Model Overloaded (Attempt {attempt+1}/3). Retrying in 2s...")
                time.sleep(2)
            elif response.status_code == 429:
                # Rate limit, wait longer
                print(f"⚠️ Rate Limit Hit (Attempt {attempt+1}/3). Retrying in 4s...")
                time.sleep(4)
            else:
                # Other errors (400, 401, etc), fail immediately
                break
        
        # If we get here, all retries failed
        error_msg = response.text if response else "Unknown Error"
        return {"status": "error", "reply": f"Maaf, server otak Tika sedang penuh (Error {response.status_code}). Mohon tanya lagi dalam beberapa detik. 🙏"}
            
    except Exception as e:
        print(f"Error Chat: {e}")
        return {"status": "error", "reply": "Maaf, sistem sedang sibuk."}
