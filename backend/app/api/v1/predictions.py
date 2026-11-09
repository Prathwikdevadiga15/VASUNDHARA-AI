from fastapi import APIRouter, Depends

from app.core.deps import require
from app.ml.risk_model import fire_risk
from app.models import User
from app.schemas import FireRiskIn

router = APIRouter()


@router.post("/fire-risk")
def predict(data: FireRiskIn, user: User = Depends(require("alert:read"))):
    return fire_risk(data)
