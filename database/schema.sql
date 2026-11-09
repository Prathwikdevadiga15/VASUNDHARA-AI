-- VASUNDHARA AI : PostgreSQL + PostGIS + pgvector schema
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE roles (id SERIAL PRIMARY KEY, name VARCHAR(50) UNIQUE NOT NULL);
CREATE TABLE permissions (id SERIAL PRIMARY KEY, code VARCHAR(80) UNIQUE NOT NULL);
CREATE TABLE role_permissions (
  role_id INT REFERENCES roles(id) ON DELETE CASCADE,
  permission_id INT REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id));
CREATE TABLE user_roles (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_id INT REFERENCES roles(id),
  PRIMARY KEY (user_id, role_id));

CREATE TABLE forests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, state VARCHAR(80), protected_status VARCHAR(80),
  boundary GEOGRAPHY(MULTIPOLYGON, 4326));
CREATE INDEX forests_boundary_idx ON forests USING GIST (boundary);

CREATE TABLE environmental_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  category VARCHAR(80) NOT NULL,
  description TEXT NOT NULL,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'submitted'
    CHECK (status IN ('submitted','verified','rejected','investigating','resolved')),
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE INDEX reports_location_idx ON environmental_reports USING GIST (location);
CREATE INDEX reports_status_idx ON environmental_reports (status);

CREATE TABLE report_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES environmental_reports(id) ON DELETE CASCADE,
  storage_key TEXT NOT NULL, mime_type VARCHAR(80) NOT NULL, size_bytes INT NOT NULL CHECK (size_bytes > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());

CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES environmental_reports(id),
  verified_by UUID REFERENCES users(id),
  severity VARCHAR(30) CHECK (severity IN ('low','medium','high','critical')),
  verified_at TIMESTAMPTZ);
CREATE TABLE investigations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID NOT NULL REFERENCES incidents(id),
  officer_id UUID NOT NULL REFERENCES users(id),
  notes TEXT, outcome VARCHAR(60),
  opened_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), closed_at TIMESTAMPTZ);

CREATE TABLE biodiversity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scientific_name TEXT NOT NULL, common_name TEXT, iucn_status VARCHAR(10), is_sensitive BOOLEAN NOT NULL DEFAULT FALSE);
CREATE TABLE wildlife_sightings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  species_id UUID REFERENCES biodiversity(id), reported_by UUID REFERENCES users(id),
  location GEOGRAPHY(POINT, 4326) NOT NULL, observed_at TIMESTAMPTZ NOT NULL,
  source VARCHAR(40) NOT NULL, model_version TEXT, confidence REAL CHECK (confidence BETWEEN 0 AND 1));
CREATE INDEX sightings_location_idx ON wildlife_sightings USING GIST (location);

CREATE TABLE water_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id TEXT NOT NULL, location GEOGRAPHY(POINT, 4326),
  ph REAL CHECK (ph BETWEEN 0 AND 14), turbidity_ntu REAL, temperature_c REAL,
  is_simulated BOOLEAN NOT NULL DEFAULT FALSE, measured_at TIMESTAMPTZ NOT NULL);
CREATE INDEX water_station_time_idx ON water_readings (station_id, measured_at DESC);

CREATE TABLE satellite_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  forest_id UUID REFERENCES forests(id), source TEXT NOT NULL, scene_id TEXT,
  captured_at TIMESTAMPTZ NOT NULL, mean_ndvi REAL CHECK (mean_ndvi BETWEEN -1 AND 1), cloud_cover_pct REAL);

CREATE TABLE model_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, version TEXT NOT NULL, task TEXT NOT NULL,
  metrics JSONB NOT NULL DEFAULT '{}', trained_on TEXT, is_active BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE (name, version));
CREATE TABLE environmental_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID REFERENCES model_registry(id), forest_id UUID REFERENCES forests(id),
  location GEOGRAPHY(POINT, 4326), score REAL NOT NULL CHECK (score BETWEEN 0 AND 1),
  explanation JSONB NOT NULL DEFAULT '{}', data_sources TEXT[], created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());

CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, description TEXT,
  severity VARCHAR(30) NOT NULL CHECK (severity IN ('info','low','medium','high','critical')),
  location GEOGRAPHY(POINT, 4326), prediction_id UUID REFERENCES environmental_predictions(id),
  verification_status VARCHAR(20) NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('unverified','verified','dismissed')),
  verified_by UUID REFERENCES users(id), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, source_url TEXT, publisher TEXT, uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  chunk_index INT NOT NULL, chunk_text TEXT NOT NULL,
  embedding VECTOR(768) NOT NULL, metadata JSONB NOT NULL DEFAULT '{}');
-- Dimension must match the embedding model you choose.
CREATE INDEX chunks_embedding_idx ON document_chunks USING hnsw (embedding vector_cosine_ops);

CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role VARCHAR(12) NOT NULL CHECK (role IN ('user','assistant')), content TEXT NOT NULL,
  citations JSONB NOT NULL DEFAULT '[]', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());

CREATE TABLE conservation_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), ngo_id UUID NOT NULL REFERENCES users(id),
  title TEXT NOT NULL, description TEXT, area GEOGRAPHY(POLYGON, 4326),
  status VARCHAR(20) NOT NULL DEFAULT 'planned', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE volunteers (
  project_id UUID REFERENCES conservation_projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id), PRIMARY KEY (project_id, user_id));

CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY, actor_id UUID REFERENCES users(id), action TEXT NOT NULL,
  resource TEXT, resource_id TEXT, detail JSONB NOT NULL DEFAULT '{}', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE INDEX audit_time_idx ON audit_logs (created_at DESC);
