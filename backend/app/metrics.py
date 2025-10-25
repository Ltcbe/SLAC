from prometheus_client import Counter, Histogram

REQ_COUNT = Counter("http_requests_total", "Total HTTP requests", ["path", "method", "status"])
REQ_LAT = Histogram("http_request_duration_seconds", "Latency", ["path", "method"]) 
