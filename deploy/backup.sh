#!/bin/bash

#===========================================
# DryFruto - Backup Script
# Backs up database and uploaded files
#===========================================

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BACKUP_DIR="/var/backups/dryfruto"
DATE=$(date +%Y%m%d_%H%M%S)

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  DryFruto - Backup Script${NC}"
echo -e "${GREEN}========================================${NC}"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup MongoDB
echo -e "${YELLOW}Backing up MongoDB...${NC}"
mongodump --db dryfruto --out $BACKUP_DIR/mongodb_$DATE

# Compress MongoDB backup
tar -czf $BACKUP_DIR/mongodb_$DATE.tar.gz -C $BACKUP_DIR mongodb_$DATE
rm -rf $BACKUP_DIR/mongodb_$DATE

# Backup uploaded files
echo -e "${YELLOW}Backing up uploaded files...${NC}"
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz -C /var/www/dryfruto uploads

# Remove backups older than 7 days
echo -e "${YELLOW}Cleaning old backups...${NC}"
find $BACKUP_DIR -type f -mtime +7 -delete

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Backup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Backups saved to: ${YELLOW}$BACKUP_DIR${NC}"
ls -lh $BACKUP_DIR
