from fastapi import FastAPI,Depends,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from models import User as Usermodel
from database import engine, SessionLocal, Base
from pwdlib import PasswordHash
from datetime import datetime, timedelta
import jwt
from sqlalchemy.exc import IntegrityError

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


security = HTTPBearer()
SECRET_KEY = "my-super-secret-key-for-fullstack-jwt"
ALGORITHM = "HS256"

def get_current_user(
        credentials: HTTPAuthorizationCredentials =Depends(security)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
    except:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )
    return payload

password_hash = PasswordHash.recommended()

Base.metadata.create_all(bind=engine)

# backend connection test
@app.get("/")
def home():
    return {"message": "fullstack backend is connected"}

# database connection test
@app.get("/db-test")
def db_test():
    with engine.connect():
        return{"message": " database connected "}

# user creation
class UserCreate(BaseModel):
    name:str
    email: str
    password:str

@app.post("/users")
def create_user(user: UserCreate):
    db = SessionLocal()

    hashed_password = password_hash.hash(user.password)

    new_user = Usermodel(
        name=user.name,
        email=user.email,
        password=hashed_password
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except IntegrityError:
        db.rollback()
        db.close()
        raise HTTPException(
            status_code=400,
            detail="email already registered"
        )
    db.close()
    return new_user

class UserLogin(BaseModel):
    email: str
    password:str

@app.post("/login")
def login(data : UserLogin):
    print(data.email)
    db = SessionLocal()
    user = db.query(Usermodel).filter(Usermodel.email == data.email).first()
    print("LOGIN EMAIL:", data.email)
    print("USER FOUND:", user)
    if user is None:
        db.close()
        return {"message": "Invalid email or password"}
    password_correct = password_hash.verify(
        data.password,
        user.password
        )
    db.close()
    if password_correct:
        token_data = {
            "user_id":user.id,
            "email": user.email,
            "exp": datetime.utcnow() + timedelta(minutes=30)
        }
        token = jwt.encode(token_data,SECRET_KEY, algorithm=ALGORITHM)
        
        return {
            "message": "login sucessful",
            "token": token
            }
    return{"message":"incorrect password "}

@app.get("/profile")
def profile(current_user = Depends(get_current_user)):
    return {
        "message": "Profile accessed",
        "user": current_user
    }

@app.get("/users/{user_id}")
def get_user(
    user_id: int,
    current_user = Depends(get_current_user)
):
    if user_id != current_user["user_id"]:
        raise HTTPException(
            status_code=403,
            detail="Not allowed"
        )

    db = SessionLocal()

    user = db.query(Usermodel).filter(
        Usermodel.id == user_id
    ).first()

    db.close()

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email
    }



# # ============================================================
# # IMPORTS
# # ============================================================

# from fastapi import FastAPI, Depends, HTTPException
# from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
# from pydantic import BaseModel

# # SQLAlchemy database connection/session
# from database import engine, SessionLocal, Base

# # SQLAlchemy User model
# from models import User as Usermodel

# # Password hashing
# from pwdlib import PasswordHash

# # JWT expiration
# from datetime import datetime, timedelta

# # JWT library
# import jwt

# # Handles duplicate email error from MySQL
# from sqlalchemy.exc import IntegrityError


# # ============================================================
# # FASTAPI APP SETUP
# # ============================================================

# app = FastAPI()


# # HTTPBearer:
# # Swagger/frontend se aane wale
# # Authorization: Bearer <token>
# # ko read karne ke liye use hota hai.
# security = HTTPBearer()


# # ============================================================
# # JWT CONFIGURATION
# # ============================================================

# # JWT ko sign/encrypt nahi, balki digitally sign karne ke
# # liye secret key use hoti hai.
# SECRET_KEY = "my-super-secret-key-for-fullstack-jwt"

# # JWT signing algorithm
# ALGORITHM = "HS256"


# # ============================================================
# # PASSWORD HASHING SETUP
# # ============================================================

# # User ka original password database mein store nahi hoga.
# # Password ko Argon2 hash mein convert karke store karenge.
# password_hash = PasswordHash.recommended()


# # ============================================================
# # DATABASE TABLE CREATION
# # ============================================================

# # SQLAlchemy ke models ke according database tables
# # create karta hai agar tables already exist nahi karti.
# Base.metadata.create_all(bind=engine)


# # ============================================================
# # BACKEND CONNECTION TEST
# # ============================================================

# @app.get("/")
# def home():
#     # Check karta hai ki FastAPI backend properly running hai.
#     return {"message": "fullstack backend is connected"}


# # ============================================================
# # DATABASE CONNECTION TEST
# # ============================================================

# @app.get("/db-test")
# def db_test():
#     # MySQL database ke saath connection test karta hai.
#     with engine.connect():
#         return {"message": " database connected "}


# # ============================================================
# # REGISTRATION
# # ============================================================

# # Registration ke time frontend se aane wale data ka format.
# class UserCreate(BaseModel):
#     name: str
#     email: str
#     password: str


# # POST /users
# # New user ko database mein register karta hai.
# @app.post("/users")
# def create_user(user: UserCreate):

#     # Database session open
#     db = SessionLocal()


#     # ========================================================
#     # PASSWORD HASHING
#     # ========================================================

#     # Original password ko Argon2 hash mein convert karte hain.
#     # Database mein original password store nahi hota.
#     hashed_password = password_hash.hash(user.password)


