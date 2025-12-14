import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
import os

def send_email(to_email, subject, body, smtp_config=None, attachment_path=None):
    # If smtp_config is not provided, try to use env vars (though user provided creds are better)
    sender_email = smtp_config.get("email") if smtp_config else os.getenv("SMTP_EMAIL")
    password = smtp_config.get("password") if smtp_config else os.getenv("SMTP_PASSWORD")
    
    if not sender_email or not password:
        return False, "Missing SMTP credentials"

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = to_email
    msg['Subject'] = subject

    # Attach body as HTML
    # Converting newlines to <br> if it looks like plain text, or assuming incoming body has basic formatting
    html_body = f"""
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            {body.replace(chr(10), '<br>')}
        </div>
        <p style="font-size: 12px; color: #888; margin-top: 20px;">
            Sent via Hunter AI Agent
        </p>
      </body>
    </html>
    """
    msg.attach(MIMEText(html_body, 'html'))

    # Attach resume if provided
    if attachment_path and os.path.exists(attachment_path):
        try:
            with open(attachment_path, "rb") as f:
                part = MIMEApplication(
                    f.read(),
                    Name=os.path.basename(attachment_path)
                )
            # After the file is closed
            part['Content-Disposition'] = f'attachment; filename="{os.path.basename(attachment_path)}"'
            msg.attach(part)
            print(f"📎 Attached file: {attachment_path}")
        except Exception as e:
            print(f"⚠️ Failed to attach file: {e}")

    try:
        # Connect to Gmail SMTP server
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, password)
        text = msg.as_string()
        server.sendmail(sender_email, to_email, text)
        server.quit()
        print(f"✅ Email sent to {to_email}")
        return True, "Email sent successfully"
    except Exception as e:
        print(f"❌ Failed to send to {to_email}: {e}")
        return False, f"Failed to send email: {str(e)}"
