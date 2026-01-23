import requests
import json
import os

def generate_cold_email(resume_text: str, company_info: dict, tone="Confident, polite, result-oriented"):
    """
    Generates a cold email using Groq API.
    """
    
    # Fetch key dynamically to ensure it's loaded
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")

    # 1. Map Data
    candidate_profile = resume_text[:4000] # Increased limit slightly
    company_name = company_info.get('Company Name', 'Target Company')
    role = company_info.get('Role', 'Employee')
    tech_stack = company_info.get('Tech Stack', 'Industry standard technologies')
    hr_name = company_info.get('HR Name', 'Hiring Manager')

    # 2. Construct Master Prompt
    # Enhanced prompt for better personalization
    prompt = f"""
You are an expert Copywriter and AI Outreach Assistant.

OBJECTIVE:
Write a high-converting, hyper-personalized cold email to {hr_name} at {company_name} for the role of {role}.

CANDIDATE PROFILE (RESUME):
{candidate_profile}

TARGET COMPANY DETAILS:
Company: {company_name}
Role: {role}
Tech Stack: {tech_stack}

INSTRUCTIONS:
1.  **Analyze the Match**: First, silently identify the *strongest* project or skill from the candidate's resume that DIRECTLY pertains to the company's tech stack ({tech_stack}).
2.  **Hook**: Open with a strong, non-generic hook. Mention why you are interested in {company_name} or a specific achievement of theirs if known (or just general enthusiasm for their mission).
3.  **The "Why Me" (Crucial)**: You MUST include 1-2 sentences explicitly connecting a specific project/skill from the resume to the {role} requirements. "For example, in my project [Project Name], I used [Tech] to achieve [Result], which aligns with your work in [Domain]."
4.  **Tone**: Confident, professional, yet human. Avoid stiff corporate jargon.
5.  **Structure**:
    *   **Subject**: Catchy & Relevant (e.g., "{role} Application - [Candidate Name] - [Key Skill] expert")
    *   **Salutation**: Dear {hr_name},
    *   **Body**: Hook -> "Why Me" (Specific Proof) -> Value Proposition.
    *   **Call to Action**: Clear request for a brief chat or interview. Mention attached resume.
    *   **Sign-off**: Best regards, [Candidate Name]

CONSTRAINTS:
*   Keep it under 150 words.
*   NO spelling errors.
*   NO placeholders like [Insert Here] - use the data provided. If data is missing, generalize intelligently.
*   OUTPUT ONLY the email content.
"""

    return generate_email_via_groq(prompt, GROQ_API_KEY)

def generate_email_via_groq(prompt: str, api_key: str) -> str:
    if not api_key:
        return "Error: GROQ_API_KEY not found in environment variables. Please check your .env file."

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    # Using a slightly larger/better model if available, or sticking to standard fast one
    payload = {
        "messages": [{"role": "user", "content": prompt}],
        "model": "llama-3.3-70b-versatile", 
        "temperature": 0.7 
    }
    
    try:
        response = requests.post("https://api.groq.com/openai/v1/chat/completions", json=payload, headers=headers)
        if response.status_code == 200:
            return response.json()['choices'][0]['message']['content']
        else:
            return f"Error (Groq API): {response.status_code} - {response.text}"
    except Exception as e:
        return f"Error connecting to Groq: {str(e)}"
