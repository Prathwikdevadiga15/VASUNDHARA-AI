# VASUNDHARA AI – Database Architecture

**Database Engine:** PostgreSQL 16+ with PostGIS 3.4 & pgvector 0.7  
**Dual-Mode Development Engine:** SQLite (with JSON & spatial/vector fallback adapters for zero-friction local execution)

---

## 1. Schema ER Relationship Overview

```
       +-------------------+       1:N       +----------------------+
       |       users       |<--------------->|  user_roles / roles  |
       +-------------------+                 +----------------------+
          |             |
     1:N  |             |  1:N
          v             v
+-------------------+ +-------------------+
|environmental_     | |wildlife_sightings |
|reports            | +-------------------+
+-------------------+           | N:1
     | 1:N          | 1:1       v
     v              v     +---------------+
+-------------+ +-------+ |  biodiversity |
|report_media | |incid- | +---------------+
+-------------+ |ents   |
                +-------+
                    | 1:N
                    v
            +---------------+
            |investigations |
            +---------------+

+-------------------+       +-----------------------+
|  water_readings   |       |satellite_observations |
|  (River Basins)   |       | (Sentinel-2 NDVI)     |
+-------------------+       +-----------------------+

+-------------------+       +-----------------------+
|    documents      | 1:N   |  environmental_       |
|    (ISFR, WPA)    |------>|  predictions & ALERTS |
+-------------------+       +-----------------------+
          | 1:N
          v
+-------------------+
|  document_chunks  | (pgvector HNSW index, 768 dims)
+-------------------+
```

---

## 2. Table Specifications

### 2.1 Core Security & Access Control
- `users`: `id (UUID PK)`, `full_name`, `email (UNIQUE)`, `password_hash (Argon2id)`, `is_active`, `created_at`.
- `roles`: `id (SERIAL PK)`, `name ('citizen', 'officer', 'researcher', 'ngo', 'super_admin')`.
- `user_roles`: `(user_id, role_id) Composite PK`.
- `audit_logs`: `id (BIGSERIAL PK)`, `actor_id (FK users)`, `action`, `resource`, `resource_id`, `detail (JSONB)`, `created_at`.

### 2.2 Environmental Incidents & Field Investigation
- `environmental_reports`: `id (UUID PK)`, `user_id (FK users)`, `category ('illegal_logging', 'forest_fire', 'poaching', 'sand_mining', 'water_pollution')`, `description`, `location (GEOGRAPHY(POINT, 4326))`, `status ('submitted', 'investigating', 'verified', 'resolved', 'rejected')`, `assigned_to (FK users)`, `created_at`.
- `report_media`: `id (UUID PK)`, `report_id (FK reports)`, `storage_key`, `mime_type`, `size_bytes`, `created_at`.
- `incidents`: `id (UUID PK)`, `report_id (FK reports)`, `verified_by (FK users)`, `severity ('low', 'medium', 'high', 'critical')`, `verified_at`.
- `investigations`: `id (UUID PK)`, `incident_id (FK incidents)`, `officer_id (FK users)`, `notes`, `outcome`, `opened_at`, `closed_at`.

### 2.3 Ecological Intelligence
- `forests`: `id (UUID PK)`, `name`, `state`, `protected_status`, `boundary (GEOGRAPHY(MULTIPOLYGON, 4326))`.
- `biodiversity`: `id (UUID PK)`, `scientific_name`, `common_name`, `iucn_status`, `is_sensitive`.
- `wildlife_sightings`: `id (UUID PK)`, `species_id (FK biodiversity)`, `reported_by (FK users)`, `location (POINT)`, `observed_at`, `source ('camera_trap', 'citizen', 'ranger')`, `confidence`, `model_version`.
- `water_readings`: `id (UUID PK)`, `station_id`, `location (POINT)`, `ph`, `turbidity_ntu`, `temperature_c`, `dissolved_oxygen_mgl`, `is_simulated`, `measured_at`.
- `satellite_observations`: `id (UUID PK)`, `forest_id (FK forests)`, `source`, `scene_id`, `captured_at`, `mean_ndvi`, `cloud_cover_pct`.
- `alerts`: `id (UUID PK)`, `title`, `description`, `severity`, `location (POINT)`, `verification_status ('unverified', 'verified', 'dismissed')`, `verified_by (FK users)`, `created_at`.

### 2.4 Knowledge & RAG Storage
- `documents`: `id (UUID PK)`, `title`, `source_url`, `publisher`, `uploaded_by (FK users)`, `created_at`.
- `document_chunks`: `id (UUID PK)`, `document_id (FK documents)`, `chunk_index`, `chunk_text`, `embedding (VECTOR(768))`, `metadata (JSONB)`.
  - HNSW cosine indexing: `CREATE INDEX chunks_embedding_idx ON document_chunks USING hnsw (embedding vector_cosine_ops);`

