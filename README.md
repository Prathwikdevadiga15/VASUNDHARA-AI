# VASUNDHARA AI
Predictive biodiversity and ecosystem protection network. Pilot region: Western Ghats, Karnataka.

## What works today
- Auth (Argon2, HttpOnly cookies), five roles enforced on the backend, audit log
- Citizen report -> database -> map -> officer verification -> analytics (the vertical slice)
- Baseline fire-risk API with per-factor contributions (rules, not a trained model)
- NDVI change API and water anomaly API (simple, tested maths)
- RAG assistant that refuses to answer without ingested verified sources
- 13 backend tests passing

## Not built yet (returns 501 or shows "not implemented")
Species identification, Sentinel-2 ingestion, sensor ingestion, trained fire model, officer/admin/NGO/researcher UIs,
file uploads, notifications, E2E tests.

## Run
1. `cp .env.example backend/.env` and edit values. `cp frontend/.env.local.example frontend/.env.local`
2. `docker compose up --build` (frontend :3000, API docs :8000/docs)
3. Create the first admin: `make admin EMAIL=you@x.in NAME="Your Name" PASS=a-long-password`

Without Docker: `cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload` (SQLite dev mode),
then `cd frontend && npm install && npm run dev`.

## Next milestones
1. Officer verification UI  2. Report photo upload  3. Ingest 3 to 5 real documents, then evaluate RAG retrieval
4. FIRMS hotspots -> unverified alerts  5. Train and evaluate the fire-risk model  6. Wildlife model

## Layout
See docs/ and the folder READMEs. Label simulated data on screen; never present it as a government alert.
