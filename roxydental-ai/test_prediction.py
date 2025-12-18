import requests
import json

url = "http://localhost:8000/predict"

try:
    print(f"Mengirim request PREDIKSI ke {url}...")
    response = requests.get(url)
    
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("✅ Testing SUKES!")
        # Print sebagian data saja biar gak kepanjangan
        data = response.json()
        print(f"Total Data Prediksi: {len(data['data'])}")
        print("Contoh Data Terakhir:")
        print(json.dumps(data['data'][-1], indent=2))
    else:
        print("❌ Testing GAGAL")
        print(response.text)

except Exception as e:
    print(f"Error: {e}")
