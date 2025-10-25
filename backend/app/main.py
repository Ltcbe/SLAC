from fastapi import FastAPI, WebSocket, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .logging import setup_logging
from .routers import trips, health
from .metrics import REQ_COUNT
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST
from .websocket import ws_manager

setup_logging()

app = FastAPI(title="SLAC API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(o) for o in settings.backend_cors_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(trips.router)

@app.middleware("http")
async def metrics_middleware(request: Request, call_next):
    response = await call_next(request)
    REQ_COUNT.labels(path=request.url.path, method=request.method, status=response.status_code).inc()
    return response

@app.get("/metrics")
def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

@app.websocket("/ws")
async def ws(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()  # keepalive/no-op
    finally:
        ws_manager.disconnect(websocket)
