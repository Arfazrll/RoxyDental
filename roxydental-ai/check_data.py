
import os
import pandas as pd
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

# Gunakan URL yang sudah diperbaiki (tanpa pgbouncer=true untuk python)
DATABASE_URL = os.getenv("DATABASE_URL")

try:
    engine = create_engine(DATABASE_URL)
    print("✅ Connected to DB")
    
    query = text("""
        SELECT payment_date as tanggal, amount as total_bayar 
        FROM payments 
        ORDER BY payment_date ASC
    """)
    
    with engine.connect() as conn:
        df = pd.read_sql(query, conn)
    
    if df.empty:
        print("❌ DATA KOSONG: Tabel payments tidak ada isinya.")
    else:
        df['tanggal'] = pd.to_datetime(df['tanggal'])
        # Hitung jumlah minggu unik
        df['week'] = df['tanggal'].dt.to_period('W')
        unique_weeks = df['week'].nunique()
        
        print(f"📊 Total Transaksi: {len(df)}")
        print(f"📅 Rentang Tanggal: {df['tanggal'].min()} s/d {df['tanggal'].max()}")
        print(f"🗓️ Jumlah Minggu Data: {unique_weeks} minggu")
        
        if unique_weeks < 5:
            print("⚠️ PERINGATAN: Data kurang dari 5 minggu. Fitur prediksi GAK BAKAL JALAN.")
        else:
            print("✅ Data CUKUP. Fitur prediksi aman.")

except Exception as e:
    print(f"❌ Error: {e}")
