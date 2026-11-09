import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.report import AuditLog, Report

TRANSITIONS = {"submitted": {"verified", "rejected"}, "verified": {"investigating"},
               "investigating": {"resolved"}}


def create(db: Session, user_id: uuid.UUID, data: dict) -> Report:
    r = Report(user_id=user_id, **data)
    db.add(r)
    db.commit()
    return r


def list_for(db: Session, user_id: uuid.UUID, roles: list[str]) -> list[Report]:
    q = select(Report).order_by(Report.created_at.desc())
    if "super_admin" in roles:
        pass
    elif "officer" in roles:
        q = q.where(Report.assigned_to == user_id)
    else:
        q = q.where(Report.user_id == user_id)
    return list(db.scalars(q))


def audit(db: Session, actor: uuid.UUID | None, action: str, resource: str, resource_id: str, detail: dict | None = None):
    db.add(AuditLog(actor_id=actor, action=action, resource=resource, resource_id=resource_id, detail=detail or {}))
    db.commit()
