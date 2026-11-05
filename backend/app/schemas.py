from pydantic import BaseModel, Field, EmailStr
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional


class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=50)
    email: str
    password: str = Field(min_length=8, max_length=50)

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(max_length=128)


class VerifyEmail(BaseModel):
    email: EmailStr
    otp: str = Field(pattern=r"^\d{6}$")

class RegisterResponse(BaseModel):
    message: str
    user_id: int

class LoginResponse(BaseModel):
    message: str

class ResendOTP(BaseModel):
    email: EmailStr

class FeedbackCreate(BaseModel):

    rating: int = Field(ge=1, le=5)

    message: str = Field(min_length=10, max_length=1000)

    website: Optional[str] = Field(default="", max_length=200)


class FeedbackUpdate(BaseModel):
    edit_token: str = Field(min_length=32, max_length=128)

    rating: int = Field(ge=1, le=5)

    message: str = Field(min_length=10, max_length=1000)


class FeedbackVisibilityUpdate(BaseModel):
    status: str = Field(pattern="^(published|hidden)$")