#     # ========================================================
#     # NEW USER OBJECT
#     # ========================================================

#     # SQLAlchemy User model ka object create kar rahe hain.
#     new_user = Usermodel(
#         name=user.name,
#         email=user.email,
#         password=hashed_password
#     )


#     # ========================================================
#     # SAVE USER TO DATABASE
#     # ========================================================

#     try:
#         # New user ko database session mein add karta hai.
#         db.add(new_user)

#         # Database mein permanently save karta hai.
#         db.commit()

#         # Database se generated ID etc. object mein update karta hai.
#         db.refresh(new_user)

#     except IntegrityError:

#         # Agar email already exist karta hai,
#         # database unique constraint error dega.
#         db.rollback()
#         db.close()

#         raise HTTPException(
#             status_code=400,
#             detail="email already registered"
#         )


#     # Database session close
#     db.close()

#     # Created user return
#     return new_user


# # ============================================================
# # LOGIN
# # ============================================================

# # Login request ka format.
# class UserLogin(BaseModel):
#     email: str
#     password: str


# # POST /login
# # Email + password verify karke JWT token generate karta hai.
# @app.post("/login")
# def login(data: UserLogin):

#     # Database session open
#     db = SessionLocal()


#     # ========================================================
#     # FIND USER BY EMAIL
#     # ========================================================

#     user = db.query(Usermodel).filter(
#         Usermodel.email == data.email
#     ).first()


#     # Agar email database mein nahi mila
#     if user is None:

#         db.close()

#         # Security ke liye same generic message.
#         return {"message": "Invalid email or password"}


#     # ========================================================
#     # PASSWORD VERIFICATION
#     # ========================================================

#     # User ke entered password ko database mein stored
#     # Argon2 hash ke against verify karta hai.
#     password_correct = password_hash.verify(
#         data.password,
#         user.password
#     )


#     # Database session close
#     db.close()


#     # ========================================================
#     # JWT GENERATION
#     # ========================================================

#     if password_correct:

#         # JWT ke andar user ki basic identity store kar rahe hain.
#         token_data = {
#             "user_id": user.id,
#             "email": user.email,

#             # JWT 30 minutes ke baad expire hoga.
#             "exp": datetime.utcnow() + timedelta(minutes=30)
#         }


#         # JWT token create
#         token = jwt.encode(
#             token_data,
#             SECRET_KEY,
#             algorithm=ALGORITHM
#         )


#         # Frontend ko JWT token return hoga.
#         return {
#             "message": "login sucessful",
#             "token": token
#         }


#     # Wrong password
#     return {
#         "message": "incorrect password "
#     }


# # ============================================================
# # AUTHENTICATION — PROTECTED PROFILE
# # ============================================================

# # Sirf valid JWT wale user ko profile access milegi.
# @app.get("/profile")
# def profile(
#     credentials: HTTPAuthorizationCredentials = Depends(security)
# ):

#     # HTTPBearer se actual JWT token nikal rahe hain.
#     token = credentials.credentials


#     # ========================================================
#     # JWT VERIFICATION
#     # ========================================================

#     try:

#         # Token ko verify + decode karta hai.
#         # SECRET_KEY aur algorithm ke saath verify hota hai.
#         #
#         # Expiration bhi yahin automatically check hoti hai.
#         payload = jwt.decode(
#             token,
#             SECRET_KEY,
#             algorithms=[ALGORITHM]
#         )

#     except:

#         # Invalid ya expired token
#         raise HTTPException(
#             status_code=401,
#             detail="invalid token"
#         )


#     # Valid token hone par JWT ka data return.
#     return {
#         "message": "Profile accessed",
#         "user": payload
#     }


# # ============================================================
# # AUTHORIZATION
# # ============================================================

# # User apne hi data ko access kar sakta hai.
# @app.get("/users/{user_id}")
# def get_user(
#     user_id: int,
#     credentials: HTTPAuthorizationCredentials = Depends(security)
# ):

#     # JWT token obtain
#     token = credentials.credentials


#     # ========================================================
#     # JWT VERIFICATION
#     # ========================================================

#     try:

#         # Token verify karke user information obtain.
#         payload = jwt.decode(
#             token,
#             SECRET_KEY,
#             algorithms=[ALGORITHM]
#         )

#     except:

#         # Invalid/expired token
#         raise HTTPException(
#             status_code=401,
#             detail="Invalid token"
#         )


#     # ========================================================
#     # AUTHORIZATION CHECK
#     # ========================================================

#     # URL mein requested user_id aur JWT ke user_id ko compare
#     # kar rahe hain.
#     #
#     # Example:
#     # JWT user_id = 8
#     # requested user_id = 8
#     # → Allowed ✅
#     #
#     # JWT user_id = 8
#     # requested user_id = 9
#     # → Not allowed ❌

#     if user_id != payload["user_id"]:

#         raise HTTPException(
#             status_code=403,
#             detail="Not allowed"
#         )


#     # ========================================================
#     # GET USER FROM DATABASE
#     # ========================================================

#     db = SessionLocal()

#     user = db.query(Usermodel).filter(
#         Usermodel.id == user_id
#     ).first()

#     db.close()


#     # Password intentionally return nahi kar rahe.
#     return {
#         "id": user.id,
#         "name": user.name,
#         "email": user.email
#     }