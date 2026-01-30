FROM python:3.11-slim

WORKDIR /app

# Copy backend requirements
COPY backend/requirements.txt .
RUN pip install --no-cache-dir --prefer-binary -r requirements.txt

# Copy backend code
COPY backend ./app

# Set working directory to app for uvicorn
WORKDIR /app

# Use shell form so $PORT env var from the host is respected (default 8000)
CMD ["sh", "-c", "python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
