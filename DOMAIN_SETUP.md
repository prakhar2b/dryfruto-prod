# Connect dryfruto.com Domain - Step by Step Guide

## Overview

This guide explains how to connect your domain **dryfruto.com** to your server running the DryFruto application.

```
┌─────────────────────────────────────────────────────────────────┐
│                         HOW IT WORKS                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   User types: http://dryfruto.com                              │
│                     │                                           │
│                     ▼                                           │
│   DNS Lookup: dryfruto.com → YOUR_SERVER_IP                    │
│                     │                                           │
│                     ▼                                           │
│   Server Port 80: Receives HTTP request                        │
│                     │                                           │
│                     ▼                                           │
│   301 Redirect: http → https://dryfruto.com                    │
│                     │                                           │
│                     ▼                                           │
│   Server Port 443: Serves HTTPS with SSL certificate           │
│                     │                                           │
│                     ▼                                           │
│   User sees: Secure website 🔒                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Step 1: Get Your Server IP Address

First, find your server's public IP address:

```bash
# On your server, run:
curl -4 ifconfig.me
```

Note down this IP (e.g., `123.45.67.89`)

---

## Step 2: Configure DNS Records

Go to your domain registrar's DNS management panel (where you bought dryfruto.com).

### Add these DNS Records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| **A** | `@` | `YOUR_SERVER_IP` | 300 |
| **A** | `www` | `YOUR_SERVER_IP` | 300 |

### Example:
If your server IP is `123.45.67.89`:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 123.45.67.89 | 300 |
| A | www | 123.45.67.89 | 300 |

### Where to find DNS settings:

**GoDaddy:**
- My Products → DNS → Manage

**Namecheap:**
- Domain List → Manage → Advanced DNS

**Cloudflare:**
- Select domain → DNS → Records

**Hostinger:**
- Domains → Manage → DNS Zone

---

## Step 3: Wait for DNS Propagation

DNS changes take time to propagate globally (usually 5-30 minutes, max 48 hours).

### Check if DNS is working:

```bash
# Check A record
dig dryfruto.com +short

# Should return your server IP:
# 123.45.67.89

# Check www subdomain
dig www.dryfruto.com +short

# Should also return your server IP:
# 123.45.67.89
```

### Online DNS checker:
- https://dnschecker.org/#A/dryfruto.com

---

## Step 4: Configure Server Firewall

Make sure ports 8081 and 8082 are open on your server:

```bash
# Ubuntu/Debian with UFW
sudo ufw allow 8081/tcp
sudo ufw allow 8082/tcp
sudo ufw status

# CentOS/RHEL with firewalld
sudo firewall-cmd --permanent --add-port=8081/tcp
sudo firewall-cmd --permanent --add-port=8082/tcp
sudo firewall-cmd --reload
```

### Hostinger VPS:
- Go to VPS Dashboard → Firewall
- Add rules for ports 8081 and 8082

---

## Step 5: Deploy the Application

```bash
# 1. SSH into your server
ssh root@YOUR_SERVER_IP

# 2. Navigate to project directory
cd /opt/dryfruto

# 3. Build Docker images
chmod +x build-images.sh
./build-images.sh

# 4. Create environment file
cp .env.production .env

# 5. Edit and set a secure JWT secret
nano .env
# Change: JWT_SECRET=your_super_secure_random_string_here

# 6. Start all containers
docker compose up -d

# 7. Check status
docker compose ps
```

---

## Step 6: Verify SSL Certificate

After starting the containers, SSL certificate will be obtained automatically.

```bash
# Check nginx logs for SSL status
docker compose logs nginx | grep -i ssl
docker compose logs nginx | grep -i certbot

# Test HTTPS
curl -I https://dryfruto.com
```

### Expected response:
```
HTTP/2 200
strict-transport-security: max-age=31536000; includeSubDomains; preload
```

---

## Step 7: Test HTTP to HTTPS Redirect

```bash
# Test redirect (should show 301)
curl -I http://dryfruto.com:8081

# Expected response:
# HTTP/1.1 301 Moved Permanently
# Location: https://dryfruto.com:8082/
```

---

## Step 8: Access Your Website

Open in browser:
- **Website:** https://dryfruto.com:8082
- **Admin Panel:** https://dryfruto.com:8082/admin

### Default Admin Credentials:
- Username: `admin`
- Password: `admin123`

⚠️ **Change the password immediately after first login!**

---

## Troubleshooting

### DNS not resolving

```bash
# Check current DNS
dig dryfruto.com +short

# If empty, DNS hasn't propagated yet. Wait and try again.
# Clear local DNS cache:
# Mac: sudo dscacheutil -flushcache
# Windows: ipconfig /flushdns
# Linux: sudo systemd-resolve --flush-caches
```

### SSL Certificate Failed

```bash
# Check if domain points to server
dig dryfruto.com +short

# Manually obtain certificate
docker compose exec nginx certbot certonly --webroot \
    --webroot-path=/var/www/certbot \
    -d dryfruto.com -d www.dryfruto.com \
    --email admin@dryfruto.com --agree-tos --force-renewal

# Reload nginx
docker compose exec nginx nginx -s reload
```

### Port not accessible

```bash
# Check if ports are listening
netstat -tlnp | grep -E ':(8081|8082)'

# Check firewall
sudo ufw status
# or
sudo iptables -L -n | grep -E '(8081|8082)'
```

### Container not starting

```bash
# Check logs
docker compose logs nginx
docker compose logs backend
docker compose logs frontend

# Restart containers
docker compose restart
```

---

## Quick Reference

| Item | Value |
|------|-------|
| Domain | dryfruto.com |
| Website URL | https://dryfruto.com:8082 |
| Admin URL | https://dryfruto.com:8082/admin |
| HTTP Port | 8081 (redirects to HTTPS) |
| HTTPS Port | 8082 |
| SSL Provider | Let's Encrypt (auto-renewed) |

---

## Summary Checklist

- [ ] Got server IP address
- [ ] Added A record for `@` pointing to server IP
- [ ] Added A record for `www` pointing to server IP
- [ ] Waited for DNS propagation (check with `dig`)
- [ ] Opened firewall ports 80 and 443
- [ ] Deployed application with `docker compose up -d`
- [ ] Verified SSL certificate is working
- [ ] Tested HTTP→HTTPS redirect
- [ ] Changed default admin password
