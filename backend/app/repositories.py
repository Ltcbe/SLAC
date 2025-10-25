from sqlalchemy.orm import Session
from sqlalchemy import select, func
from .models import Trip, Route
from datetime import datetime

def get_or_create_route(db: Session, code: str, origin: str, dest: str) -> Route:
    r = db.execute(select(Route).where(Route.code == code)).scalar_one_or_none()
    if r:
        return r
    r = Route(code=code, origin=origin, dest=dest)
    db.add(r)
    db.commit(); db.refresh(r)
    return r

def upsert_trip(db: Session, *, ext_id: str, route: Route, departure_ts: datetime, arrival_ts: datetime, delay_sec: int, status: str, stops: list[dict], raw: dict, hash_: str | None):
    existing = db.execute(select(Trip).where(Trip.ext_id == ext_id)).scalar_one_or_none()
    if existing:
        changed = False
        if existing.hash != hash_:
            existing.delay_sec = delay_sec
            existing.status = status
            existing.stops = stops
            existing.raw = raw
            existing.hash = hash_
            existing.updated_at = func.now()
            changed = True
        if changed:
            db.add(existing)
            db.commit(); db.refresh(existing)
        return existing
    t = Trip(
        ext_id=ext_id,
        route_id=route.id,
        departure_ts=departure_ts,
        arrival_ts=arrival_ts,
        delay_sec=delay_sec,
        status=status,
        stops=stops,
        raw=raw,
        hash=hash_,
    )
    db.add(t)
    db.commit(); db.refresh(t)
    return t
