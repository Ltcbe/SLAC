# SLAC

Smart Live Arrivals & Connections — suivi temps réel et archivage de trajets ferroviaires.

## Démarrage rapide

```bash
cp .env.example .env
make up
make migrate
```

- API: http://localhost:8000/docs
- Frontend: http://localhost:5173
- Prometheus: http://localhost:9090

## Flux de données

iRail → collector (poll 3 min, multi-lignes) → POST `/api/trips` backend → DB → API + WebSocket → Frontend

## Tests

```bash
make test
```
