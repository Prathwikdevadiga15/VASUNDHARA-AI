from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import require
from app.ml.model_registry import MODELS
from app.models import User
from app.services.analytics_service import report_counts

router = APIRouter()


@router.get("/overview")
def overview(user: User = Depends(require("alert:read")), db: Session = Depends(get_db)):
    return {"reports_by_status": report_counts(db), "models": MODELS}
