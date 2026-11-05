import secrets
from datetime import datetime

from fastapi import (
    APIRouter,
    Depends,
    Request,
    Response,
    HTTPException
)
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func, distinct
from jose import jwt, JWTError

from app.database import get_db
from app.models import VisitorEvent, User
from app.security import SECRET_KEY, ALGORITHM


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


class PageViewRequest(BaseModel):
    page_path: str


def is_admin_request(request: Request, db: Session) -> bool:
    """Exclude authenticated admin visits."""

    access_token = request.cookies.get("access_token")

    if not access_token:
        return False

    try:
        payload = jwt.decode(
            access_token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("user_id")

        if not user_id:
            return False

        user = db.query(User).filter(
            User.id == user_id
        ).first()

        return bool(user and user.is_admin)

    except JWTError:
        return False


@router.post("/page-view")
def track_page_view(
    data: PageViewRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
):
    page_path = data.page_path.strip()

    # Validate page path
    if (
        not page_path.startswith("/")
        or page_path.startswith("//")
        or len(page_path) > 255
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid page path"
        )

    # Exclude admin traffic
    if is_admin_request(request, db):
        return {
            "success": True,
            "tracked": False,
            "message": "Admin visit excluded"
        }

    # Read existing cookies
    visitor_id = request.cookies.get("visitor_id")
    session_id = request.cookies.get("session_id")

    visitor_cookie_received = bool(
        visitor_id and len(visitor_id) <= 64
    )

    session_cookie_received = bool(
        session_id and len(session_id) <= 64
    )

    # Generate missing or invalid IDs
    if not visitor_cookie_received:
        visitor_id = secrets.token_urlsafe(24)

    if not session_cookie_received:
        session_id = secrets.token_urlsafe(24)

    # Check whether this session was already counted
    existing_visit = (
        db.query(VisitorEvent.id)
        .filter(
            VisitorEvent.visitor_id == visitor_id,
            VisitorEvent.session_id == session_id
        )
        .first()
    )

    tracked = False

    if not existing_visit:
        event = VisitorEvent(
            visitor_id=visitor_id,
            session_id=session_id,
            page_path=page_path,
            created_at=datetime.utcnow()
        )

        db.add(event)
        db.commit()

        tracked = True

    # Detect HTTPS behind Render proxy
    forwarded_proto = request.headers.get(
        "x-forwarded-proto", ""
    ).split(",")[0].strip().lower()

    is_https = (
        request.url.scheme == "https"
        or forwarded_proto == "https"
    )

    same_site = "none" if is_https else "lax"

    # Persistent visitor cookie
    response.set_cookie(
        key="visitor_id",
        value=visitor_id,
        max_age=60 * 60 * 24 * 180,
        httponly=True,
        secure=is_https,
        samesite=same_site,
        path="/"
    )

    # Browser-session cookie
    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=True,
        secure=is_https,
        samesite=same_site,
        path="/"
    )

    response.headers["Cache-Control"] = "no-store"

    return {
        "success": True,
        "tracked": tracked,
        "message": (
            "Visit recorded"
            if tracked
            else "Session already counted"
        ),
        "diagnostics": {
            "visitor_cookie_received": visitor_cookie_received,
            "session_cookie_received": session_cookie_received,
            "visitor_cookie_created": not visitor_cookie_received,
            "session_cookie_created": not session_cookie_received,
            "secure_cookie": is_https,
            "request_scheme": request.url.scheme
        }
    }


@router.get("/public-stats")
def public_analytics_stats(
    response: Response,
    db: Session = Depends(get_db)
):
    # Count unique visitor-session combinations
    unique_sessions = (
        db.query(
            VisitorEvent.visitor_id,
            VisitorEvent.session_id
        )
        .distinct()
        .subquery()
    )

    total_visits = (
        db.query(func.count())
        .select_from(unique_sessions)
        .scalar() or 0
    )

    # Visitors having more than one session
    returning_query = (
        db.query(VisitorEvent.visitor_id)
        .group_by(VisitorEvent.visitor_id)
        .having(
            func.count(
                distinct(VisitorEvent.session_id)
            ) > 1
        )
        .subquery()
    )

    returning_visitors = (
        db.query(func.count())
        .select_from(returning_query)
        .scalar() or 0
    )

    response.headers["Cache-Control"] = "no-store"

    return {
        "total_visits": total_visits,
        "returning_visitors": returning_visitors
    }