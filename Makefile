.SILENT:

up:
	docker compose up -d --build

e2e:
	make db && make migrate && make up

logs:
	docker compose logs -f --tail=200

down:
	docker compose down -v

migrate:
	docker compose exec backend alembic upgrade head || true

rev:
	docker compose exec backend alembic revision --autogenerate -m "update"

format:
	docker compose exec backend ruff format .
	docker compose exec backend ruff check --fix .

test:
	docker compose exec backend pytest -q
