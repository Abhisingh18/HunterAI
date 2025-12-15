import requests
import json

import os

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

def generate_cold_email(resume_text: str, company_info: dict, tone="Confident, polite, result-oriented"):
    """
    Generates a cold email using local Ollama HTTP API (stable & production-ready).
    Requires: 'ollama' server running on port 11434.
    """

    # 1. Map Data
    candidate_profile = resume_text[:3000]
    company_name = company_info.get('Company Name', 'Target Company')
    role = company_info.get('Role', 'Employee')
    tech_stack = company_info.get('Tech Stack', 'Industry standard technologies')
    hr_name = company_info.get('HR Name', 'Hiring Manager')

    # 2. Construct Master Prompt
    prompt = f"""
You are a professional AI Outreach Assistant.

OBJECTIVE:
Generate a highly personalized, professional cold email (120-150 words).

CANDIDATE PROFILE:
{candidate_profile}

TARGET COMPANY DETAILS:
Company: {company_name}
HR Name: {hr_name}
Role: {role}
Tech Stack: {tech_stack}

INSTRUCTIONS:
1. **Strictly Professional Tone**: Use a confident, polite, and result-oriented tone.
2. **ZERO Spelling/Graver Errors**: Double-check for any spelling or grammatical mistakes.
3. **Relevance**: Extract specific skills or projects from the Candidate Profile that match the Target Company's Tech Stack.
4. **Structure**:
   - Subject: Professional & Catchy (e.g., "Software Engineer for [Company] - [Candidate Name]")
   - Salutation: "Dear [HR Name],"
   - Opening: Mention enthusiasm for [Company Name] and specific compatibility.
   - Body: Connect candidate's [specific project/skill] to the [Role].
   - Closing: Call to Action (e.g., "Attached my resume for your review. Available for a quick chat.")
   - Sign-off: "Best regards, [Candidate Name]"

5. **Attachment Mention**: You MUST mention that the resume is attached in the email body.
6. **No Placeholders**: Do not use [Insert Here]. Fill based on data provided.
7. **OUTPUT ONLY** the email content.
"""

"""

    if GROQ_API_KEY:
        return generate_email_via_groq(prompt)
    else:
        return generate_email_via_ollama(prompt)

def generate_email_via_groq(prompt: str) -> str:
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "messages": [{"role": "user", "content": prompt}],
        "model": "mixtral-8x7b-32768"
    }
    
    try:
        response = requests.post("https://api.groq.com/openai/v1/chat/completions", json=payload, headers=headers)
        if response.status_code == 200:
            return response.json()['choices'][0]['message']['content']
        return f"Error (Groq): {response.text}"
    except Exception as e:
        return f"Error connecting to Groq: {str(e)}"

def generate_email_via_ollama(prompt: str) -> str:
    payload = {
        "model": "mistral",
        "prompt": prompt,
        "stream": False
    }

    try:
        response = requests.post(
            OLLAMA_URL,
            data=json.dumps(payload),
            headers={"Content-Type": "application/json"}
        )

        if response.status_code != 200:
            return f"Error: Ollama returned status {response.status_code}. Response: {response.text}"

        return response.json().get("response", "Error: No response from AI model.")

    except requests.exceptions.ConnectionError:
        return "Error: Could not connect to Ollama. Is the server running at http://localhost:11434?"
    except Exception as e:
        return f"Error connecting to AI: {str(e)}"
