import os
os.environ["APP_ENV"] = "testing"
os.environ["PYTEST_CURRENT_TEST"] = "1"

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.config import settings
settings.APP_ENV = "testing"

from app.core.database import Base, get_db
from app.main import app, ensure_roles
from app.models import Role, User
from app.core.security import hash_password


@pytest.fixture()
def db():
    engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine, expire_on_commit=False)
    with Session() as s:
        ensure_roles(s)
        yield s


@pytest.fixture()
def client(db):
    app.dependency_overrides[get_db] = lambda: db
    yield TestClient(app)
    app.dependency_overrides.clear()


def make_user(db, email, role, password="correct-horse-battery"):
    r = db.scalar(select(Role).where(Role.name == role))
    u = User(full_name="Test User", email=email, password_hash=hash_password(password), roles=[r])
    db.add(u)
    db.commit()
    return u


def login(client, email, password="correct-horse-battery"):
    res = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert res.status_code == 200, res.text
    return client
