FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
# Prefer pre-built wheels when available to avoid long source builds
RUN pip install --no-cache-dir --prefer-binary -r requirements.txt

COPY . .

# Use shell form so $PORT env var from the host is respected (default 8000)
CMD ["sh", "-c", "python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
