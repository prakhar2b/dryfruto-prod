# DryFruto Docker Deployment Guide

## Architecture

The application uses 4 Docker containers with HTTPS-only access:

```
                    ┌─────────────────────────────────────────────────────┐
                    │              NGINX (Port 80 & 443)                  │
                    │         Reverse Proxy + SSL + Auth                  │
                    ├─────────────────────────────────────────────────────┤
                    │  HTTP (80)  → Auto-redirect to HTTPS                │
                    │  HTTPS (443):                                       │
                    │    /admin/* → Frontend (Protected with Basic Auth)  │
                    │    /api/*   → Backend (8001)                        │
                    │    /*       → Frontend (80) - Public                │
                    └─────────────────────────────────────────────────────┘
                                          │
               ┌──────────────────────────┼──────────────────────────┐
               │                          │                          │
       ┌───────▼───────┐          ┌───────▼───────┐          ┌───────▼───────┐
       │   FRONTEND    │          │   BACKEND     │          │   MONGODB     │
       │   (Port 80)   │          │  (Port 8001)  │          │ (Port 27017)  │
       │  React/Nginx  │          │   FastAPI     │◄────────►│   Database    │
       └───────────────┘          └───────────────┘          └───────────────┘
```

## Security Features

### HTTPS Only
- All HTTP traffic is automatically redirected to HTTPS
- SSL/TLS certificates (self-signed or Let's Encrypt)
- HSTS header enabled for maximum security

### Admin Panel Protection
- `/admin/*` routes protected with HTTP Basic Authentication
- Default credentials: `admin` / `admin123` (CHANGE IN PRODUCTION!)
- Credentials configurable via environment variables

## Quick Start (Local Testing)

```bash
# 1. Navigate to project directory
cd /app

# 2. Create environment file
cp .env.docker .env

# 3. Build and start all containers
docker-compose up --build -d

# 4. Access the application
# HTTP  → https://localhost (auto-redirects)
# HTTPS → https://localhost
# Admin → https://localhost/admin (requires login)
```

**Note:** For local testing with self-signed certificates, your browser will show a security warning. Click "Advanced" and proceed to accept the certificate.

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
# Create .env file with SECURE credentials
cat > .env << 'EOF'
DOMAIN=yourdomain.com
SSL_EMAIL=your-email@domain.com
GENERATE_SSL=true

# IMPORTANT: Use strong, unique credentials!
ADMIN_USER=your_admin_username
ADMIN_PASS=YourVerySecurePassword123!
EOF

# Secure the .env file
chmod 600 .env
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

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DOMAIN` | localhost | Your domain name |
| `SSL_EMAIL` | admin@example.com | Email for Let's Encrypt |
| `GENERATE_SSL` | false | Set to `true` for Let's Encrypt |
| `ADMIN_USER` | admin | Admin panel username |
| `ADMIN_PASS` | admin123 | Admin panel password |

## Useful Commands

```bash
# Stop all containers
docker compose down

# Restart a specific container
docker compose restart nginx

# View container logs
docker compose logs -f nginx
docker compose logs -f backend

# Update admin credentials
docker compose down
# Edit .env file with new ADMIN_USER and ADMIN_PASS
docker compose up -d

# Force SSL certificate regeneration
docker compose exec nginx rm -rf /etc/letsencrypt/live/*
docker compose restart nginx

# Access MongoDB shell
docker compose exec mongodb mongosh dryfruto
```

## Troubleshooting

### SSL Certificate Issues

```bash
# Check certificate status
docker compose exec nginx ls -la /etc/letsencrypt/live/

# View SSL generation logs
docker compose logs nginx | grep -i ssl

# Force regenerate
docker compose exec nginx rm -rf /etc/letsencrypt/live/*
docker compose restart nginx
```

### Admin Login Not Working

```bash
# Verify credentials file exists
docker compose exec nginx cat /etc/nginx/auth/.htpasswd

# Manually set new credentials
docker compose exec nginx htpasswd -bc /etc/nginx/auth/.htpasswd newuser newpassword
docker compose restart nginx
```

### HTTP Not Redirecting to HTTPS

```bash
# Test redirect
curl -I http://yourdomain.com

# Should show: HTTP/1.1 301 Moved Permanently
# Location: https://yourdomain.com/
```

## Data Persistence

Docker volumes store persistent data:

- `mongodb_data`: Database files
- `uploads_data`: Uploaded images/files
- `ssl_certs`: SSL certificates

### Backup Commands

```bash
# Backup MongoDB
docker compose exec mongodb mongodump --out /data/backup
docker cp dryfruto_db:/data/backup ./mongodb_backup

# Backup uploads
docker cp dryfruto_api:/app/uploads ./uploads_backup
```

## Security Checklist

- [ ] Changed default admin credentials
- [ ] Using strong password (12+ chars, mixed case, numbers, symbols)
- [ ] SSL certificate configured (GENERATE_SSL=true)
- [ ] Firewall configured (only ports 80, 443, 22 open)
- [ ] .env file permissions set to 600
- [ ] Regular backups configured
