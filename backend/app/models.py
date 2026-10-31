from sqlalchemy import Column, Integer, String, Boolean, DateTime
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)

    is_verified = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False, nullable=False)
    verification_otp = Column(String(255), nullable=True)
    otp_expiry = Column(DateTime, nullable=True)
    otp_attempts = Column(Integer, default=0, nullable=False)

class VisitorEvent(Base):
    __tablename__ = "visitor_events"

    id = Column(Integer, primary_key=True, index=True)

    visitor_id = Column(
        String(64),
        nullable=False,
        index=True
    )

    session_id = Column(
        String(64),
        nullable=False,
        index=True
    )

    page_path = Column(
        String(255),
        nullable=False,
        index=True
    )

    created_at = Column(
        DateTime,
        nullable=False,
        index=True
    )