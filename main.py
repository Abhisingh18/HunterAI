import sys
import os
import uvicorn

# Fix path to allow imports from backend folder
sys.path.append(os.path.join(os.path.dirname(__file__), "backend"))

from hunter_backend import app

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=10000)
