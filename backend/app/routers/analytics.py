import secrets
from datetime import datetime

from fastapi import APIRouter, Depends, Request, Response, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import VisitorEvent


router = APIRouter(prefix="/analytics", tags=["Analytics"])


class PageViewRequest(BaseModel):
    page_path: str


@router.post("/page-view")
def track_page_view(
    data: PageViewRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
):
    page_path = data.page_path.strip()

    # Only accept valid internal page paths
    if (
        not page_path.startswith("/")
        or page_path.startswith("//")
        or len(page_path) > 255
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid page path"
        )

    # Get or create anonymous visitor ID
    visitor_id = request.cookies.get("visitor_id")

    if not visitor_id:
        visitor_id = secrets.token_urlsafe(24)

    # Get or create browsing session ID
    session_id = request.cookies.get("session_id")

    if not session_id:
        session_id = secrets.token_urlsafe(24)

    # Save page visit
    event = VisitorEvent(
        visitor_id=visitor_id,
        session_id=session_id,
        page_path=page_path,
        created_at=datetime.utcnow()
    )

    db.add(event)
    db.commit()

    # Cookie settings
    is_https = request.url.scheme == "https"
    same_site = "none" if is_https else "lax"

    response.set_cookie(
        key="visitor_id",
        value=visitor_id,
        max_age=60 * 60 * 24 * 180,
        httponly=True,
        secure=is_https,
        samesite=same_site,
        path="/"
    )

    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=True,
        secure=is_https,
        samesite=same_site,
        path="/"
    )

    return {
        "success": True,
        "message": "Page visit recorded"
    }