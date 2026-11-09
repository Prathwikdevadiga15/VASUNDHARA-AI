from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    APP_ENV: str = "development"
    DATABASE_URL: str = "sqlite:///./dev.sqlite"
    JWT_SECRET: str = "dev-only-secret-not-for-production-use-0000"
    JWT_MINUTES: int = 60
    ALLOWED_ORIGINS: str = "http://localhost:3000"
    REDIS_URL: str = "redis://localhost:6379/0"
    GEMINI_API_KEY: str = ""
    NASA_FIRMS_API_KEY: str = ""


settings = Settings()
