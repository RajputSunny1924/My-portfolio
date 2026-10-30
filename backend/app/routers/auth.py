from fastapi import APIRouter, Depends, HTTPException, Response, Cookie, Request
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import time

from app.database import get_db
from app.models import User
from app.schemas import UserCreate, UserLogin, RegisterResponse, LoginResponse, VerifyEmail, ResendOTP
from app.security import (
    Password_hash,
    create_access_token,
    generate_otp,
    generate_csrf_token,
    verify_token,
    verify_csrf_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)
from app.email_service import send_otp_email

router = APIRouter(tags=["auth"])


# Protected Profile
@router.get("/profile")
def profile(
    payload: dict = Depends(verify_token)):
    return {
        "message": "Profile accessed",
        "user_id": payload["user_id"],
        "email": payload["email"]
    }


# Register
@router.post(
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

    # Existing user
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
        
        try:
            send_otp_email(user.email, otp)
            db.commit()
        
        except Exception:
            db.rollback()
            raise HTTPException(
                status_code=500,
                detail="OTP could not be sent. Please try again."
            )
        
        return {
            "message": "New OTP sent. Please verify your email.",
            "user_id": existing_user.id
        }

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
    try:
        send_otp_email(user.email, otp)
        db.commit()
        db.refresh(new_user)
    
    except Exception as e:
        db.rollback()
        print("REGISTER EMAIL ERROR:", repr(e))
        raise HTTPException(
            status_code=500,
            detail="Registration failed. OTP could not be sent."
        )

    return {
        "message": "User registration successful",
        "user_id": new_user.id
    }


login_attempts = {}

MAX_LOGIN_ATTEMPTS = 5
BLOCK_TIME = 60

# Login
@router.post("/login", response_model=LoginResponse)
def login(
    user: UserLogin,
    response: Response,
    request: Request,
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
        "message": "Login successful",
        "csrf_token": csrf_token
    }


@router.get("/csrf")
def get_csrf_token(
    response: Response,
    csrf_token: str | None = Cookie(default=None)
):
    if not csrf_token:
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

    return {"csrf_token": csrf_token}


# Logout
@router.post("/logout")
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
@router.post("/verify-email")
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


@router.post("/resend-otp")
def resend_otp(
    data: ResendOTP,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == data.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user.is_verified:
        raise HTTPException(
            status_code=400,
            detail="Email is already verified"
        )

    # Generate new OTP
    otp = generate_otp()

    # Hash OTP
    hashed_otp = Password_hash.hash(otp)

    # New expiry: 5 minutes
    otp_expiry = datetime.now() + timedelta(minutes=5)

       # Update OTP information
    user.verification_otp = hashed_otp
    user.otp_expiry = otp_expiry
    user.otp_attempts = 0

    try:
        send_otp_email(
            user.email,
            otp
        )

        db.commit()

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="OTP could not be sent. Please try again."
        )

    return {
        "message": "New OTP sent successfully"
    }
