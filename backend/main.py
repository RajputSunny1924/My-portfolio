from fastapi import FastAPI, Depends, HTTPException, Response, Cookie, Header, Request
from sqlalchemy.orm import Session
from schemas import UserCreate, UserLogin, RegisterResponse, LoginResponse, VerifyEmail
from database import Base, engine, get_db
from models import User
from pwdlib import PasswordHash
from jose import jwt, JWTError
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from datetime import datetime, timedelta
from dotenv import load_dotenv
from pathlib import Path
import secrets
import os
import time
import requests
# Environment variables
BASE_DIR = Path(__file__).resolve().parent
ENV_FILE = BASE_DIR / ".env"

load_dotenv(ENV_FILE)

EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY is not configured")

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 30

Base.metadata.create_all(bind=engine)

app = FastAPI()

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)

        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        return response


app.add_middleware(SecurityHeadersMiddleware)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://my-portfolio-h5de.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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


# Send OTP email
def send_otp_email(to_email: str, otp: str):
    resend_api_key = os.getenv("RESEND_API_KEY")

    if not resend_api_key:
        raise RuntimeError("RESEND_API_KEY is not configured")

    response = requests.post(
        "https://api.resend.com/emails",
        headers={
            "Authorization": f"Bearer {resend_api_key}",
            "Content-Type": "application/json",
        },
        json={
            "from": "onboarding@resend.dev",
            "to": [to_email],
            "subject": "Your Email Verification OTP",
            "html": f"""
                <h2>Email Verification</h2>
                <p>Your OTP is:</p>
                <h1>{otp}</h1>
                <p>This OTP will expire in 5 minutes.</p>
            """,
        },
        timeout=15,
    )

    if response.status_code >= 400:
        raise RuntimeError(f"Resend email failed: {response.text}")

# Home
@app.get("/")
def home():
    return {"message": "backend is connected succesfuly 😎"}

# Protected Profile
@app.get("/profile")
def profile(
    payload: dict = Depends(verify_token)):
    return {
        "message": "Profile accessed",
        "user_id": payload["user_id"],
        "email": payload["email"]
    }

# Register
@app.post(
    "/register",
    response_model=RegisterResponse
)
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    # -------------------------
    # Existing user
    # -------------------------
    if existing_user:

        # Already verified
        if existing_user.is_verified:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )

        # Existing user is NOT verified
        # Generate a new OTP
        otp = generate_otp()

        # Hash OTP
        hashed_otp = Password_hash.hash(otp)

        # OTP expires after 5 minutes
        otp_expiry = datetime.now() + timedelta(minutes=5)

        # Update only OTP-related information
        existing_user.verification_otp = hashed_otp
        existing_user.otp_expiry = otp_expiry
        existing_user.otp_attempts = 0

        db.commit()

        # Send new OTP
        send_otp_email(
            user.email,
            otp
        )

        return {
            "message": "New OTP sent. Please verify your email.",
            "user_id": existing_user.id
        }

    # -------------------------
    # New user
    # -------------------------

    # Generate OTP
    otp = generate_otp()

    # Hash OTP
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
        otp_expiry=otp_expiry,
        otp_attempts=0
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
        "message": "User registration successful",
        "user_id": new_user.id
    }


login_attempts = {}

MAX_LOGIN_ATTEMPTS = 5
BLOCK_TIME = 60

# Login
@app.post("/login", response_model=LoginResponse)
def login(
    user: UserLogin,
    response:Response,
    request:Request,
    db: Session = Depends(get_db),
):
    client_ip = request.client.host

    current_time = time.time()
    if client_ip in login_attempts:
        attempt, blocked_until = login_attempts[client_ip]
        if current_time < blocked_until:
            raise HTTPException(
                status_code=429,
                detail="Too many login attempts. Please try again later."
            )
    

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()
    # User not found
    if not existing_user:
        attempts, _ = login_attempts.get(client_ip, (0, 0))
        attempts += 1

        if attempts >= MAX_LOGIN_ATTEMPTS:
            login_attempts[client_ip] = (
                attempts,
                time.time() + BLOCK_TIME
            )
        else:
            login_attempts[client_ip] = (attempts, 0)

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
        attempts, _ = login_attempts.get(client_ip, (0, 0))
        attempts += 1
    
        if attempts >= MAX_LOGIN_ATTEMPTS:
            login_attempts[client_ip] = (
                attempts,
                time.time() + BLOCK_TIME
            )
        else:
            login_attempts[client_ip] = (attempts, 0)
    
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
    login_attempts.pop(client_ip, None)
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
    response.set_cookie(
    key="access_token",
    value=token,
    httponly=True,
    secure=True,
    samesite="none",
    max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    path="/"
)

    # create CSRF
    csrf_token = generate_csrf_token()

    response.set_cookie(
    key="csrf_token",
    value=csrf_token,
    httponly=False,
    secure=True,
    samesite="none",
    max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    path="/"
)
    return {
        "message": "Login successful"
    }
def verify_csrf_token(
    csrf_token: str | None = Cookie(default=None),
    x_csrf_token: str | None = Header(default=None),
):
    print("COOKIE CSRF:", csrf_token)
    print("HEADER CSRF:", x_csrf_token)

    if not csrf_token or not x_csrf_token:
        raise HTTPException(
            status_code=403,
            detail="CSRF token missing"
        )

    if not secrets.compare_digest(csrf_token, x_csrf_token):
        raise HTTPException(
            status_code=403,
            detail="Invalid CSRF token"
        )

# Logout
@app.post("/logout")
def logout(response: Response,
    _: None = Depends(verify_csrf_token)
):
    response.delete_cookie(
        key="access_token",
        path="/",
        secure=True,
        httponly=True,
        samesite="none"
    )
    
    response.delete_cookie(
        key="csrf_token",
        path="/",
        secure=True,
        httponly=False,
        samesite="none"
    )

    return {
        "message": "Logout successful"
    }

# Verify Email
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
    # check otp exists
    if not existing_user.verification_otp or not existing_user.otp_expiry:
        raise HTTPException(
            status_code=400,
            detail="OTP is not available"
        )
    # check otp expiry
    if datetime.now() > existing_user.otp_expiry:
        raise HTTPException(
            status_code=400,
            detail="OTP expired"
        )
    # Maximum 5 wrong attempts
    if existing_user.otp_attempts >= 5:
        raise HTTPException(
            status_code=429,
            detail="Too many OTP attempts"
        )
    # Verify OTP
    otp_correct = Password_hash.verify(
        data.otp,
        existing_user.verification_otp
    )
    if not otp_correct:
        existing_user.otp_attempts +=1
        db.commit()
        if existing_user.otp_attempts >= 5:
            raise HTTPException(
                status_code=429,
                detail="Too many OTP attempts"
            )
        raise HTTPException(
            status_code=400,
            detail="Invalid OTP"
        )
    existing_user.is_verified = True
    existing_user.verification_otp = None
    existing_user.otp_expiry = None
    existing_user.otp_attempts = 0

    db.commit()

    return {
        "message": "Email verified successfully"
    }