import pypdf
import re

def parse_resume(file_path: str):
    text = ""
    try:
        reader = pypdf.PdfReader(file_path)
        for page in reader.pages:
            text += page.extract_text() + "\n"
        
        # Basic cleaning
        text = re.sub(r'\s+', ' ', text).strip()
        
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return str(e)
    return text
