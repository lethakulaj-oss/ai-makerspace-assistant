from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://jayanth@localhost:5432/makerspace_db"

    # Groq (replaces Ollama)
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.1-8b-instant"

    # ChromaDB
    CHROMA_PERSIST_DIR: str = "./chroma_data"

    # API
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    DEBUG: bool = True

    # CORS — stored as JSON array string in .env
    CORS_ORIGINS: str = '["http://localhost:5173","http://localhost:5174","http://localhost:3000"]'

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
    }

settings = Settings()
