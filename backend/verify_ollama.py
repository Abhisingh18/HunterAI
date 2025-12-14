import requests
import json

OLLAMA_URL = "http://localhost:11434/api/generate"

def test_ollama():
    payload = {
        "model": "mistral",
        "prompt": "Hello",
        "stream": False
    }
    
    print(f"Connecting to {OLLAMA_URL}...")
    try:
        response = requests.post(
            OLLAMA_URL,
            data=json.dumps(payload),
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            print("✅ Connection Successful!")
            print("Response:", response.json().get("response"))
            return True
        else:
            print(f"❌ Connection Failed: {response.status_code}")
            print(response.text)
            return False
            
    except Exception as e:
        print(f"❌ Connection Error: {e}")
        return False

if __name__ == "__main__":
    test_ollama()
