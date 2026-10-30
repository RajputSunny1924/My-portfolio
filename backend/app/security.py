from datetime import datetime, timedelta
from pathlib import Path
from dotenv import load_dotenv
import os
import secrets

from fastapi import Depends, HTTPException, Cookie, Header
from jose import jwt, JWTError
from pwdlib import PasswordHash
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User

# Load environment variables from backend/.env
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = BASE_DIR / ".env"
load_dotenv(ENV_FILE)
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY is not configured")

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 30

Password_hash = PasswordHash.recommended()


# verify token
def verify_token(
    access_token: str | None = Cookie(default=None)
):
    if not access_token:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated"
        )

    try:
        payload = jwt.decode(
            access_token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )


# Verify that the logged-in user is an admin
def verify_admin(
    payload: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    user_id = payload.get("user_id")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    if not user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    return user


# Create JWT token
def create_access_token(user_id: int, email: str):
    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": expire

    }
    token = jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    return token


# Generate OTP
def generate_otp():
    return str(
        secrets.randbelow(900000) + 100000
    )


# Generate CSRF Token
def generate_csrf_token():
    return secrets.token_urlsafe(32)


def verify_csrf_token(
    csrf_token: str | None = Cookie(default=None),
    x_csrf_token: str | None = Header(default=None),
):
    if not csrf_token or not x_csrf_token:
        raise HTTPException(
            status_code=403,
            detail="CSRF token missing"
        )

    if not secrets.compare_digest(
        csrf_token,
        x_csrf_token
    ):
        raise HTTPException(
            status_code=403,
            detail="Invalid CSRF token"
        )
