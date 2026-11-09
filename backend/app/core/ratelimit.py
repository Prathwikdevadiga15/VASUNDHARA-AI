import os
import time
from collections import defaultdict, deque

from fastapi import HTTPException, Request

from app.core.config import settings

_hits: dict[str, deque] = defaultdict(deque)


def rate_limit(max_calls: int, per_seconds: int):
    """In-memory limiter for one process. Use Redis for multi-instance deployments."""
    def dep(request: Request):
        if settings.APP_ENV in ("testing", "test") or os.environ.get("PYTEST_CURRENT_TEST"):
            return
        key = f"{request.url.path}:{request.client.host if request.client else 'x'}"
        now = time.time()
        q = _hits[key]
        while q and now - q[0] > per_seconds:
            q.popleft()
        if len(q) >= max_calls:
            raise HTTPException(429, "Too many requests. Try again shortly.")
        q.append(now)
    return dep
