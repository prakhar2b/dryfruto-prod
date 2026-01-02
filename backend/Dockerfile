# DryFruto Backend - Production Image
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY . ./

# Create uploads directory
RUN mkdir -p /app/uploads

# Set environment defaults
ENV PYTHONUNBUFFERED=1
ENV MONGO_URL=mongodb://mongodb:27017
ENV DB_NAME=dryfruto

EXPOSE 8001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:8001/api/health || exit 1

# Start the server
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001"]
