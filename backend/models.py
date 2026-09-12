from sqlalchemy import Column, Integer, String,DateTime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    email = Column(String(100), unique=True)
    password = Column(String(200))

    verification_otp =Column(String(6),nullable=True)
    otp_expiry = Column(String(50), nullable=True)
