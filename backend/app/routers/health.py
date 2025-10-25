from fastapi import APIRouter

router = APIRouter(tags=["health"])

@router.get("/healthz")
def health():
    return {"status": "ok"}

@router.get("/readyz")
def ready():
    return {"status": "ready"}
