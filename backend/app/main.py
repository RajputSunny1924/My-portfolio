import sys
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

# Ensure backend directory is in sys.path for absolute imports
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

ENV_FILE = BASE_DIR / ".env"
load_dotenv(ENV_FILE)
load_dotenv()

from app.database import Base, engine
from app.routers import auth, admin

# Database table creation
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
    allow_origins=[
        "https://my-portfolio-h5de.onrender.com",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Home
@app.get("/")
def home():
    return {"message": "backend is connected succesfuly 😎"}


# Include Routers
app.include_router(auth.router)
app.include_router(admin.router)
