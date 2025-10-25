import httpx, hashlib
from tenacity import retry, stop_after_attempt, wait_fixed

BASE = "https://api.irail.be"

@retry(stop=stop_after_attempt(3), wait=wait_fixed(1))
async def fetch_journeys(origin: str, dest: str):
    params = {"format": "json", "lang": "fr", "from": origin, "to": dest}
    async with httpx.AsyncClient(timeout=20) as client:
        r = await client.get(f"{BASE}/connections/", params=params)
        r.raise_for_status()
        data = r.json()
        for j in data.get("connection", []):
            yield normalize(j, origin, dest)

def normalize(j: dict, origin: str, dest: str) -> dict:
    ext_id = j.get("id") or j.get("vehicle") or hashlib.sha256(repr(j).encode()).hexdigest()[:16]
    dep = int(j["departure"]["time"])  # epoch
    arr = int(j["arrival"]["time"])
    delay = int(j["departure"].get("delay", 0))
    status = "scheduled"
    stops = [
        {"name": s.get("station"), "time": int(s.get("time"))}
        for s in j.get("vias", {}).get("via", [])
    ]
    raw = j
    h = hashlib.sha256(repr({"dep": dep, "arr": arr, "delay": delay, "stops": stops}).encode()).hexdigest()
    return {
        "ext_id": ext_id,
        "route_code": f"{origin}->{dest}",
        "origin": origin,
        "dest": dest,
        "departure_ts": dep,
        "arrival_ts": arr,
        "delay_sec": delay,
        "status": status,
        "stops": stops,
        "raw": raw,
        "hash": h,
    }
