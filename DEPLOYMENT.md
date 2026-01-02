# DryFruto Production Deployment Guide

## Domain: dryfruto.com

## Architecture

```
                    Internet
                        │
                        ▼
         ┌──────────────────────────────┐
         │     dryfruto.com             │
         │   (DNS → Server IP)          │
         └──────────────────────────────┘
                        │
         ┌──────────────┴──────────────┐
         │                             │
         ▼                             ▼
    Port 80 (HTTP)              Port 443 (HTTPS)
         │                             │
         └──────────┬──────────────────┘
                    │
                    ▼
         ┌──────────────────────────────┐
         │        NGINX Container       │
         │   (SSL + Reverse Proxy)      │
         │   - Auto HTTP→HTTPS redirect │
         │   - Let's Encrypt SSL        │
         └──────────────────────────────┘
                    │
         ┌──────────┴──────────┐
         │                     │
         ▼                     ▼
    /api/* routes         /* routes
         │                     │
         ▼                     ▼
   ┌───────────┐        ┌───────────┐
   │  Backend  │        │ Frontend  │
   │  (8001)   │        │   (80)    │
   │  FastAPI  │        │   React   │
   └─────┬─────┘        └───────────┘
         │
         ▼
   ┌───────────┐
   │  MongoDB  │
   │  (27017)  │
   └───────────┘
```

## Pre-requisites

1. **Server** with Docker and Docker Compose installed
2. **Domain** dryfruto.com pointing to server IP (A record)
3. **Ports** 80 and 443 open in firewall

## Quick Deployment

### Option 1: Build Images Locally

```bash
# 1. Clone/upload project to server
cd /opt/dryfruto

# 2. Build all images
chmod +x build-images.sh
./build-images.sh

# 3. Create production environment file
cp .env.production .env
nano .env  # Edit JWT_SECRET!

# 4. Start all services
docker compose up -d

# 5. Check status
docker compose ps
docker compose logs -f nginx
```

### Option 2: Use Pre-built Images

If images are already pushed to a registry:

```bash
# 1. Create .env file
cat > .env << 'EOF'
DOMAIN=dryfruto.com
SSL_EMAIL=admin@dryfruto.com
JWT_SECRET=your_super_secure_secret_key_here
EOF

# 2. Start using production compose file
docker compose -f docker-compose.prod.yml up -d
```

## SSL Certificate

SSL is handled automatically:

1. **On first start**: Self-signed certificate is created
2. **After nginx starts**: Let's Encrypt certificate is obtained automatically
3. **Daily renewal**: Certificates are auto-renewed via cron

### Manual SSL Operations

```bash
# Check certificate status
docker compose exec nginx openssl x509 -in /etc/letsencrypt/live/dryfruto.com/fullchain.pem -text -noout | grep -A2 "Validity"

# Force certificate renewal
docker compose exec nginx certbot renew --force-renewal
docker compose exec nginx nginx -s reload

# View certificate logs
docker compose logs nginx | grep -i ssl
docker compose logs nginx | grep -i certbot
```

## Useful Commands

```bash
# View all logs
docker compose logs -f

# View specific service logs
docker compose logs -f nginx
docker compose logs -f backend
docker compose logs -f frontend

# Restart services
docker compose restart
docker compose restart nginx

# Stop all services
docker compose down

# Stop and remove volumes (⚠️ DATA LOSS)
docker compose down -v

# Rebuild and restart
docker compose up -d --build

# Check resource usage
docker stats
```

## Backup

```bash
# Backup MongoDB
docker compose exec mongodb mongodump --out /data/backup
docker cp dryfruto_db:/data/backup ./backup_$(date +%Y%m%d)

# Backup uploads
docker cp dryfruto_api:/app/uploads ./uploads_backup_$(date +%Y%m%d)

# Backup SSL certificates
docker cp dryfruto_proxy:/etc/letsencrypt ./ssl_backup_$(date +%Y%m%d)
```

## Troubleshooting

### SSL Certificate Issues

```bash
# Check if domain resolves correctly
dig dryfruto.com +short

# Test HTTP challenge path
curl -I http://dryfruto.com/.well-known/acme-challenge/test

# Manually obtain certificate
docker compose exec nginx certbot certonly --webroot \
    --webroot-path=/var/www/certbot \
    -d dryfruto.com -d www.dryfruto.com \
    --email admin@dryfruto.com --agree-tos
```

### Container Won't Start

```bash
# Check logs
docker compose logs backend
docker compose logs frontend

# Check health
docker compose ps

# Restart specific service
docker compose restart backend
```

### Database Connection Issues

```bash
# Check MongoDB health
docker compose exec mongodb mongosh --eval "db.runCommand('ping')"

# View MongoDB logs
docker compose logs mongodb
```

## Security Checklist

- [ ] Changed JWT_SECRET in .env
- [ ] Changed default admin password (admin/admin123)
- [ ] SSL certificate is valid (not self-signed)
- [ ] Firewall allows only ports 80, 443, 22
- [ ] Server SSH uses key authentication
- [ ] Regular backups configured

## Admin Access

- **URL**: https://dryfruto.com/admin
- **Default credentials**: admin / admin123
- **⚠️ Change password immediately after first login!**
