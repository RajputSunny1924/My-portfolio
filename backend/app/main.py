import sys
import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

# Backend path setup
BASE_DIR = Path(__file__).resolve().parent.parent

if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

# Environment variables
ENV_FILE = BASE_DIR / ".env"
load_dotenv(ENV_FILE)
load_dotenv()

from app.database import Base, engine
from app.routers import auth, admin, analytics

# Database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Portfolio Backend",
    version="1.0.0"
)


# Security headers
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)

        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = (
            "strict-origin-when-cross-origin"
        )

        return response


app.add_middleware(SecurityHeadersMiddleware)


# Allowed frontend origins
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://my-portfolio-h5de.onrender.com",
]

# Optional extra origins from environment
extra_origins = os.getenv("FRONTEND_ORIGINS", "")

if extra_origins:
    allowed_origins.extend(
        origin.strip()
        for origin in extra_origins.split(",")
        if origin.strip()
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(set(allowed_origins)),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=[
        "Content-Type",
        "Authorization",
        "X-CSRF-Token",
    ],
)


@app.get("/")
def home():
    return {
        "status": "success",
        "message": "Portfolio backend connected successfully"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# Register routers
app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(analytics.router)