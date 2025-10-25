from pydantic_settings import BaseSettings
from typing import Any
import json

class Settings(BaseSettings):
    poll_seconds: int = 180
    lines_json: str = '[{"origin":"BE.NMBS.008814001","dest":"BE.NMBS.008894808"}]'
    backend_base_url: str = "http://backend:8000"
    api_key: str | None = None

    @property
    def lines(self) -> list[dict[str, Any]]:
        return json.loads(self.lines_json)

    model_config = {"env_prefix": "COLLECTOR_", "env_file": ".env"}

settings = Settings()
