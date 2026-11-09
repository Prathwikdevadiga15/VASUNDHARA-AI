# VASUNDHARA AI – System Architecture

**Ecosystem:** India's Intelligent Biodiversity & Ecosystem Protection Network  
**Pilot Zone:** Western Ghats Ecological Corridor (Karnataka, India)

---

## 1. High-Level Architectural Diagram

```
+-----------------------------------------------------------------------------------+
|                           PRESENTATION LAYER (Next.js 15)                         |
|  * Landing & Mega-Menu Navigation   * Western Ghats GIS Live Map (Leaflet)       |
|  * ForestWatch AI (NDVI & Fires)    * BioTrack AI (Fauna CV & Bioacoustics)      |
|  * AquaGuard AI (River Basins)      * EcoPredict AI (XGBoost Early Warnings)     |
|  * JanRakshak (Citizen Multilingual)* Officer Investigation & Dispatch Workbench  |
|  * Research & Data Hub (Open Data)  * Admin Integration & Model Registry          |
+-----------------------------------------------------------------------------------+
                                         |
                                  REST APIs / JSON / JWT
                                         |
+-----------------------------------------------------------------------------------+
|                        APPLICATION API GATEWAY (FastAPI)                          |
|  * RBAC & Token Auth (Argon2id, JWT)* Strict Pydantic v2 Schema Validation        |
|  * In-Memory & Redis Rate Limiting  * Audit Logging & Immutable Security Trails  |
|  * Asynchronous Task Queuing        * Resilient Fallbacks & Mock-Mode Indicators  |
+-----------------------------------------------------------------------------------+
                                         |
             +---------------------------+---------------------------+
             |                                                       |
+---------------------------+                               +-----------------------+
|     AI & ML INFERENCE     |                               |   PERSISTENCE LAYER   |
| * Species Identification  |                               | * PostgreSQL + PostGIS|
|   (YOLO & Western Ghats   |                               | * pgvector Embeddings |
|    Fauna Classifier)      |                               | * SQLite Hybrid Dev   |
| * Multispectral NDVI      |                               |   Compatibility Mode  |
|   Change & Forest Loss    |                               | * S3 / Local Media    |
| * Explainable Fire Risk   |                               +-----------------------+
|   (XGBoost / Weather)     |                                           |
| * Bioacoustic Classifier  |                               +-----------------------+
|   (Threat Audio Analysis) |                               | EXTERNAL DATA BRIDGES |
| * RAG Assistant & Agent   |                               | * NASA FIRMS (Fires)  |
|   (Gemini + Vector Docs)  |                               | * Open-Meteo Weather  |
+---------------------------+                               | * GBIF Occurrences    |
                                                            | * Sentinel-2 Indices  |
                                                            +-----------------------+
```

---

## 2. Core Subsystems

### 2.1 ForestWatch AI
- **Purpose:** Early detection of canopy depletion, illegal clear-cutting, and fire risk before catastrophic loss occurs.
- **Workflow:** 
  1. Multispectral imagery (Red and Near-Infrared bands) is processed to compute Normalized Difference Vegetation Index (NDVI = (NIR - Red) / (NIR + Red)).
  2. Sequential temporal comparison computes pixel-level delta.
  3. Clusters with $\Delta \text{NDVI} < -0.2$ are classified as candidate forest loss and cross-referenced with NASA FIRMS thermal anomaly hotspots.

### 2.2 BioTrack AI
- **Purpose:** Automated wildlife monitoring, endangered species protection, and poaching deterrent.
- **Workflow:**
  1. Camera-trap and citizen wildlife photography uploaded.
  2. Computer vision classifier detects fauna (Bengal Tiger, Indian Elephant, Lion-tailed Macaque, Nilgiri Tahr, Malabar Hornbill, etc.) with confidence scoring and IUCN conservation status tagging.
  3. Forest bioacoustic analyzer screens acoustic telemetry for chainsaw vibrations, gunshot signatures, and wildlife distress calls.

### 2.3 AquaGuard AI
- **Purpose:** Safeguard critical Western Ghats river systems (Netravati, Kali, Sharavathi, Kaveri) against effluent discharge and siltation.
- **Workflow:**
  1. Telemetry ingestion across river monitoring stations tracking pH, Dissolved Oxygen (mg/L), Turbidity (NTU), Temperature (°C), and Conductivity.
  2. Rolling Z-score anomaly detection identifies rapid contamination spikes.
  3. Immediate critical alert routing to downstream municipal and forest conservator units.

### 2.4 EcoPredict AI
- **Purpose:** Proactive ecological forecasting rather than reactive disaster reporting.
- **Workflow:**
  1. Integrates real-time microclimate indicators (surface temperature, relative humidity, wind velocity, consecutive dry days) with biomass fuel dryness (NDVI).
  2. Computes an explainable fire-susceptibility and ecological hazard index.
  3. Breaks down individual feature contributions to give field rangers actionable insights.

### 2.5 JanRakshak Citizen Portal
- **Purpose:** Democratize conservation action through verified community reporting.
- **Features:** Geolocation auto-detection, multi-language UI (English, Kannada, Hindi), photo evidence attachment, voice-reporting simulation, and public tracking of report verification and officer resolution.

### 2.6 Forest Officer Workbench
- **Purpose:** Rapid triage, verification, and dispatch for field rangers.
- **Features:** Real-time priority inbox, satellite evidence inspector, one-click verification status transitions (`submitted` $\to$ `investigating` $\to$ `verified` / `resolved`), GPS route generation, and tamper-proof audit trails.

### 2.7 Environmental AI Assistant (Copilot & RAG)
- **Purpose:** Evidence-grounded environmental advisory and scientific research query engine.
- **Features:** Ingests official publications (Forest Survey of India ISFR 2023, Wildlife Protection Act, Western Ghats Ecology Expert Panel reports). Supports tool-calling for live environmental database queries with strict citation enforcement.

