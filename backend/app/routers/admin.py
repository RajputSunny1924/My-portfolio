from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
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
