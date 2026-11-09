import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

Category = Literal["forest_fire", "illegal_logging", "wildlife_distress", "water_pollution", "poaching", "other"]

EmailPattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"


class RegisterIn(BaseModel):
    full_name: str = Field(min_length=2, max_length=150)
    email: str = Field(pattern=EmailPattern)
    password: str = Field(min_length=10, max_length=128)


class LoginIn(BaseModel):
    email: str = Field(pattern=EmailPattern)
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    full_name: str
    email: str
    roles: list[str] = Field(validation_alias="role_names")


class ReportIn(BaseModel):
    category: Category
    description: str = Field(min_length=5, max_length=2000)
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)


class ReportOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    category: str
    description: str
    latitude: float
    longitude: float
    status: str
    assigned_to: uuid.UUID | None
    created_at: datetime


class VerifyIn(BaseModel):
    decision: Literal["verified", "rejected"]


class RoleAssignIn(BaseModel):
    role: Literal["citizen", "officer", "researcher", "ngo", "super_admin"]


class FireRiskIn(BaseModel):
    temperature_c: float = Field(ge=-10, le=55)
    humidity_pct: float = Field(ge=0, le=100)
    wind_kmh: float = Field(ge=0, le=150)
    days_since_rain: int = Field(ge=0, le=365)
    ndvi: float = Field(ge=-1, le=1)


class ChatIn(BaseModel):
    question: str = Field(min_length=3, max_length=1000)


class WaterSeriesIn(BaseModel):
    values: list[float] = Field(min_length=8, max_length=10000)
    threshold: float = Field(default=3.0, gt=0)
