from app.workers.celery_app import celery


@celery.task
def ingest_firms_hotspots():
    """Planned: pull NASA FIRMS hotspots for the pilot region and create UNVERIFIED alerts."""
    raise NotImplementedError("Implement with data-pipeline/satellite/firms_fetch.py")
