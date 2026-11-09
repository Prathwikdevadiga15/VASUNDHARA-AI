import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import require
from app.models import AuditLog, Role, User
from app.repositories.report_repo import audit
from app.schemas import RoleAssignIn, UserOut

router = APIRouter()


@router.get("/users", response_model=list[UserOut])
def users(admin: User = Depends(require("admin:users")), db: Session = Depends(get_db)):
    return list(db.scalars(select(User).limit(500)))


@router.put("/users/{user_id}/role", response_model=UserOut)
def set_role(user_id: uuid.UUID, body: RoleAssignIn, admin: User = Depends(require("admin:users")), db: Session = Depends(get_db)):
    u = db.get(User, user_id)
    role = db.scalar(select(Role).where(Role.name == body.role))
    if not u or not role:
        raise HTTPException(404, "User or role not found.")
    u.roles = [role]
    db.commit()
    audit(db, admin.id, "admin.set_role", "user", str(u.id), {"role": body.role})
    return u


@router.get("/audit-logs")
def logs(admin: User = Depends(require("admin:audit")), db: Session = Depends(get_db)):
    rows = db.scalars(select(AuditLog).order_by(AuditLog.id.desc()).limit(200))
    return [{"id": r.id, "actor_id": str(r.actor_id) if r.actor_id else None, "action": r.action,
             "resource": r.resource, "created_at": r.created_at} for r in rows]
