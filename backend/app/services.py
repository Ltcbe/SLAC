from datetime import datetime
from sqlalchemy.orm import Session
from .repositories import get_or_create_route, upsert_trip

def ingest_trip(db: Session, payload: dict):
    route = get_or_create_route(db, payload["route_code"], payload.get("origin", ""), payload.get("dest", ""))
    t = upsert_trip(
        db,
        ext_id=payload["ext_id"],
        route=route,
        departure_ts=datetime.fromtimestamp(payload["departure_ts"]),
        arrival_ts=datetime.fromtimestamp(payload["arrival_ts"]),
        delay_sec=payload.get("delay_sec", 0),
        status=payload["status"],
        stops=[s.model_dump() if hasattr(s, "model_dump") else s for s in payload.get("stops", [])],
        raw=payload.get("raw", {}),
        hash_=payload.get("hash"),
    )
    return t
