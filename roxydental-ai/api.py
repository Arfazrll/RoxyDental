import os
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, text
from statsmodels.tsa.holtwinters import ExponentialSmoothing
import requests
import time
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
GEMINI_KEY = os.getenv("GEMINI_API_KEY")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL tidak ditemukan di .env")
if not GEMINI_KEY:
    raise ValueError("GEMINI_API_KEY tidak ditemukan di .env")

try:
    engine = create_engine(DATABASE_URL)
    print("✅ Koneksi ke Database Berhasil")
except Exception as e:
    print(f"❌ Koneksi Database Gagal: {e}")
    raise

app = FastAPI(
    title="RoxyDental AI Service",
    description="AI Service for Forecasting & Chatbot",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_data_weekly():
    """Mengambil data payments dan mengubahnya jadi mingguan"""
    try:
        query = text("""
            SELECT payment_date as tanggal, amount as total_bayar 
            FROM payments 
            WHERE payment_date IS NOT NULL 
            AND amount > 0
            ORDER BY payment_date ASC
        """)
        with engine.connect() as conn:
            df = pd.read_sql(query, conn)
        
        if df.empty:
            return None

        df['tanggal'] = pd.to_datetime(df['tanggal'], errors='coerce')
        df = df.dropna(subset=['tanggal'])
        
        if df.empty:
            return None
        
        df_weekly = df.set_index('tanggal').resample('W-MON').agg(
            Revenue=('total_bayar', 'sum'),
            Transaction_Count=('total_bayar', 'count')
        )
        return df_weekly.fillna(0)
    except Exception as e:
        print(f"❌ Database Error: {e}")
        return None

@app.get("/")
def root():
    return {
        "service": "RoxyDental AI Service",
        "status": "running",
        "endpoints": ["/predict", "/chat", "/health"]
    }

@app.get("/predict")
def predict_performance():
    """Forecasting revenue dan jumlah pasien untuk 4 minggu ke depan"""
    try:
        df = get_data_weekly()
        
        if df is None or len(df) < 5:
            return {
                "status": "warning",
                "message": "Data belum cukup untuk prediksi (minimum 5 minggu data historis diperlukan)",
                "data": []
            }

        model_rev = ExponentialSmoothing(
            df['Revenue'],
            trend='add',
            damped_trend=True,
            seasonal=None
        ).fit()
        pred_rev = model_rev.forecast(4)
        
        model_tx = ExponentialSmoothing(
            df['Transaction_Count'],
            trend='add',
            seasonal=None
        ).fit()
        pred_tx = model_tx.forecast(4)
        
        results = []
        for date, rev, tx in zip(pred_rev.index, pred_rev, pred_tx):
            results.append({
                "date": date.strftime('%Y-%m-%d'),
                "revenue": max(0, round(float(rev))),
                "patients": max(0, int(round(float(tx))))
            })
        
        return {
            "status": "success",
            "message": "Prediksi berhasil dibuat",
            "data": results
        }
    except Exception as e:
        print(f"❌ Prediction Error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Gagal membuat prediksi: {str(e)}"
        )

class ChatInput(BaseModel):
    message: str
    user_name: str = "User"

@app.post("/chat")
def chat_with_tika(item: ChatInput):
    """Chatbot Tika menggunakan Gemini AI"""
    try:
        df = get_data_weekly()
        
        context = "Data transaksi belum tersedia"
        if df is not None and len(df) > 0:
            recent_data = df.tail(5)
            total_revenue = recent_data['Revenue'].sum()
            total_patients = recent_data['Transaction_Count'].sum()
            avg_revenue = total_revenue / len(recent_data)
            
            context = f"""
Data 5 Minggu Terakhir:
- Total Pendapatan: Rp {total_revenue:,.0f}
- Rata-rata per Minggu: Rp {avg_revenue:,.0f}
- Total Transaksi: {int(total_patients)} pasien
- Rata-rata Pasien/Minggu: {int(total_patients/len(recent_data))} pasien
""".strip()

        
        system_prompt = f"""
Kamu adalah Tika AI, asisten profesional untuk Dokter dan Manajemen RoxyDental Clinic.

Konteks data internal (gunakan jika relevan):
{context}

ATURAN WAJIB:
- Jangan mengulang salam/perkenalan di setiap jawaban.
- Jawab langsung ke inti (maks 2 kalimat pembuka).
- Jangan menjawab normatif/umum tanpa rincian langkah.
- Jika user minta tips/strategi: berikan minimal 7 langkah yang bisa dieksekusi.
- Jika user tanya pendapatan: jawab angka + periode + interpretasi singkat 1 kalimat.
- Boleh membantu: operasional klinik, alur pasien & antrian, SDM, SOP layanan, keuangan, bisnis, pemasaran, analisis data (non-medis).
- Dilarang memberi diagnosis medis atau instruksi tindakan klinis untuk pasien.

FORMAT JAWABAN:
1) Jawaban panjang dan detail
2) Detail 
3) Rekomendasi aksi (7–10 poin)
4) Jika relevan: contoh implementasi (template pesan / promo / SOP singkat)
""".strip()
        
        GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_KEY}"
        
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{
                "parts": [{"text": f"{system_prompt}\n\nUser ({item.user_name}): {item.message}"}]
            }],
            "generationConfig": {
                "temperature": 0.4,          # ✅ lebih konsisten & tidak normatif
                "maxOutputTokens": 800       # ✅ biar lebih detail
            }
        }

        for attempt in range(3):
            response = requests.post(GEMINI_URL, headers=headers, json=payload, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                
                if 'candidates' in result and len(result['candidates']) > 0:
                    parts = result['candidates'][0].get('content', {}).get('parts', [])
                    if not parts:
                        return {
                            "status": "error",
                            "reply": "Maaf, Tika tidak dapat memproses pertanyaan tersebut. Coba pertanyaan lain."
                        }

                    # ✅ FIX: gabungkan semua text parts supaya tidak kepotong
                    texts = [p.get("text", "") for p in parts if isinstance(p, dict)]
                    reply_text = "".join(texts).strip()

                    return {
                        "status": "success",
                        "reply": reply_text if reply_text else "Maaf, Tika tidak dapat memproses pertanyaan tersebut. Coba pertanyaan lain."
                    }
                else:
                    return {
                        "status": "error",
                        "reply": "Maaf, Tika tidak dapat memproses pertanyaan tersebut. Coba pertanyaan lain."
                    }
                    
            elif response.status_code == 503:
                print(f"⚠️ Model Overloaded (Attempt {attempt+1}/3)")
                if attempt < 2:
                    time.sleep(2)
            elif response.status_code == 429:
                print(f"⚠️ Rate Limit (Attempt {attempt+1}/3)")
                if attempt < 2:
                    time.sleep(4)
            else:
                print(f"❌ API Error: {response.status_code} - {response.text}")
                break
        
        return {
            "status": "error",
            "reply": "Maaf, Tika sedang sibuk. Mohon coba lagi dalam beberapa saat. 🙏"
        }
            
    except Exception as e:
        print(f"❌ Chat Error: {e}")
        return {
            "status": "error",
            "reply": "Maaf, terjadi kesalahan sistem. Silakan coba lagi."
        }

@app.get("/health")
def health_check():
    """Health check endpoint"""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        db_status = "connected"
    except:
        db_status = "disconnected"
    
    return {
        "status": "healthy",
        "database": db_status,
        "gemini_api": "configured" if GEMINI_KEY else "not configured"
    }
