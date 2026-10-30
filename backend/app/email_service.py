from pathlib import Path
from dotenv import load_dotenv
import os
import requests

# Load environment variables from backend/.env
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = BASE_DIR / ".env"
load_dotenv(ENV_FILE)
load_dotenv()

brevo_api_key = os.getenv("BREVO_API_KEY")
brevo_sender_email = os.getenv("BREVO_SENDER_EMAIL")


# Send OTP email
def send_otp_email(to_email: str, otp: str):
    api_key = os.getenv("BREVO_API_KEY")
    sender_email = os.getenv("BREVO_SENDER_EMAIL")

    if not api_key or not sender_email:
        raise RuntimeError("Brevo email configuration is missing")

    url = "https://api.brevo.com/v3/smtp/email"

    headers = {
        "accept": "application/json",
        "api-key": api_key,
        "content-type": "application/json"
    }

    payload = {
        "sender": {
            "name": "My Portfolio",
            "email": sender_email
        },
        "to": [
            {
                "email": to_email
            }
        ],
        "subject": "Your Email Verification OTP",
        "htmlContent": f"""
        <html>
            <body>
                <h2>Email Verification</h2>
                <p>Your OTP is:</p>
                <h1>{otp}</h1>
                <p>This OTP will expire in 5 minutes.</p>
            </body>
        </html>
        """
    }

    response = requests.post(
        url,
        headers=headers,
        json=payload,
        timeout=15
    )

    if response.status_code not in (200, 201, 202):
        raise RuntimeError(
            f"Brevo email failed: {response.text}"
        )
