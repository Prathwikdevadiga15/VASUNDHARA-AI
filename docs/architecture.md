# Architecture
Modular monolith: Next.js frontend, one FastAPI backend, PostgreSQL (PostGIS + pgvector), Redis and Celery workers.
Heavy ML runs in workers or separate containers so web requests stay fast.

Flow: citizen report -> API (validated, audited) -> PostGIS -> map -> officer verifies -> dashboard counts update.
AI flow: data pipeline -> risk model (explained) -> UNVERIFIED alert -> officer verification -> published finding.

Principles: backend enforces roles; models are labelled with version and are only called trained once evaluated;
the assistant answers only from ingested verified documents and refuses otherwise.
