FROM python:3.11-slim
WORKDIR /app
COPY pyproject.toml .
RUN pip install --no-cache-dir -e .
COPY slac_collector ./slac_collector
ENV PYTHONUNBUFFERED=1
