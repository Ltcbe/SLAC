FROM python:3.11-slim
WORKDIR /app
COPY pyproject.toml .
RUN pip install --no-cache-dir uv pip-tools && pip install --no-cache-dir -e .
COPY app ./app
COPY alembic.ini .
COPY alembic ./alembic
ENV PYTHONUNBUFFERED=1
