import time
from collections import defaultdict, deque
from .config import settings

_BUCKETS: dict[str, deque[float]] = defaultdict(deque)

def check_rate(ip: str) -> bool:
    now = time.time()
    window = settings.rate_limit_window_sec
    limit = settings.rate_limit_requests
    q = _BUCKETS[ip]
    while q and now - q[0] > window:
        q.popleft()
    if len(q) >= limit:
        return False
    q.append(now)
    return True
