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
        
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(f"{system_prompt}\nUser: {item.message}")
        return {"status": "success", "reply": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
