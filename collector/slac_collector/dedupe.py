import hashlib

def trip_key(payload: dict) -> str:
    base = f"{payload['ext_id']}|{payload['route_code']}|{payload['hash']}"
    return hashlib.sha256(base.encode()).hexdigest()
