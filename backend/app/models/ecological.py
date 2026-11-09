import uuid
from datetime import datetime, timezone
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, JSON, String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.user import now


class Forest(Base):
    __tablename__ = "forests"
    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String, index=True)
    state: Mapped[str | None] = mapped_column(String(80), default="Karnataka")
    protected_status: Mapped[str | None] = mapped_column(String(80), default="National Park")
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    area_sq_km: Mapped[float | None] = mapped_column(Float, nullable=True)


class Biodiversity(Base):
    __tablename__ = "biodiversity"
    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    scientific_name: Mapped[str] = mapped_column(String, unique=True, index=True)
    common_name: Mapped[str | None] = mapped_column(String, index=True)
    iucn_status: Mapped[str | None] = mapped_column(String(20), default="LC")
    is_sensitive: Mapped[bool] = mapped_column(Boolean, default=False)
    taxa: Mapped[str | None] = mapped_column(String(50), default="Mammal")
    description: Mapped[str | None] = mapped_column(Text, nullable=True)


class WildlifeSighting(Base):
    __tablename__ = "wildlife_sightings"
    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    species_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("biodiversity.id"), nullable=True)
    species_name: Mapped[str | None] = mapped_column(String, nullable=True)
    reported_by: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    latitude: Mapped[float] = mapped_column(Float)
    longitude: Mapped[float] = mapped_column(Float)
    observed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)
    source: Mapped[str] = mapped_column(String(40), default="camera_trap")
    confidence: Mapped[float | None] = mapped_column(Float, default=0.92)
    image_url: Mapped[str | None] = mapped_column(String, nullable=True)
    model_version: Mapped[str | None] = mapped_column(String, default="yolo-v8-fauna-v1.2")


class WaterReading(Base):
    __tablename__ = "water_readings"
    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    station_id: Mapped[str] = mapped_column(String(80), index=True)
    basin_name: Mapped[str | None] = mapped_column(String(100), default="Netravati Basin")
    latitude: Mapped[float] = mapped_column(Float)
    longitude: Mapped[float] = mapped_column(Float)
    ph: Mapped[float] = mapped_column(Float)
    turbidity_ntu: Mapped[float] = mapped_column(Float)
    temperature_c: Mapped[float] = mapped_column(Float)
    dissolved_oxygen_mgl: Mapped[float | None] = mapped_column(Float, default=7.2)
    is_simulated: Mapped[bool] = mapped_column(Boolean, default=False)
    measured_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)


class SatelliteObservation(Base):
    __tablename__ = "satellite_observations"
    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    forest_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("forests.id"), nullable=True)
    forest_name: Mapped[str | None] = mapped_column(String, nullable=True)
    source: Mapped[str] = mapped_column(String, default="Sentinel-2")
    scene_id: Mapped[str | None] = mapped_column(String, nullable=True)
    captured_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)
    mean_ndvi: Mapped[float] = mapped_column(Float)
    cloud_cover_pct: Mapped[float | None] = mapped_column(Float, default=5.0)


class Incident(Base):
    __tablename__ = "incidents"
    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    report_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("environmental_reports.id"))
    verified_by: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    severity: Mapped[str | None] = mapped_column(String(30), default="medium")
    verification_status: Mapped[str | None] = mapped_column(String(30), default="verified")
    verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class Investigation(Base):
    __tablename__ = "investigations"
    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    report_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("environmental_reports.id"))
    officer_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    action_taken: Mapped[str | None] = mapped_column(Text, nullable=True)
    outcome: Mapped[str | None] = mapped_column(String(60), default="Under Investigation")
    opened_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)
    closed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class ConservationProject(Base):
    __tablename__ = "conservation_projects"
    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    ngo_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    title: Mapped[str] = mapped_column(String, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    target_saplings: Mapped[int | None] = mapped_column(Integer, default=5000)
    planted_count: Mapped[int | None] = mapped_column(Integer, default=1250)
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    status: Mapped[str] = mapped_column(String(30), default="active")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)


class Volunteer(Base):
    __tablename__ = "volunteers"
    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("conservation_projects.id"))
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    full_name: Mapped[str] = mapped_column(String)
    email: Mapped[str] = mapped_column(String)
    joined_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)


class Document(Base):
    __tablename__ = "documents"
    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String, index=True)
    source_url: Mapped[str | None] = mapped_column(String, nullable=True)
    publisher: Mapped[str | None] = mapped_column(String, default="Government of India")
    category: Mapped[str | None] = mapped_column(String, default="Policy / Research")
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)


class DocumentChunk(Base):
    __tablename__ = "document_chunks"
    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    document_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("documents.id"))
    chunk_index: Mapped[int] = mapped_column(Integer)
    chunk_text: Mapped[str] = mapped_column(Text)
    metadata_json: Mapped[dict] = mapped_column(JSON, default=dict)

