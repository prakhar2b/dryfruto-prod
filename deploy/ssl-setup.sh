#!/bin/bash

#===========================================
# DryFruto - SSL Certificate Setup
# Using Let's Encrypt (Certbot)
#===========================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  DryFruto - SSL Setup Script${NC}"
echo -e "${GREEN}========================================${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Please run as root (use sudo)${NC}"
  exit 1
fi

# Get domain from user
read -p "Enter your domain name (e.g., example.com): " DOMAIN
read -p "Enter your email for SSL notifications: " EMAIL

# Install Certbot
echo -e "${YELLOW}Installing Certbot...${NC}"
apt update
apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
echo -e "${YELLOW}Obtaining SSL certificate...${NC}"
certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m $EMAIL

# Setup auto-renewal
echo -e "${YELLOW}Setting up auto-renewal...${NC}"
systemctl enable certbot.timer
systemctl start certbot.timer

# Update frontend .env with HTTPS
echo -e "${YELLOW}Updating frontend configuration...${NC}"
cd /var/www/dryfruto/frontend
cat > .env << EOF
REACT_APP_BACKEND_URL=https://${DOMAIN}
EOF

# Rebuild frontend
npm run build

# Restart services
systemctl restart nginx
pm2 restart dryfruto-api

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  SSL Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Your site is now secured with HTTPS: ${YELLOW}https://${DOMAIN}${NC}"
echo -e "SSL certificate will auto-renew before expiration."
