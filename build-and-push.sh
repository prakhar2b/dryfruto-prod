#!/bin/bash
# Build and Push DryFruto Images to Docker Hub
# Username: prakhar2b

set -e

REGISTRY="prakhar2b"
TAG="latest"

echo "==========================================="
echo "Building & Pushing DryFruto Docker Images"
echo "Registry: $REGISTRY"
echo "==========================================="

# Check if logged in
echo ""
echo "Checking Docker Hub login..."
docker info | grep -q "Username" || {
    echo "Not logged in to Docker Hub. Please run: docker login"
    exit 1
}

# Build and Push Backend
echo ""
echo "[1/3] Building Backend..."
docker build -t $REGISTRY/dryfruto-backend:$TAG ./backend
echo "Pushing Backend..."
docker push $REGISTRY/dryfruto-backend:$TAG
echo "✓ Backend pushed: $REGISTRY/dryfruto-backend:$TAG"

# Build and Push Frontend
echo ""
echo "[2/3] Building Frontend..."
docker build -t $REGISTRY/dryfruto-frontend:$TAG ./frontend
echo "Pushing Frontend..."
docker push $REGISTRY/dryfruto-frontend:$TAG
echo "✓ Frontend pushed: $REGISTRY/dryfruto-frontend:$TAG"

# Build and Push Nginx
echo ""
echo "[3/3] Building Nginx..."
docker build -t $REGISTRY/dryfruto-nginx:$TAG ./nginx
echo "Pushing Nginx..."
docker push $REGISTRY/dryfruto-nginx:$TAG
echo "✓ Nginx pushed: $REGISTRY/dryfruto-nginx:$TAG"

echo ""
echo "==========================================="
echo "All images pushed successfully!"
echo "==========================================="
echo ""
echo "Images on Docker Hub:"
echo "  - $REGISTRY/dryfruto-backend:$TAG"
echo "  - $REGISTRY/dryfruto-frontend:$TAG"
echo "  - $REGISTRY/dryfruto-nginx:$TAG"
echo ""
echo "To deploy, run:"
echo "  docker compose -f docker-compose.prod.yml up -d"
echo ""
