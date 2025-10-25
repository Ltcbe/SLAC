from pydantic import BaseModel, Field
from typing import Any, List, Optional

class Stop(BaseModel):
    name: str
    time: int  # epoch seconds

class TripIn(BaseModel):
    ext_id: str
    route_code: str
    departure_ts: int
    arrival_ts: int
    delay_sec: int = 0
    status: str
    stops: List[Stop] = Field(default_factory=list)
    raw: Any = {}
    hash: Optional[str] = None

class TripOut(BaseModel):
    id: int
    ext_id: str
    route_code: str
    departure_ts: int
    arrival_ts: int
    delay_sec: int
    status: str
    stops: List[Stop]
