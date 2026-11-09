import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import require
from app.models import Report, User
from app.repositories import report_repo as repo
from app.schemas import ReportIn, ReportOut, VerifyIn

router = APIRouter()


@router.post("", response_model=ReportOut, status_code=201)
def create_report(data: ReportIn, user: User = Depends(require("report:create")), db: Session = Depends(get_db)):
    r = repo.create(db, user.id, data.model_dump())
    repo.audit(db, user.id, "report.create", "report", str(r.id))
    return r


@router.get("", response_model=list[ReportOut])
def my_reports(user: User = Depends(require("alert:read")), db: Session = Depends(get_db)):
    return repo.list_for(db, user.id, user.role_names)


@router.get("/public", response_model=list[ReportOut])
def public_reports(db: Session = Depends(get_db)):
    """Returns verified ecological incidents for the public live map."""
    rows = db.scalars(
        select(Report)
        .where(Report.status.in_(["submitted", "verified", "investigating", "resolved"]))
        .order_by(Report.created_at.desc())
        .limit(50)
    ).all()
    return list(rows)


@router.post("/{report_id}/verify", response_model=ReportOut)
def verify(report_id: uuid.UUID, body: VerifyIn, user: User = Depends(require("report:verify")), db: Session = Depends(get_db)):
    r = db.get(Report, report_id)
    if not r:
        raise HTTPException(404, "Report not found.")
    if body.decision not in repo.TRANSITIONS.get(r.status, set()):
        raise HTTPException(409, f"A {r.status} report cannot be marked {body.decision}.")
    r.status = body.decision
    r.assigned_to = user.id
    db.commit()
    repo.audit(db, user.id, f"report.{body.decision}", "report", str(r.id))
    return r
