from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.deps import current_user
from app.core.ratelimit import rate_limit
from app.core.security import create_token, hash_password, verify_password
from app.models import Role, User
from app.schemas import LoginIn, RegisterIn, UserOut

router = APIRouter()


@router.post("/register", response_model=UserOut, status_code=201, dependencies=[Depends(rate_limit(10, 60))])
def register(data: RegisterIn, db: Session = Depends(get_db)):
    if db.scalar(select(User).where(User.email == data.email.lower())):
        raise HTTPException(409, "An account with this email already exists.")
    citizen = db.scalar(select(Role).where(Role.name == "citizen"))
    user = User(full_name=data.full_name, email=data.email.lower(), password_hash=hash_password(data.password), roles=[citizen])
    db.add(user)
    db.commit()
    return user  # Self-registration is always citizen. Other roles are granted by a super admin.


@router.post("/login", response_model=UserOut, dependencies=[Depends(rate_limit(10, 60))])
def login(data: LoginIn, response: Response, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == data.email.lower()))
    if not user or not user.is_active or not verify_password(data.password, user.password_hash):
        raise HTTPException(401, "Email or password is incorrect.")
    response.set_cookie("access_token", create_token(str(user.id), user.role_names), httponly=True,
                        samesite="lax", secure=settings.APP_ENV == "production", max_age=settings.JWT_MINUTES * 60)
    return user


@router.post("/logout", status_code=204)
def logout(response: Response):
    response.delete_cookie("access_token")


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(current_user)):
    return user
