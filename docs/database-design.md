# Database
Source of truth: database/schema.sql (PostGIS geography columns, pgvector embeddings, CHECK constraints, GIST/HNSW indexes).
The app's dev mode uses SQLAlchemy models with lat/lng floats so tests run on SQLite; production uses schema.sql.
Embedding dimension (768) must match your embedding model.
