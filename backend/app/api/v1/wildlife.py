from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import current_user, require
from app.ml.wildlife_model import classify_wildlife_image, WESTERN_GHATS_SPECIES_CATALOG
from app.ml.audio_model import classify_forest_audio
from app.models import Biodiversity, User, WildlifeSighting

router = APIRouter()


class IdentifyIn(BaseModel):
    image_base64: Optional[str] = None
    filename: Optional[str] = None
    hint_tag: Optional[str] = None


class SightingIn(BaseModel):
    species_name: str
    latitude: float
    longitude: float
    source: Optional[str] = "camera_trap"
    confidence: Optional[float] = 0.92
    image_url: Optional[str] = None


class AudioClassifyIn(BaseModel):
    simulated_signature: Optional[str] = "chainsaw"
    filename: Optional[str] = None


@router.post("/identify")
async def identify_wildlife(
    body: Optional[IdentifyIn] = None,
    file: Optional[UploadFile] = File(None),
):
    """Computer Vision fauna classifier. Identifies Western Ghats wildlife species
    from image upload or JSON payload with confidence, IUCN status, and bounding boxes.
    """
    image_bytes = None
    hint = None
    fname = None

    if file:
        image_bytes = await file.read()
        fname = file.filename
        hint = file.filename
    elif body:
        hint = body.hint_tag or body.filename
        fname = body.filename

    result = classify_wildlife_image(image_bytes=image_bytes, image_filename=fname, hint_tag=hint)
    return result


@router.post("/audio-classify")
async def classify_audio(
    body: Optional[AudioClassifyIn] = None,
    file: Optional[UploadFile] = File(None),
):
    """Forest Bioacoustic Threat Classifier. Detects chainsaws, gunshots,
    animal alarm calls, and ambient canopy soundscapes.
    """
    audio_bytes = None
    fname = None
    sig = None

    if file:
        audio_bytes = await file.read()
        fname = file.filename
        sig = file.filename
    elif body:
        sig = body.simulated_signature
        fname = body.filename

    return classify_forest_audio(audio_bytes=audio_bytes, audio_filename=fname, simulated_signature=sig)


@router.get("/sightings")
def get_sightings(
    limit: int = 20,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(current_user),
):
    """Returns verified wildlife sightings.
    If the caller is not an officer/admin, sensitive species coordinates are fuzzed
    to protect endangered fauna from poaching.
    """
    sightings = db.execute(
        select(WildlifeSighting).order_by(WildlifeSighting.observed_at.desc()).limit(limit)
    ).scalars().all()

    is_privileged = user and any(r in user.role_names for r in ["officer", "super_admin"])

    results = []
    for s in sightings:
        lat = s.latitude
        lon = s.longitude
        # Fuzz coordinates by rounding to 1 decimal place (~10km) if sensitive and non-privileged
        if not is_privileged:
            lat = round(lat, 1)
            lon = round(lon, 1)

        results.append({
            "id": str(s.id),
            "species_name": s.species_name,
            "latitude": lat,
            "longitude": lon,
            "observed_at": s.observed_at.isoformat() if s.observed_at else None,
            "source": s.source,
            "confidence": s.confidence,
            "image_url": s.image_url,
            "is_coordinates_fuzzed": not is_privileged,
        })
    return results


@router.post("/sightings")
def create_sighting(
    data: SightingIn,
    db: Session = Depends(get_db),
    user: User = Depends(require("report:create")),
):
    s = WildlifeSighting(
        species_name=data.species_name,
        latitude=data.latitude,
        longitude=data.longitude,
        source=data.source or "citizen",
        confidence=data.confidence or 0.90,
        image_url=data.image_url,
        reported_by=user.id,
    )
    db.add(s)
    db.commit()
    db.refresh(s)
    return {"success": True, "id": str(s.id), "message": "Wildlife sighting recorded successfully."}


@router.get("/species")
def get_species_catalog(db: Session = Depends(get_db)):
    """Returns official Western Ghats biodiversity taxonomy catalog."""
    species = db.execute(select(Biodiversity)).scalars().all()
    if species:
        return [
            {
                "id": str(sp.id),
                "scientific_name": sp.scientific_name,
                "common_name": sp.common_name,
                "iucn_status": sp.iucn_status,
                "is_sensitive": sp.is_sensitive,
                "taxa": sp.taxa,
                "description": sp.description,
            }
            for sp in species
        ]
    return WESTERN_GHATS_SPECIES_CATALOG
