# DryFruto - Hostinger Docker Manager Setup

## Domain: statellmarketing.com

## Container Names

| Service | Container Name |
|---------|----------------|
| MongoDB | sm2024db01 |
| Backend API | sm2024api01 |
| Frontend | sm2024web01 |
| Nginx Proxy | sm2024proxy01 |
| Certbot SSL | sm2024ssl01 |

---

## Auto-Seeded Data

When you first deploy, the database will **automatically be populated** with default data:
- **12 Products** (almonds, cashews, walnuts, etc.)
- **6 Categories** (Nuts & Dry Fruits, Dates, Seeds, etc.)
- **3 Hero Slides**
- **6 Testimonials**
- **6 Gift Boxes**
- **Site Settings** (business name, contact info, etc.)

No manual seeding required! The backend auto-seeds on startup when the database is empty.

---

## Access URLs

| Protocol | Port | URL |
|----------|------|-----|
| HTTP | 9001 | `http://statellmarketing.com:9001` |
| HTTPS | 9443 | `https://statellmarketing.com:9443` |
| Admin | 9001 | `http://statellmarketing.com:9001/admin` |

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

### 3. Test HTTP First

After deployment, test HTTP access:
```
http://statellmarketing.com:9001
```

The website should load with all products and data already populated!

If HTTP works, proceed to SSL setup.

---

## SSL/HTTPS Configuration (Port 9443)

### Why HTTPS shows error initially?
HTTPS requires SSL certificates. Without certificates, nginx cannot start the HTTPS server, causing connection errors on port 9443.

### Step-by-Step SSL Setup:

#### Step 1: SSH into your Hostinger VPS
```bash
ssh root@YOUR_VPS_IP
```

#### Step 2: Navigate to project directory
```bash
cd /docker/dryfruto-vikram
# OR find your project:
ls /docker/
```

#### Step 3: Create certbot directories
```bash
mkdir -p certbot/conf certbot/www
```

#### Step 4: Get SSL Certificate from Let's Encrypt
```bash
# Stop nginx temporarily (it's blocking port 80 needed for verification)
docker-compose stop nginx

# Run certbot to get certificate
docker run -it --rm \
  -v $(pwd)/certbot/conf:/etc/letsencrypt \
  -v $(pwd)/certbot/www:/var/www/certbot \
  -p 80:80 \
  certbot/certbot certonly \
  --standalone \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email \
  -d statellmarketing.com \
  -d www.statellmarketing.com
```

#### Step 5: Verify certificate was created
```bash
ls certbot/conf/live/statellmarketing.com/
# Should show: fullchain.pem, privkey.pem, cert.pem, chain.pem
```

#### Step 6: Restart nginx with SSL
```bash
docker-compose up -d nginx
```

#### Step 7: Test HTTPS
```
https://statellmarketing.com:9443
```

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
│   statellmarketing.com              │
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
                │
                ▼
         Auto-seeds data
         on first startup
```

---

## Startup Sequence

1. **MongoDB** starts first and becomes healthy
2. **Backend** starts after MongoDB is healthy
   - Checks if database is empty
   - If empty, auto-seeds default data (products, categories, etc.)
   - Logs: "Auto-seed completed successfully!"
3. **Frontend** starts after Backend is healthy
4. **Nginx** starts and routes traffic

---

## Useful Commands

```bash
# View all logs
docker-compose logs -f

# View backend logs (check for auto-seed messages)
docker logs sm2024api01

# View nginx logs only
docker logs sm2024proxy01

# Restart all services
docker-compose restart

# Rebuild and redeploy
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Check container status
docker ps

# Access MongoDB
docker exec -it sm2024db01 mongosh

# Check if data was seeded
docker exec -it sm2024db01 mongosh dryfruto --eval "db.products.countDocuments()"
```

---

## Troubleshooting

### Data not showing on website?
Check if auto-seed ran:
```bash
docker logs sm2024api01 | grep -i seed
```

You should see:
```
Database is empty, auto-seeding with default data...
Seeded 6 categories
Seeded 12 products
...
Auto-seed completed successfully!
```

### Backend not starting?
```bash
docker logs sm2024api01
```

### MongoDB connection issues?
```bash
# Check if MongoDB is running
docker ps | grep mongodb

# Check MongoDB logs
docker logs sm2024db01
```

---

## Firewall Configuration

Make sure these ports are open on your VPS:

```bash
# Check firewall status
ufw status

# Open required ports
ufw allow 9001/tcp   # HTTP
ufw allow 9443/tcp   # HTTPS
ufw allow 22/tcp     # SSH

# Enable firewall
ufw enable
```
