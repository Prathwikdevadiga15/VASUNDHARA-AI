from datetime import datetime, timedelta, timezone

try:
    from jose import jwt, JWTError
    PyJWTError = JWTError
except ImportError:
    import jwt
    PyJWTError = jwt.PyJWTError

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

from app.core.config import settings

_ph = PasswordHasher(time_cost=1, memory_cost=8192, parallelism=1)


def hash_password(p: str) -> str:
    return _ph.hash(p)


def verify_password(p: str, hashed: str) -> bool:
    try:
        return _ph.verify(hashed, p)
    except VerifyMismatchError:
        return False


def create_token(user_id: str, roles: list[str]) -> str:
    exp = datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_MINUTES)
    return jwt.encode({"sub": user_id, "roles": roles, "exp": exp}, settings.JWT_SECRET, algorithm="HS256")


def decode_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
    except PyJWTError:
        return None
