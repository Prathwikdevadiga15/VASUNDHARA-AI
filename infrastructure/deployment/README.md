Frontend: Vercel (root: frontend). Backend and worker: Render using backend/Dockerfile.
Database: Supabase or managed PostgreSQL with postgis and vector extensions, then run database/schema.sql and seed.sql.
Set every variable from .env.example in the host's secret manager. Set APP_ENV=production and a real JWT_SECRET.
