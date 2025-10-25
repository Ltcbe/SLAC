import asyncio
from .config import settings
from .irail_client import fetch_journeys
from .dedupe import trip_key
import httpx

_seen: set[str] = set()

async def run_once():
    async with httpx.AsyncClient(timeout=20) as client:
        for line in settings.lines:
            async for payload in fetch_journeys(line["origin"], line["dest"]):
                key = trip_key(payload)
                if key in _seen:
                    continue
                headers = {"X-API-Key": settings.api_key} if settings.api_key else {}
                try:
                    r = await client.post(f"{settings.backend_base_url}/api/trips", json=payload, headers=headers)
                    r.raise_for_status()
                    _seen.add(key)
                except Exception as e:
                    # log and continue
                    print({"error": str(e), "payload": payload.get("ext_id")})

async def loop_forever():
    while True:
        await run_once()
        await asyncio.sleep(settings.poll_seconds)
