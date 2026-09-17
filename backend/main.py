from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas import (UserCreate, UserLogin, RegisterResponse, LoginResponse, VerifyEmail)
from database import Base, engine, get_db
from models import User
from pwdlib import PasswordHash
from jose import jwt, JWTError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timedelta
from dotenv import load_dotenv
import secrets
import smtplib
import os
from pathlib import Path
from email.message import EmailMessage

# -------------------------
# Environment variables
# -------------------------

BASE_DIR = Path(__file__).resolve().parent
ENV_FILE = BASE_DIR / ".env"

load_dotenv(ENV_FILE)

EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

# -------------------------
# Database
# -------------------------

Base.metadata.create_all(bind=engine)

# -------------------------
# FastAPI
# -------------------------

app = FastAPI()

# -------------------------
# CORS
# -------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# JWT setup
# -------------------------

security = HTTPBearer()

SECRET_KEY = "my-super-secret-key-for-portfolio"
ALGORITHM = "HS256"

# -------------------------
# Password hashing
# -------------------------

Password_hash = PasswordHash.recommended()


# -------------------------
# Create JWT token
# -------------------------

def create_access_token(user_id: int, email: str):
    payload = {
        "user_id": user_id,
        "email": email
    }
    token = jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    return token

# -------------------------
# Verify JWT token
# -------------------------

def verify_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )
# -------------------------
# Generate OTP
# -------------------------

def generate_otp():
    return str(
        secrets.randbelow(900000) + 100000
    )
# -------------------------
# Send OTP email
# -------------------------

def send_otp_email(
    receiver_email: str,
    otp: str
):
    message = EmailMessage()
    message["Subject"] = "My Portfolio - Email Verification OTP"
    message["From"] = EMAIL_ADDRESS
    message["To"] = receiver_email
    message.set_content(
        f"Your email verification OTP is: {otp}\n\n"
        "This OTP is valid for 5 minutes."
    )
    with smtplib.SMTP_SSL(
        "smtp.gmail.com",
        465
    ) as server:
        print("OTP:", otp)
        server.login(
            EMAIL_ADDRESS,
            EMAIL_PASSWORD
        )
        server.send_message(message)
# -------------------------
# Home
# -------------------------
@app.get("/")
def home():
    return {"message": "backend is connected succesfuly 😎"}
# -------------------------
# Protected Profile
# -------------------------
@app.get("/profile")
def profile(
    payload: dict = Depends(verify_token)):
    return {
        "message": "Profile accessed",
        "user_id": payload["user_id"],
        "email": payload["email"]
    }

# -------------------------
# Register
# -------------------------

@app.post(
    "/register",
    response_model=RegisterResponse
)
def register(
    user: UserCreate,
    db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()
    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Generate OTP
    otp = generate_otp()

    # Hash OTP before storing
    hashed_otp = Password_hash.hash(otp)

    # OTP expires after 5 minutes
    otp_expiry = datetime.now() + timedelta(minutes=5)

    # Hash password
    hashed_password = Password_hash.hash(
        user.password
    )

    # Create user
    new_user = User(
        name=user.name,
        email=user.email,
        password=hashed_password,
        is_verified=False,
        verification_otp=hashed_otp,
        otp_expiry=otp_expiry
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    # Send OTP
    send_otp_email(
        user.email,
        otp
    )
    return {
        "message": "user registration succesful",
        "user_id": new_user.id
    }
# -------------------------
# Login
# -------------------------

@app.post("/login", response_model=LoginResponse)
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()
    # User not found
    if not existing_user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
    # Check password
    password_correct = Password_hash.verify(
        user.password,
        existing_user.password
    )

    if not password_correct:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
    # Check email verification
    if not existing_user.is_verified:

        raise HTTPException(
            status_code=403,
            detail="Please verify your email first"
        )
    # Create JWT
    token = create_access_token(
        user_id=existing_user.id,
        email=existing_user.email
    )

    # IMPORTANT:
    # Return token to React.
    # React will store it in localStorage.

    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer"
    }
# -------------------------
# Verify Email
# -------------------------

@app.post("/verify-email")
def verify_email(
    data: VerifyEmail,
    db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(
        User.email == data.email
    ).first()

    if not existing_user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if existing_user.is_verified:

        raise HTTPException(
            status_code=400,
            detail="Email already verified"
        )

    if datetime.now() > existing_user.otp_expiry:

        raise HTTPException(
            status_code=400,
            detail="OTP expired"
        )

    # Verify OTP
    otp_correct = Password_hash.verify(
        data.otp,
        existing_user.verification_otp
    )
    if not otp_correct:

        raise HTTPException(
            status_code=400,
            detail="Invalid OTP"
        )
    # Mark email as verified
    existing_user.is_verified = True
    # Remove OTP after successful verification
    existing_user.verification_otp = None
    existing_user.otp_expiry = None

    db.commit()

    return {
        "message": "Email verified successfully"
    }