
import urllib.request
import json

url = "http://localhost:8000/chat"
data = {"message": "halo", "user_name": "test"}
headers = {"Content-Type": "application/json"}

try:
    req = urllib.request.Request(url, json.dumps(data).encode(), headers)
    with urllib.request.urlopen(req) as response:
        print(response.read().decode())
except urllib.error.HTTPError as e:
    err_msg = e.read().decode()
    with open("chat_error.txt", "w") as f:
        f.write(err_msg)
    print(f"HTTP Error {e.code}")
except Exception as e:
    with open("chat_error.txt", "w") as f:
        f.write(str(e))
    print(f"Error: {e}")
