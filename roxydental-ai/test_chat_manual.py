import requests
import json

url = "http://localhost:8000/chat"
payload = {
    "message": "Halo Tika, berapa pasien minggu ini?",
    "user_name": "Dr. Azril"
}

try:
    print(f"Mengirim request ke {url}...")
    response = requests.post(url, json=payload)
    
    print(f"Status Code: {response.status_code}")
    print("Response JSON:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error: {e}")
