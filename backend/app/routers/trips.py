from fastapi import APIRouter, Depends, Request, HTTPException, Response
from sqlalchemy.orm import Session
from sqlalchemy import select, asc, desc
from cachetools import TTLCache
from ..db import get_db
from ..models import Trip, Route
from ..schemas import TripIn
from ..services import ingest_trip
from ..metrics import REQ_COUNT, REQ_LAT
from ..rate_limit import check_rate
from ..websocket import ws_manager
from ..deps import check_api_key

router = APIRouter(prefix="/api", tags=["trips"]) 
_cache = TTLCache(maxsize=1024, ttl=10)

@router.post("/trips", dependencies=[Depends(check_api_key)])
def post_trip(payload: TripIn, db: Session = Depends(get_db)):
    t = ingest_trip(db, payload.model_dump())
    # Push WS update
    import asyncio
    asyncio.create_task(ws_manager.broadcast({"type": "trip_ingested", "ext_id": t.ext_id, "id": t.id}))
    return {"id": t.id}

@router.get("/trips")
def list_trips(
    request: Request,
    db: Session = Depends(get_db),
    page: int = 1,
    page_size: int = 50,
    sort: str = "departure_ts",
    order: str = "desc",
    route_code: str | None = None,
    status: str | None = None,
    min_delay: int | None = None,
    max_delay: int | None = None,
):
    client_ip = request.client.host if request.client else "unknown"
    if not check_rate(client_ip):
        raise HTTPException(status_code=429, detail="rate limit exceeded")

    key = (page, page_size, sort, order, route_code, status, min_delay, max_delay)
    if key in _cache:
        return _cache[key]

    order_by = desc if order == "desc" else asc
    stmt = select(Trip, Route.code).join(Route, Trip.route_id == Route.id)
    if route_code:
        stmt = stmt.where(Route.code == route_code)
    if status:
        stmt = stmt.where(Trip.status == status)
    if min_delay is not None:
        stmt = stmt.where(Trip.delay_sec >= min_delay)
    if max_delay is not None:
        stmt = stmt.where(Trip.delay_sec <= max_delay)
    stmt = stmt.order_by(order_by(getattr(Trip, sort))).limit(page_size).offset((page-1)*page_size)

    with REQ_LAT.labels(path="/api/trips", method="GET").time():
        rows = db.execute(stmt).all()
    REQ_COUNT.labels(path="/api/trips", method="GET", status=200).inc()

    data = [
        {
            "id": t.id,
            "ext_id": t.ext_id,
            "route_code": code,
            "departure_ts": int(t.departure_ts.timestamp()),
            "arrival_ts": int(t.arrival_ts.timestamp()),
            "delay_sec": t.delay_sec,
            "status": t.status,
            "stops": t.stops,
        }
        for t, code in rows
    ]
    _cache[key] = {"items": data, "count": len(data)}
    return _cache[key]
