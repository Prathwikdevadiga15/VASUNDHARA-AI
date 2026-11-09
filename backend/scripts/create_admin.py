"""Create the first super admin: python scripts/create_admin.py email 'Full Name' password"""
import sys

from sqlalchemy import select

from app.core.database import Base, SessionLocal, engine
from app.core.security import hash_password
from app.main import ensure_roles
from app.models import Role, User

email, name, password = sys.argv[1:4]
Base.metadata.create_all(engine)
with SessionLocal() as db:
    ensure_roles(db)
    role = db.scalar(select(Role).where(Role.name == "super_admin"))
    db.add(User(full_name=name, email=email.lower(), password_hash=hash_password(password), roles=[role]))
    db.commit()
print("Super admin created.")
