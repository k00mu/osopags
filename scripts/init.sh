#!/bin/bash

cd ~/osopags

# Get public IP
PUBLIC_IP=$(curl -s -4 icanhazip.com)

# Create .env file
cat > .env << EOL
OSOPAGS_BASE_URL=http://${PUBLIC_IP}

# Ports
ENGINE_PORT=3000
WEB_PORT=5000
POSTGRES_PORT=5432
REDIS_PORT=6379

# PostgreSQL
POSTGRES_USER=osopags_user
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=osopags
POSTGRES_HOST=db

# Redis
REDIS_HOST=redis

# JWT
JWT_SECRET=your_secure_jwt_secret

# Node
NODE_ENV=production
EOL

# Rebuild and restart containers
docker compose down
docker compose up -d --build

# Clean up
docker system prune -f