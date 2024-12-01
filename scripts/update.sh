#!/bin/bash
cd ~/osopags

# Pull latest changes
git pull

# Rebuild and restart containers
docker compose down
docker compose up -d --build

# Clean up
docker system prune -f