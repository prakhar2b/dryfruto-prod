# DryFruto - Hostinger Docker Manager Setup

## Domain: statellmarketing.com

## Container Names

| Service | Container Name |
|---------|----------------|
| MongoDB | sm2024db01 |
| Backend API | sm2024api01 |
| Frontend | sm2024web01 |
| Nginx Proxy | sm2024proxy01 |

---

## Access URLs

| Protocol | Port | URL |
|----------|------|-----|
| HTTP | 9001 | `http://statellmarketing.com:9001` |
| HTTPS | 9443 | `https://statellmarketing.com:9443` |
| Admin | 9001 | `http://statellmarketing.com:9001/admin` |

---

## SSL Certificate (Inside Docker)

SSL certificates are generated **automatically inside the Docker container**:

1. **Default behavior (GENERATE_SSL=false)**: Creates a self-signed certificate
   - HTTPS works immediately but browsers will show a security warning
   - Good for testing

2. **Let's Encrypt (GENERATE_SSL=true)**: Attempts to get a real certificate
   - Requires port 80 to be accessible from the internet
   - Domain must point to your server's IP

### To enable Let's Encrypt:
Edit `docker-compose.yml` and set:
```yaml
environment:
  - GENERATE_SSL=true
  - SSL_EMAIL=your-email@example.com
```

Then rebuild and restart:
```bash
docker-compose down
docker-compose up -d --build
```

---

## Quick Setup Steps

### 1. DNS Configuration in Hostinger

Login to [Hostinger Control Panel](https://hpanel.hostinger.com):

1. Go to **Domains** → **statellmarketing.com**
2. Click **DNS / Nameservers**
3. Add these A records:

| Type | Name | Points To | TTL |
|------|------|-----------|-----|
| A | @ | YOUR_VPS_IP | 14400 |
| A | www | YOUR_VPS_IP | 14400 |

### 2. Deploy via Docker Manager

1. In Hostinger panel, go to **VPS** → **Docker Manager**
2. Click **Create New Project**
3. Connect your GitHub repository
4. Select `docker-compose.yml`
5. Click **Deploy**

### 3. Test Access

After deployment:
- HTTP: `http://statellmarketing.com:9001`
- HTTPS: `https://statellmarketing.com:9443` (may show security warning with self-signed cert)

---

## Admin Panel Features

### Seed Initial Data
- Go to Admin Panel → Dashboard
- Click "Seed Initial Data" button to reset all data to defaults
- Useful for fresh start or testing

---

## Architecture

```
Internet
    │
    ├─── Port 9001 (HTTP)
    │
    └─── Port 9443 (HTTPS)
         │
         ▼
┌─────────────────────────────────────┐
│      sm2024proxy01 (Nginx)          │
│   + SSL Certificate Generation      │
└─────────────────┬───────────────────┘
                  │
    ┌─────────────┼───────────────┐
    ▼             ▼               ▼
┌────────┐  ┌──────────┐  ┌───────────┐
│sm2024  │  │ sm2024   │  │ sm2024    │
│web01   │  │ api01    │  │ db01      │
│Frontend│  │ Backend  │  │ MongoDB   │
│ :80    │  │  :8001   │  │ :27017    │
│React   │  │ FastAPI  │  │           │
└────────┘  └──────────┘  └───────────┘
```

---

## Useful Commands

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker logs sm2024api01
docker logs sm2024proxy01

# Restart all services
docker-compose restart

# Rebuild and redeploy
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Check SSL certificate
docker exec sm2024proxy01 cat /etc/letsencrypt/live/statellmarketing.com/fullchain.pem

# Regenerate SSL certificate
docker exec sm2024proxy01 /generate-ssl.sh

# Check container status
docker ps
```

---

## Troubleshooting

### Website not loading?
```bash
docker ps
# Check all containers are running
```

### SSL certificate issues?
```bash
docker logs sm2024proxy01
# Look for SSL generation messages
```

### Data not showing?
- Go to Admin Panel → Dashboard
- Click "Seed Initial Data" to populate default data

### Backend errors?
```bash
docker logs sm2024api01
```

---

## Firewall Configuration

Make sure these ports are open:
```bash
ufw allow 9001/tcp   # HTTP
ufw allow 9443/tcp   # HTTPS
ufw allow 22/tcp     # SSH
```
