#!/bin/bash
# Build and tag Docker images for DryFruto

set -e

echo "=========================================="
echo "Building DryFruto Docker Images"
echo "=========================================="

# Set image registry (change for your registry)
REGISTRY="dryfruto"
TAG="latest"

# Build Backend
echo ""
echo "[1/3] Building Backend Image..."
docker build -t $REGISTRY/backend:$TAG ./backend
echo "✓ Backend image built: $REGISTRY/backend:$TAG"

# Build Frontend
echo ""
echo "[2/3] Building Frontend Image..."
docker build -t $REGISTRY/frontend:$TAG ./frontend
echo "✓ Frontend image built: $REGISTRY/frontend:$TAG"

# Build Nginx
echo ""
echo "[3/3] Building Nginx Image..."
docker build -t $REGISTRY/nginx:$TAG ./nginx
echo "✓ Nginx image built: $REGISTRY/nginx:$TAG"

echo ""
echo "=========================================="
echo "All images built successfully!"
echo "=========================================="
echo ""
echo "Images created:"
echo "  - $REGISTRY/backend:$TAG"
echo "  - $REGISTRY/frontend:$TAG"
echo "  - $REGISTRY/nginx:$TAG"
echo ""
echo "To push to registry:"
echo "  docker push $REGISTRY/backend:$TAG"
echo "  docker push $REGISTRY/frontend:$TAG"
echo "  docker push $REGISTRY/nginx:$TAG"
echo ""
echo "To deploy:"
echo "  docker compose up -d"
