import pandas as pd

def read_company_excel(file_path: str):
    try:
        df = pd.read_excel(file_path)
        # Normalize headers to lowercase? Or expected exact match?
        # User prompt: "Company Name | HR Name | Email | Role | Tech Stack | Type"
        # Let's clean up nan values first
        df = df.where(pd.notnull(df), None)
        companies = df.to_dict(orient="records")
        return companies
    except Exception as e:
        print(f"Error reading Excel: {e}")
        return []
