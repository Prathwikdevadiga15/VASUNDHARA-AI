# VASUNDHARA AI – API Documentation

**Base Path:** `/api/v1`  
**OpenAPI Specification:** Available at `/docs` (Swagger UI) and `/redoc`

---

## 1. Authentication & User Management (`/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/register` | Register new citizen account with default role | No |
| `POST` | `/auth/login` | Authenticate and obtain HttpOnly session / JWT | No |
| `GET`  | `/auth/me` | Fetch authenticated user profile & roles | Yes |
| `POST` | `/auth/logout` | Invalidate active session cookie | Yes |

---

## 2. Environmental Reports & Citizen Verification (`/reports`)

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| `POST` | `/reports` | Submit geo-tagged environmental incident | `report:create` |
| `GET`  | `/reports` | List reports (filtered by user role) | `report:read_own` / `report:read_assigned` |
| `GET`  | `/reports/{id}` | Retrieve individual incident details | Resource owner or Officer |
| `POST` | `/reports/{id}/verify` | Officer verification (verify/reject) | `report:verify` |
| `POST` | `/reports/{id}/investigate`| Update investigation notes & status | `incident:update` |

---

## 3. ForestWatch AI (`/forest`)

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| `POST` | `/forest/ndvi-change` | Compute NDVI matrix & delta vegetation loss | `dataset:read` |
| `POST` | `/forest/analyze-scene` | Analyze satellite scene for deforestation candidates | `dataset:read` |
| `GET`  | `/forest/observations` | Fetch time-series Sentinel-2 observations | None / Public |
| `GET`  | `/forest/hotspots` | Fetch NASA FIRMS active fire hotspots | None / Public |

---

## 4. BioTrack AI (`/wildlife`)

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| `POST` | `/wildlife/identify` | Species computer vision classification | None / Public |
| `POST` | `/wildlife/audio-classify` | Forest bioacoustics threat analysis | None / Public |
| `GET`  | `/wildlife/sightings` | List verified camera trap & field sightings | `dataset:read` |
| `POST` | `/wildlife/sightings` | Log new field observation | `report:create` |

---

## 5. AquaGuard AI (`/water`)

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| `GET`  | `/water/stations` | List Western Ghats river monitoring stations | None / Public |
| `POST` | `/water/anomalies` | Compute Z-score anomaly detection on time-series | `dataset:read` |
| `POST` | `/water/readings` | Ingest sensor telemetry stream | Officer / Sensor Key |

---

## 6. EcoPredict AI (`/predictions`)

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| `POST` | `/predictions/fire-risk` | Calculate explainable fire risk index | `alert:read` |
| `GET`  | `/predictions/western-ghats` | Multi-district ecological risk scorecard | None / Public |

---

## 7. AI Environmental Copilot & RAG (`/chat`)

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| `POST` | `/chat` | Grounded Q&A with RAG retrieval & citations | 20 req/min |
| `POST` | `/chat/agent` | Autonomous tool-calling environmental agent | 10 req/min |

---

## 8. Environmental Alerts (`/alerts`)

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| `GET`  | `/alerts` | Get active environmental warnings | None / Public |
| `POST` | `/alerts` | Dispatch early warning alert | `incident:update` |

---

## 9. Admin & System Management (`/admin`)

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| `GET`  | `/admin/users` | List platform accounts and assigned roles | `admin:users` |
| `GET`  | `/admin/audit-logs` | Retrieve immutable audit trail entries | `admin:audit` |
| `GET`  | `/admin/integrations`| Check status of external APIs (FIRMS, Gemini, etc.) | `admin:users` |
| `GET`  | `/admin/stats` | Platform operational health & incident metrics | `admin:users` |

