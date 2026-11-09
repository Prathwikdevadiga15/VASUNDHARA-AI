import os
import sys
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select

from app.api.v1 import admin, alerts, analytics, auth, chatbot, forest, predictions, reports, water, wildlife
from app.core.config import settings
from app.core.database import Base, SessionLocal, engine
from app.core.permissions import ROLE_PERMISSIONS
from app.core.seeder import seed_database
from app.models import Role


def ensure_roles(db):
    have = set(db.scalars(select(Role.name)))
    for name in ROLE_PERMISSIONS:
        if name not in have:
            db.add(Role(name=name))
    db.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    if "pytest" in sys.modules or os.environ.get("PYTEST_CURRENT_TEST") or settings.APP_ENV in ("testing", "test"):
        yield
        return
    if settings.APP_ENV == "production" and settings.JWT_SECRET.startswith("dev-only"):
        raise RuntimeError("Set a real JWT_SECRET before running in production.")
    if settings.APP_ENV == "development":
        Base.metadata.create_all(engine)  # production uses database/schema.sql or migrations
    with SessionLocal() as db:
        ensure_roles(db)
        seed_database(db)
    yield


app = FastAPI(title="VASUNDHARA AI API", version="0.1.0", lifespan=lifespan,
              description="Environmental intelligence platform. See /docs for OpenAPI.")
app.add_middleware(CORSMiddleware, allow_origins=settings.ALLOWED_ORIGINS.split(","), allow_credentials=True,
                   allow_methods=["GET", "POST", "PUT", "DELETE"], allow_headers=["Content-Type", "Authorization"])

P = "/api/v1"
for mod, prefix in [(auth, "auth"), (reports, "reports"), (alerts, "alerts"), (forest, "forest"), (wildlife, "wildlife"),
                    (water, "water"), (predictions, "predictions"), (chatbot, "chat"), (admin, "admin"),
                    (analytics, "analytics")]:
    app.include_router(mod.router, prefix=f"{P}/{prefix}", tags=[prefix])


@app.get("/health")
def health():
    return {"status": "ok"}
