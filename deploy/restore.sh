#!/bin/bash

#===========================================
# DryFruto - Restore Script
# Restores database from backup
#===========================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BACKUP_DIR="/var/backups/dryfruto"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  DryFruto - Restore Script${NC}"
echo -e "${GREEN}========================================${NC}"

# List available backups
echo -e "${YELLOW}Available MongoDB backups:${NC}"
ls -1 $BACKUP_DIR/mongodb_*.tar.gz 2>/dev/null || echo "No backups found"
echo ""

# Get backup file from user
read -p "Enter the backup filename to restore (e.g., mongodb_20240101_120000.tar.gz): " BACKUP_FILE

if [ ! -f "$BACKUP_DIR/$BACKUP_FILE" ]; then
  echo -e "${RED}Backup file not found!${NC}"
  exit 1
fi

# Confirm restore
read -p "This will replace the current database. Are you sure? (y/n): " CONFIRM
if [ "$CONFIRM" != "y" ]; then
  echo "Restore cancelled."
  exit 0
fi

# Extract backup
echo -e "${YELLOW}Extracting backup...${NC}"
TEMP_DIR=$(mktemp -d)
tar -xzf $BACKUP_DIR/$BACKUP_FILE -C $TEMP_DIR

# Restore MongoDB
echo -e "${YELLOW}Restoring MongoDB...${NC}"
mongorestore --db dryfruto --drop $TEMP_DIR/mongodb_*/dryfruto

# Cleanup
rm -rf $TEMP_DIR

# Restart application
pm2 restart dryfruto-api

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Restore Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
