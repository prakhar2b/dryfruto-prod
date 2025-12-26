#!/bin/bash

#===========================================
# DryFruto - Docker Installation Script
# For Hostinger VPS (Ubuntu/Debian)
#===========================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  DryFruto - Docker Setup Script${NC}"
echo -e "${GREEN}========================================${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Please run as root (use sudo)${NC}"
  exit 1
fi

# Get configuration from user
read -p "Enter your domain or IP address: " DOMAIN
read -p "Enter your GitHub repository URL: " GITHUB_REPO

# Update system
echo -e "${YELLOW}Updating system packages...${NC}"
apt update && apt upgrade -y

# Install required packages
echo -e "${YELLOW}Installing required packages...${NC}"
apt install -y curl wget git apt-transport-https ca-certificates gnupg lsb-release

# Install Docker
echo -e "${YELLOW}Installing Docker...${NC}"
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh

# Install Docker Compose
echo -e "${YELLOW}Installing Docker Compose...${NC}"
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Start Docker service
systemctl start docker
systemctl enable docker

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

# Create .env file for docker-compose
echo -e "${YELLOW}Creating environment file...${NC}"
cat > .env << EOF
SITE_URL=http://${DOMAIN}
MONGO_URL=mongodb://mongodb:27017
DB_NAME=dryfruto
EOF

# Build frontend first (for production setup)
echo -e "${YELLOW}Building frontend...${NC}"
cd frontend
echo "REACT_APP_BACKEND_URL=http://${DOMAIN}" > .env
npm install --legacy-peer-deps 2>/dev/null || (apt install -y nodejs npm && npm install --legacy-peer-deps)
npm run build
cd ..

# Build and start Docker containers
echo -e "${YELLOW}Building and starting Docker containers...${NC}"
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to start
echo -e "${YELLOW}Waiting for services to start...${NC}"
sleep 10

# Check status
echo -e "${YELLOW}Checking container status...${NC}"
docker-compose -f docker-compose.prod.yml ps

# Configure firewall
echo -e "${YELLOW}Configuring firewall...${NC}"
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow OpenSSH
ufw --force enable

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Docker Installation Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Your DryFruto application is now running at: ${YELLOW}http://${DOMAIN}${NC}"
echo -e "Admin panel: ${YELLOW}http://${DOMAIN}/admin${NC}"
echo ""
echo -e "Useful commands:"
echo -e "  ${YELLOW}docker-compose -f docker-compose.prod.yml ps${NC}      - Check status"
echo -e "  ${YELLOW}docker-compose -f docker-compose.prod.yml logs${NC}    - View logs"
echo -e "  ${YELLOW}docker-compose -f docker-compose.prod.yml restart${NC} - Restart all"
echo -e "  ${YELLOW}docker-compose -f docker-compose.prod.yml down${NC}    - Stop all"
echo ""
echo -e "To update your site, run: ${YELLOW}cd /var/www/dryfruto && sudo ./deploy/docker-update.sh${NC}"
