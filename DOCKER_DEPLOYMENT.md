# DryFruto Docker Deployment Guide

## Architecture

The application uses 4 Docker containers:

```
┌─────────────────────────────────────────────────────────────┐
│                      NGINX (Port 80/443)                     │
│                    Reverse Proxy + SSL                       │
├─────────────────────────────────────────────────────────────┤
│  /api/* → Backend Container     /* → Frontend Container      │
└──────────────┬────────────────────────────┬─────────────────┘
               │                            │
       ┌───────▼───────┐           ┌───────▼───────┐
       │   BACKEND     │           │   FRONTEND    │
       │  (Port 8001)  │           │   (Port 80)   │
       │   FastAPI     │           │  React/Nginx  │
       └───────┬───────┘           └───────────────┘
               │
       ┌───────▼───────┐
       │   MONGODB     │
       │ (Port 27017)  │
       └───────────────┘
```

## Internal Container Communication

- **Frontend → Backend**: All API calls use relative path `/api/*`
- **Nginx**: Routes `/api/*` to `backend:8001` and `/*` to `frontend:80`
- **Backend → MongoDB**: Connects via `mongodb://mongodb:27017`
- All containers communicate through the `app-network` Docker bridge network

## Quick Start (Local Testing)

```bash
# 1. Clone/navigate to project directory
cd /app

# 2. Build and start all containers
docker-compose up --build -d

# 3. Check container status
docker-compose ps

# 4. View logs
docker-compose logs -f

# 5. Access the application
# Open http://localhost in your browser
```

## Production Deployment (Hostinger VPS)

### Step 1: Prepare Server

```bash
# SSH into your VPS
ssh root@your-server-ip

# Install Docker and Docker Compose
curl -fsSL https://get.docker.com | sh
apt install docker-compose-plugin -y

# Create project directory
mkdir -p /opt/dryfruto
cd /opt/dryfruto
```

### Step 2: Upload Files

Upload these files to `/opt/dryfruto/`:
- `docker-compose.yml`
- `backend/` directory
- `frontend/` directory
- `nginx/` directory

### Step 3: Configure Environment

```bash
# Create .env file
cat > .env << 'EOF'
DOMAIN=yourdomain.com
SSL_EMAIL=your-email@domain.com
GENERATE_SSL=true
EOF
```

### Step 4: Deploy

```bash
# Build and start
docker compose up --build -d

# Check status
docker compose ps

# View logs
docker compose logs -f nginx
```

### Step 5: DNS Configuration

Point your domain's A record to your server's IP address.

## Useful Commands

```bash
# Stop all containers
docker compose down

# Restart a specific container
docker compose restart backend

# View container logs
docker compose logs -f backend
docker compose logs -f nginx

# Access MongoDB shell
docker compose exec mongodb mongosh dryfruto

# Rebuild and restart
docker compose up --build -d

# Check container health
docker compose ps
docker inspect dryfruto_api | grep -A 10 Health
```

## Troubleshooting

### Backend can't connect to MongoDB

```bash
# Check if MongoDB is healthy
docker compose ps mongodb

# View MongoDB logs
docker compose logs mongodb

# Manually test connection
docker compose exec backend curl -s http://localhost:8001/api/health
```

### Frontend shows blank page or API errors

```bash
# Check nginx logs
docker compose logs nginx

# Test API through nginx
curl http://localhost/api/health

# Check if backend is responding
docker compose exec nginx curl http://backend:8001/api/health
```

### SSL Certificate Issues

```bash
# Force regenerate SSL
docker compose exec nginx rm -rf /etc/letsencrypt/live/*
docker compose restart nginx
```

## Data Persistence

Docker volumes store persistent data:

- `mongodb_data`: Database files
- `uploads_data`: Uploaded images/files
- `ssl_certs`: SSL certificates

To backup:

```bash
# Backup MongoDB
docker compose exec mongodb mongodump --out /data/backup
docker cp dryfruto_db:/data/backup ./mongodb_backup

# Backup uploads
docker cp dryfruto_api:/app/uploads ./uploads_backup
```
