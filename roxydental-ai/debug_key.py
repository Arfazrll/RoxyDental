import os
from dotenv import load_dotenv

load_dotenv()
key = os.getenv("GEMINI_API_KEY")

print(f"Key loaded: '{key}'")
if key:
    print(f"Length: {len(key)}")
else:
    print("Key is None")
