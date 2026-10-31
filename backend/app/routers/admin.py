from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, distinct
from datetime import datetime
from app.database import get_db
from app.models import User, VisitorEvent
from app.security import verify_admin

router = APIRouter(tags=["admin"])


# Admin-only test endpoint
@router.get("/admin/me")
def admin_profile(
    admin: User = Depends(verify_admin)
):
    return {
        "message": "Admin access successful",
        "id": admin.id,
        "name": admin.name,
        "email": admin.email,
        "is_admin": admin.is_admin
    }


# Admin Dashboard Statistics
@router.get("/admin/dashboard-stats")
def admin_dashboard_stats(
    admin: User = Depends(verify_admin),
    db: Session = Depends(get_db)
):
    total_users = db.query(User).count()

    verified_users = db.query(User).filter(
        User.is_verified == True
    ).count()

    unverified_users = db.query(User).filter(
        User.is_verified == False
    ).count()

    admin_users = db.query(User).filter(
        User.is_admin == True
    ).count()

    return {
        "total_users": total_users,
        "verified_users": verified_users,
        "unverified_users": unverified_users,
        "admin_users": admin_users
    }


@router.get("/admin/users")
def get_admin_users(
    search: str = "",
    page: int = 1,
    limit: int = 10,
    admin: User = Depends(verify_admin),
    db: Session = Depends(get_db)
):
    if page < 1 or limit > 100:
        raise HTTPException(
            status_code=400,
            detail = "page must be greater than 0"
        )
    if limit < 1 or limit > 100:
        raise HTTPException(
            status_code=400,
            detail = "limits must be betweem 1 to  100",
        )
    query = db.query(User)
    if search.strip():
        search_term = f"%{search.strip()}%"
        query = query.filter(
            (User.name.ilike(search_term)) |
            (User.email.ilike(search_term))
        )
    total_users = query.count()

    users = (
        query
        .order_by(User.id.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )
    return {
        "users": [
            {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "is_verified": user.is_verified,
                "is_admin": user.is_admin
            }
            for user in users

        ],
        "pagination":{
            "page":page,
            "limit":limit,
            "total":total_users,
            "total_pages":(total_users+limit - 1)//limit
        }
    }

# ==========================================
# ADMIN VISITOR ANALYTICS
# ==========================================

@router.get("/admin/analytics/overview")
def analytics_overview(
    admin: User = Depends(verify_admin),
    db: Session = Depends(get_db)
):
    now = datetime.utcnow()
    today_start = now.replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0
    )

    total_page_views = db.query(VisitorEvent).count()

    unique_visitors = (
        db.query(func.count(distinct(VisitorEvent.visitor_id)))
        .scalar() or 0
    )

    total_sessions = (
        db.query(func.count(distinct(VisitorEvent.session_id)))
        .scalar() or 0
    )

    today_page_views = (
        db.query(VisitorEvent)
        .filter(VisitorEvent.created_at >= today_start)
        .count()
    )

    today_visitors = (
        db.query(func.count(distinct(VisitorEvent.visitor_id)))
        .filter(VisitorEvent.created_at >= today_start)
        .scalar() or 0
    )

    returning_query = (
        db.query(VisitorEvent.visitor_id)
        .group_by(VisitorEvent.visitor_id)
        .having(
            func.count(distinct(VisitorEvent.session_id)) > 1
        )
        .subquery()
    )

    returning_visitors = (
        db.query(func.count())
        .select_from(returning_query)
        .scalar() or 0
    )

    return {
        "total_page_views": total_page_views,
        "unique_visitors": unique_visitors,
        "total_sessions": total_sessions,
        "today_page_views": today_page_views,
        "today_visitors": today_visitors,
        "returning_visitors": returning_visitors
    }


@router.get("/admin/analytics/recent-visits")
def recent_visits(
    admin: User = Depends(verify_admin),
    db: Session = Depends(get_db)
):
    visits = (
        db.query(VisitorEvent)
        .order_by(VisitorEvent.created_at.desc())
        .limit(20)
        .all()
    )

    return {
        "visits": [
            {
                "visitor": event.visitor_id[-8:],
                "page": event.page_path,
                "session": event.session_id[-8:],
                "visited_at": event.created_at.isoformat()
            }
            for event in visits
        ]
    }


@router.get("/admin/analytics/popular-pages")
def popular_pages(
    admin: User = Depends(verify_admin),
    db: Session = Depends(get_db)
):
    pages = (
        db.query(
            VisitorEvent.page_path,
            func.count(VisitorEvent.id).label("views")
        )
        .group_by(VisitorEvent.page_path)
        .order_by(func.count(VisitorEvent.id).desc())
        .limit(10)
        .all()
    )

    return {
        "popular_pages": [
            {
                "page": page,
                "views": views
            }
            for page, views in pages
        ]
    }