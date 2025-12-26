#!/bin/bash

#===========================================
# DryFruto - Update Script
# Pull latest changes from GitHub
#===========================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

APP_DIR="/var/www/dryfruto"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  DryFruto - Update Script${NC}"
echo -e "${GREEN}========================================${NC}"

# Navigate to app directory
cd $APP_DIR

# Pull latest changes
echo -e "${YELLOW}Pulling latest changes from GitHub...${NC}"
git pull origin main

# Check if backend requirements changed
if git diff HEAD~1 --name-only | grep -q "backend/requirements.txt"; then
  echo -e "${YELLOW}Backend dependencies changed. Updating...${NC}"
  cd $APP_DIR/backend
  source venv/bin/activate
  pip install -r requirements.txt
  deactivate
fi

# Check if frontend changed
if git diff HEAD~1 --name-only | grep -q "frontend/"; then
  echo -e "${YELLOW}Frontend changed. Rebuilding...${NC}"
  cd $APP_DIR/frontend
  npm install
  npm run build
fi

# Restart backend
echo -e "${YELLOW}Restarting backend...${NC}"
pm2 restart dryfruto-api

# Set proper ownership
chown -R www-data:www-data $APP_DIR

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Update Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
pm2 status
