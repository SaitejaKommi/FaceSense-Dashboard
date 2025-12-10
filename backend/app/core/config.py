from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    ENV: str = "development"

    # MongoDB Database
    MONGO_URI: str = "mongodb://localhost:27017"
    MONGO_DB: str = "facesense"

    # JWT & Auth
    JWT_SECRET: str = "your-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day

    # Google Auth
    GOOGLE_CLIENT_ID: str = "510613444416-q052kvlak7f2nn0ga4736b257rvlppni.apps.googleusercontent.com"

    # CORS - Allow specific origins in development
    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "http://localhost:8080",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8080"
    ]

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
