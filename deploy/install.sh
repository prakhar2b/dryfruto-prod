#!/bin/bash

#===========================================
# DryFruto - Initial Server Setup Script
# For Hostinger VPS (Ubuntu/Debian)
#===========================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  DryFruto - Server Setup Script${NC}"
echo -e "${GREEN}========================================${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Please run as root (use sudo)${NC}"
  exit 1
fi

# Get domain/IP from user
read -p "Enter your domain or IP address: " DOMAIN
read -p "Enter your GitHub repository URL: " GITHUB_REPO

# Update system
echo -e "${YELLOW}Updating system packages...${NC}"
apt update && apt upgrade -y

# Install required packages
echo -e "${YELLOW}Installing required packages...${NC}"
apt install -y python3 python3-pip python3-venv nodejs npm git nginx curl wget gnupg

# Install MongoDB
echo -e "${YELLOW}Installing MongoDB...${NC}"
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt update
apt install -y mongodb-org
systemctl start mongod
systemctl enable mongod

# Install PM2
echo -e "${YELLOW}Installing PM2...${NC}"
npm install -g pm2

# Create application directory
echo -e "${YELLOW}Setting up application directory...${NC}"
mkdir -p /var/www
cd /var/www

# Clone repository
echo -e "${YELLOW}Cloning repository from GitHub...${NC}"
git clone $GITHUB_REPO dryfruto
cd dryfruto

# Create uploads directory
mkdir -p uploads
chmod 755 uploads

# Setup Backend
echo -e "${YELLOW}Setting up backend...${NC}"
cd /var/www/dryfruto/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
MONGO_URL=mongodb://localhost:27017
DB_NAME=dryfruto
EOF

deactivate

# Setup Frontend
echo -e "${YELLOW}Setting up frontend...${NC}"
cd /var/www/dryfruto/frontend

# Create frontend .env
cat > .env << EOF
REACT_APP_BACKEND_URL=http://${DOMAIN}
EOF

# Install npm dependencies and build
npm install
npm run build

# Configure Nginx
echo -e "${YELLOW}Configuring Nginx...${NC}"
cat > /etc/nginx/sites-available/dryfruto << EOF
server {
    listen 80;
    server_name ${DOMAIN};

    # Frontend - serve React build
    location / {
        root /var/www/dryfruto/frontend/build;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Serve uploaded files
    location /uploads/ {
        alias /var/www/dryfruto/uploads/;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/dryfruto /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
nginx -t
systemctl restart nginx

# Setup PM2 for backend
echo -e "${YELLOW}Starting backend with PM2...${NC}"
cd /var/www/dryfruto/backend

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'dryfruto-api',
    script: 'venv/bin/uvicorn',
    args: 'server:app --host 0.0.0.0 --port 8001',
    cwd: '/var/www/dryfruto/backend',
    env: {
      MONGO_URL: 'mongodb://localhost:27017',
      DB_NAME: 'dryfruto'
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
EOF

# Start PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Set proper ownership
chown -R www-data:www-data /var/www/dryfruto

# Configure firewall
echo -e "${YELLOW}Configuring firewall...${NC}"
ufw allow 'Nginx Full'
ufw allow OpenSSH
ufw --force enable

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Installation Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Your DryFruto application is now running at: ${YELLOW}http://${DOMAIN}${NC}"
echo -e "Admin panel: ${YELLOW}http://${DOMAIN}/admin${NC}"
echo ""
echo -e "Useful commands:"
echo -e "  ${YELLOW}pm2 status${NC}        - Check application status"
echo -e "  ${YELLOW}pm2 logs${NC}          - View application logs"
echo -e "  ${YELLOW}pm2 restart all${NC}   - Restart application"
echo ""
echo -e "To update your site, run: ${YELLOW}cd /var/www/dryfruto && sudo ./deploy/update.sh${NC}"
