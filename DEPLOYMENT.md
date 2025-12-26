# DryFruto - Deployment Guide

This guide explains how to deploy the DryFruto application on a Hostinger VPS using GitHub.

## Prerequisites

- Hostinger VPS with Ubuntu 20.04 or later
- SSH access to your VPS
- GitHub repository with your DryFruto code
- Domain name (optional, can use IP address)

## Quick Start

### 1. Push Your Code to GitHub

In Emergent:
1. Click your profile icon → "Connect GitHub"
2. Authorize Emergent on GitHub
3. Click "Save to GitHub" button
4. Select repository and push

### 2. Initial Server Setup

SSH into your VPS and run:

```bash
# Download and run the install script
wget https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/deploy/install.sh
chmod +x install.sh
sudo ./install.sh
```

The script will:
- Install all dependencies (Python, Node.js, MongoDB, Nginx)
- Clone your repository
- Build the frontend
- Configure Nginx
- Start the backend with PM2

### 3. Setup SSL (Recommended)

```bash
cd /var/www/dryfruto
sudo ./deploy/ssl-setup.sh
```

## Deployment Scripts

| Script | Description |
|--------|-------------|
| `deploy/install.sh` | Initial server setup |
| `deploy/update.sh` | Pull latest changes from GitHub |
| `deploy/ssl-setup.sh` | Setup Let's Encrypt SSL certificate |
| `deploy/backup.sh` | Backup database and uploads |
| `deploy/restore.sh` | Restore from backup |

## Updating Your Site

After making changes in Emergent:

1. Click "Save to GitHub" to push changes
2. SSH into your VPS
3. Run the update script:

```bash
cd /var/www/dryfruto
sudo ./deploy/update.sh
```

## Manual Commands

### Check Application Status
```bash
pm2 status
```

### View Logs
```bash
pm2 logs dryfruto-api
```

### Restart Application
```bash
pm2 restart dryfruto-api
```

### Restart Nginx
```bash
sudo systemctl restart nginx
```

### Check MongoDB Status
```bash
sudo systemctl status mongod
```

## Directory Structure on VPS

```
/var/www/dryfruto/
├── backend/           # FastAPI application
│   ├── server.py
│   ├── requirements.txt
│   ├── venv/          # Python virtual environment
│   └── .env           # Environment variables
├── frontend/          # React application
│   ├── build/         # Production build
│   ├── src/
│   └── .env
├── uploads/           # User uploaded files
└── deploy/            # Deployment scripts
```

## Environment Variables

### Backend (.env)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=dryfruto
```

### Frontend (.env)
```
REACT_APP_BACKEND_URL=https://your-domain.com
```

## Backups

### Create Backup
```bash
sudo ./deploy/backup.sh
```

Backups are saved to `/var/backups/dryfruto/`

### Setup Automatic Backups

Add to crontab (`sudo crontab -e`):
```
# Daily backup at 2 AM
0 2 * * * /var/www/dryfruto/deploy/backup.sh
```

### Restore from Backup
```bash
sudo ./deploy/restore.sh
```

## Troubleshooting

### Site not loading
1. Check Nginx status: `sudo systemctl status nginx`
2. Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
3. Check if PM2 is running: `pm2 status`

### API errors
1. Check backend logs: `pm2 logs dryfruto-api`
2. Check MongoDB: `sudo systemctl status mongod`

### Permission issues
```bash
sudo chown -R www-data:www-data /var/www/dryfruto
```

### Rebuild frontend after changes
```bash
cd /var/www/dryfruto/frontend
npm run build
```

## Support

For issues or questions, please create an issue in the GitHub repository.
