from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import require
from app.models import Alert, User

router = APIRouter()


@router.get("")
def list_alerts(user: User = Depends(require("alert:read")), db: Session = Depends(get_db)):
    rows = db.scalars(select(Alert).order_by(Alert.created_at.desc()).limit(100))
    return [{"id": str(a.id), "title": a.title, "severity": a.severity,
             "verification_status": a.verification_status, "created_at": a.created_at} for a in rows]
