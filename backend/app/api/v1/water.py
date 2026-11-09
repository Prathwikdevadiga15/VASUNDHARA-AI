from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import current_user, require
from app.ml.water_model import zscore_anomalies
from app.models import User, WaterReading
from app.schemas import WaterSeriesIn

router = APIRouter()


class ReadingIn(BaseModel):
    station_id: str
    basin_name: Optional[str] = "Netravati River Basin"
    latitude: float
    longitude: float
    ph: float
    turbidity_ntu: float
    temperature_c: float
    dissolved_oxygen_mgl: Optional[float] = 7.4


@router.post("/anomalies")
def anomalies(data: WaterSeriesIn, user: User = Depends(require("dataset:read"))):
    return zscore_anomalies(data.values, data.threshold)


@router.get("/stations")
def get_stations(db: Session = Depends(get_db)):
    """Returns Western Ghats hydrological river monitoring stations with real-time indicators."""
    readings = db.execute(select(WaterReading).limit(50)).scalars().all()
    results = []
    for r in readings:
        status = "normal"
        if r.turbidity_ntu > 10.0 or r.ph < 6.5 or r.ph > 8.5:
            status = "anomaly_detected"

        results.append({
            "id": str(r.id),
            "station_id": r.station_id,
            "basin_name": r.basin_name,
            "latitude": r.latitude,
            "longitude": r.longitude,
            "ph": r.ph,
            "turbidity_ntu": r.turbidity_ntu,
            "temperature_c": r.temperature_c,
            "dissolved_oxygen_mgl": r.dissolved_oxygen_mgl,
            "measured_at": r.measured_at.isoformat() if r.measured_at else None,
            "status": status,
        })
    return results


@router.post("/readings")
def add_reading(
    data: ReadingIn,
    db: Session = Depends(get_db),
    user: User = Depends(require("dataset:read")),
):
    """Ingests sensor telemetry stream."""
    r = WaterReading(
        station_id=data.station_id,
        basin_name=data.basin_name,
        latitude=data.latitude,
        longitude=data.longitude,
        ph=data.ph,
        turbidity_ntu=data.turbidity_ntu,
        temperature_c=data.temperature_c,
        dissolved_oxygen_mgl=data.dissolved_oxygen_mgl,
        is_simulated=False,
    )
    db.add(r)
    db.commit()
    db.refresh(r)
    return {"success": True, "id": str(r.id), "message": "Telemetry reading ingested."}
