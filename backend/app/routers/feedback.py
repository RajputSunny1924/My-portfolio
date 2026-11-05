import hashlib
import secrets
from datetime import datetime, timedelta

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Header
)

from sqlalchemy.orm import Session
from sqlalchemy import func, or_

from app.database import get_db
from app.models import Feedback, User
from app.schemas import (
    FeedbackCreate,
    FeedbackUpdate,
    FeedbackVisibilityUpdate
)
from app.security import (
    verify_admin,
    verify_csrf_token
)


router = APIRouter(tags=["Feedback"])


def hash_edit_token(token: str) -> str:
    return hashlib.sha256(
        token.encode("utf-8")
    ).hexdigest()


def public_review(review):
    return {
        "id": review.id,
        "rating": review.rating,
        "message": review.message,
        "created_at": review.created_at.isoformat(),
        "updated_at": (
            review.updated_at.isoformat()
            if review.updated_at else None
        )
    }


def get_published_query(db: Session):
    return db.query(Feedback).filter(
        Feedback.status.in_(["published", "approved"])
    )


# PUBLIC: SUBMIT REVIEW

@router.post("/feedback")
def submit_feedback(
    data: FeedbackCreate,
    db: Session = Depends(get_db)
):
    if data.website and data.website.strip():
        raise HTTPException(
            status_code=400,
            detail="Invalid submission"
        )
    message = data.message.strip()

    if len(message) < 10:
        raise HTTPException(
            status_code=400,
            detail="Review must contain at least 10 characters"
        )

    duplicate_since = datetime.utcnow() - timedelta(minutes=10)

    duplicate = db.query(Feedback).filter(
        Feedback.message == message,
        Feedback.created_at >= duplicate_since
    ).first()

    if duplicate:
        raise HTTPException(
            status_code=429,
            detail="This review was recently submitted"
        )

    edit_token = secrets.token_urlsafe(32)

    review = Feedback(
        rating=data.rating,
        message=message,
        status="published",
        edit_token_hash=hash_edit_token(edit_token),
        created_at=datetime.utcnow()
    )

    try:
        db.add(review)
        db.commit()
        db.refresh(review)

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Unable to submit review"
        )

    return {
        "success": True,
        "message": "Review published successfully",
        "review": public_review(review),
        "edit_token": edit_token
    }


# PUBLIC: GET REVIEWS

@router.get("/feedback/public")
def get_public_feedback(
    db: Session = Depends(get_db)
):
    query = get_published_query(db)

    total_reviews = query.count()

    average_rating = (
        db.query(func.avg(Feedback.rating))
        .filter(
            Feedback.status.in_(["published", "approved"])
        )
        .scalar()
    )

    reviews = (
        query
        .order_by(Feedback.created_at.desc())
        .limit(50)
        .all()
    )

    return {
        "total_reviews": total_reviews,
        "average_rating": (
            round(float(average_rating), 1)
            if average_rating is not None else None
        ),
        "reviews": [
            public_review(review)
            for review in reviews
        ]
    }


# PUBLIC: EDIT OWN REVIEW

@router.patch("/feedback/{feedback_id}")
def edit_own_review(
    feedback_id: int,
    data: FeedbackUpdate,
    db: Session = Depends(get_db)
):
    review = db.query(Feedback).filter(
        Feedback.id == feedback_id
    ).first()

    if not review:
        raise HTTPException(
            status_code=404,
            detail="Review not found"
        )

    if not review.edit_token_hash:
        raise HTTPException(
            status_code=403,
            detail="This review cannot be edited"
        )

    supplied_hash = hash_edit_token(data.edit_token)

    if not secrets.compare_digest(
        supplied_hash,
        review.edit_token_hash
    ):
        raise HTTPException(
            status_code=403,
            detail="Invalid edit token"
        )

    message = data.message.strip()

    if len(message) < 10:
        raise HTTPException(
            status_code=400,
            detail="Review must contain at least 10 characters"
        )


    review.rating = data.rating

    review.message = message
    review.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(review)

    return {
        "success": True,
        "message": "Review updated successfully",
        "review": public_review(review)
    }


# ADMIN: GET REVIEWS

@router.get("/admin/feedback")
def get_admin_feedback(
    status: str = "all",
    search: str = "",
    page: int = 1,
    limit: int = 20,
    admin: User = Depends(verify_admin),
    db: Session = Depends(get_db)
):
    if status not in ["published", "hidden", "legacy", "all"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid review status"
        )

    if page < 1 or limit < 1 or limit > 100:
        raise HTTPException(
            status_code=400,
            detail="Invalid pagination values"
        )

    query = db.query(Feedback)

    if status == "published":
        query = query.filter(
            Feedback.status.in_(["published", "approved"])
        )

    elif status == "hidden":
        query = query.filter(
            Feedback.status == "hidden"
        )

    elif status == "legacy":
        query = query.filter(
            Feedback.status.in_(["pending", "rejected"])
        )

    if search.strip():
        term = f"%{search.strip()}%"

        query = query.filter(
            or_(
                Feedback.message.ilike(term),
            )
        )

    total = query.count()

    items = (
        query
        .order_by(Feedback.created_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return {
        "reviews": [
            {
                **public_review(item),
                "status": item.status
            }
            for item in items
        ],
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "total_pages": (total + limit - 1) // limit
        }
    }


# ADMIN: HIDE / UNHIDE REVIEW

@router.patch("/admin/feedback/{feedback_id}/status")
def update_feedback_status(
    feedback_id: int,
    data: FeedbackVisibilityUpdate,
    admin: User = Depends(verify_admin),
    _: None = Depends(verify_csrf_token),
    db: Session = Depends(get_db)
):
    review = db.query(Feedback).filter(
        Feedback.id == feedback_id
    ).first()

    if not review:
        raise HTTPException(
            status_code=404,
            detail="Review not found"
        )

    review.status = data.status
    db.commit()

    return {
        "success": True,
        "message": f"Review {data.status} successfully"
    }


# ADMIN: DELETE REVIEW

@router.delete("/admin/feedback/{feedback_id}")
def delete_feedback(
    feedback_id: int,
    admin: User = Depends(verify_admin),
    _: None = Depends(verify_csrf_token),
    db: Session = Depends(get_db)
):
    review = db.query(Feedback).filter(
        Feedback.id == feedback_id
    ).first()

    if not review:
        raise HTTPException(
            status_code=404,
            detail="Review not found"
        )

    db.delete(review)
    db.commit()

    return {
        "success": True,
        "message": "Review deleted successfully"
    }