from celery import Celery

from app.core.config import settings

celery = Celery("vasundhara", broker=settings.REDIS_URL, backend=settings.REDIS_URL)
celery.conf.beat_schedule = {}  # add periodic ingestion jobs here
