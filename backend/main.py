from fastapi import FastAPI, UploadFile, File, HTTPException
# Trigger reload
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
import time
from dotenv import load_dotenv
from services.resume_parser import parse_resume
from services.excel_reader import read_company_excel
from services.ai_engine import generate_cold_email
from services.email_sender import send_email
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

load_dotenv()

app = FastAPI(title="Hunter AI Backend")

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    os.getenv("FRONTEND_URL", "http://localhost:5173"),  # Allow Render frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
def read_root():
    return {"message": "Hunter AI Backend is running!"}

@app.post("/upload")
async def upload_files(resume: UploadFile = File(...), company_excel: UploadFile = File(...)):
    resume_path = os.path.join(UPLOAD_DIR, resume.filename)
    excel_path = os.path.join(UPLOAD_DIR, company_excel.filename)
    
    with open(resume_path, "wb") as buffer:
        shutil.copyfileobj(resume.file, buffer)
        
    with open(excel_path, "wb") as buffer:
        shutil.copyfileobj(company_excel.file, buffer)
        
    resume_text = parse_resume(resume_path)
    companies = read_company_excel(excel_path)
    
    return {
        "status": "success",
        "resume_filename": resume.filename,
        "excel_filename": company_excel.filename,
        "resume_preview": resume_text[:500] if resume_text else "No text extracted",
        "companies_count": len(companies),
        "first_company_example": companies[0] if companies else None
    }

class GenerateRequest(BaseModel):
    resume_filename: str
    excel_filename: str

@app.post("/generate-emails")
async def generate_emails_endpoint(request: GenerateRequest):
    resume_path = os.path.join(UPLOAD_DIR, request.resume_filename)
    excel_path = os.path.join(UPLOAD_DIR, request.excel_filename)
    
    if not os.path.exists(resume_path) or not os.path.exists(excel_path):
        raise HTTPException(status_code=404, detail="Files not found")

    resume_text = parse_resume(resume_path)
    companies = read_company_excel(excel_path)
    
    results = []
    # Limit to first 5 for safety in MVP/Demo to avoid burning API quota or time
    for company in companies[:5]: 
        email = generate_cold_email(resume_text, company)
        results.append({
            "company": company.get("Company Name", "Unknown"),
            "email": email,
            "hr_email": company.get("Email", "") # Ensure we have the target email
        })
    return {"emails": results}

class SendEmailRequest(BaseModel):
    emails: List[Dict[str, str]]  # List of { "to": "...", "subject": "...", "body": "..." }
    smtp_email: str
    smtp_password: str
    resume_filename: Optional[str] = None

@app.post("/send-bulk-emails")
async def send_bulk_emails_endpoint(request: SendEmailRequest):
    results = []
    smtp_config = {"email": request.smtp_email, "password": request.smtp_password}
    
    # Construct attachment path if provided
    attachment_path = None
    if request.resume_filename:
        attachment_path = os.path.join(UPLOAD_DIR, request.resume_filename)
    
    print(f"🚀 Starting bulk email send for {len(request.emails)} recipients...")
    if attachment_path:
        print(f"📎 Including attachment: {request.resume_filename}")
    
    for index, item in enumerate(request.emails):
        to_email = item.get("to")
        subject = item.get("subject")
        body = item.get("body")
        
        if to_email and subject and body:
            print(f"[{index+1}/{len(request.emails)}] Sending to {to_email}...")
            
            # Pass attachment_path to send_email
            success, message = send_email(to_email, subject, body, smtp_config, attachment_path)
            
            results.append({"to": to_email, "status": "sent" if success else "failed", "error": message})
            
            # Rate limiting: Sleep 2 seconds between emails to avoid spam filters
            if index < len(request.emails) - 1:
                time.sleep(2)
        else:
            results.append({"to": to_email, "status": "failed", "error": "Invalid data"})
            
    print("✅ Bulk sending complete.")
    return {"results": results}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=10000)
