from pydantic import BaseModel,Field,EmailStr

class UserCreate(BaseModel):
    name:str = Field(min_length=2, max_length=50)
    email:str
    password: str = Field(min_length=8, max_length=50)

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(max_length=128)


class VerifyEmail(BaseModel):
    email: EmailStr
    otp: str = Field(pattern=r"^\d{6}$")

class RegisterResponse(BaseModel):
    message:str
    user_id:int

class LoginResponse(BaseModel):
    message: str

