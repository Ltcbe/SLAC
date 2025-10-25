from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl
from typing import List

class Settings(BaseSettings):
    database_url: str
    backend_host: str = "0.0.0.0"
    backend_port: int = 8000
    backend_cors_origins: List[AnyHttpUrl] | List[str] = ["http://localhost:5173"]
    api_key: str | None = None
    rate_limit_requests: int = 100
    rate_limit_window_sec: int = 60
    cache_ttl_sec: int = 10

    model_config = {
        "env_prefix": "",
        "case_sensitive": False,
        "env_file": ".env",
    }

settings = Settings()
