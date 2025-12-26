# DryFruto Docker Deployment Guide

## Prerequisites
- Docker and Docker Compose installed
- Port 80 available

## Deployment Steps

### 1. Extract files
```bash
unzip dryfruto-docker-deployment.zip -d dryfruto
cd dryfruto
```

### 2. Build and start
```bash
docker-compose up -d --build
```

### 3. Seed the database (first time only)
```bash
curl -X POST http://localhost/api/seed-data
```

### 4. Access the site
Open http://srv1225994.hstgr.cloud in browser

## Useful Commands

```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop all
docker-compose down

# Rebuild from scratch
docker-compose down -v
docker-compose up -d --build
```

## Troubleshooting

If build fails, try:
```bash
docker system prune -a
docker-compose build --no-cache
docker-compose up -d
```