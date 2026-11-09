import uuid

from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.permissions import has_permission
from app.core.security import decode_token
from app.models.user import User


from typing import Optional

def optional_user(request: Request, db: Session = Depends(get_db)) -> Optional[User]:
    token = request.cookies.get("access_token")
    auth = request.headers.get("authorization", "")
    if not token and auth.lower().startswith("bearer "):
        token = auth[7:]
    if not token:
        return None
    data = decode_token(token)
    if not data or "sub" not in data:
        return None
    try:
        user = db.get(User, uuid.UUID(data["sub"]))
        if not user or not user.is_active:
            return None
        return user
    except Exception:
        return None


def current_user(request: Request, db: Session = Depends(get_db)) -> User:
    token = request.cookies.get("access_token")
    auth = request.headers.get("authorization", "")
    if not token and auth.lower().startswith("bearer "):
        token = auth[7:]
    data = decode_token(token) if token else None
    if not data:
        raise HTTPException(401, "Sign in to continue.")
    user = db.get(User, uuid.UUID(data["sub"]))
    if not user or not user.is_active:
        raise HTTPException(401, "Account not found or disabled.")
    return user


def require(permission: str):
    def dep(user: User = Depends(current_user)) -> User:
        if not has_permission(user.role_names, permission):
            raise HTTPException(403, "Your role cannot perform this action.")
        return user
    return dep
