from pydantic import BaseModel

class UserCreate(BaseModel):
    name:str
    email:str
    password:str

class UserLogin(BaseModel):
    email:str
    password:str

class RegisterResponse(BaseModel):
    message:str
    user_id:int

class LoginResponse(BaseModel):
    message:str
    access_token:str
    token_type:str

class VerifyEmail(BaseModel):
    email: str
    otp: str