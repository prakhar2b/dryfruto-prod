# Nginx Reverse Proxy with SSL (HTTPS Only)
FROM nginx:alpine

# Install certbot and dependencies
RUN apk add --no-cache certbot certbot-nginx openssl bash curl

# Remove default config
RUN rm -f /etc/nginx/conf.d/default.conf

# Create directories
RUN mkdir -p /var/www/certbot /etc/letsencrypt /var/log/letsencrypt

# Create SSL generation script
RUN cat > /generate-ssl.sh << 'SCRIPT'
#!/bin/bash
DOMAIN="${DOMAIN:-localhost}"
EMAIL="${SSL_EMAIL:-admin@example.com}"

SSL_DIR="/etc/letsencrypt/live/$DOMAIN"
SSL_CERT="$SSL_DIR/fullchain.pem"
SSL_KEY="$SSL_DIR/privkey.pem"

# Check if certificates already exist
if [ -f "$SSL_CERT" ] && [ -f "$SSL_KEY" ]; then
    echo "SSL certificates already exist, skipping generation"
    exit 0
fi

mkdir -p "$SSL_DIR"

# If GENERATE_SSL is not set or is false, use self-signed certificates
if [ "$GENERATE_SSL" != "true" ]; then
    echo "Creating self-signed certificate for $DOMAIN..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout "$SSL_KEY" \
        -out "$SSL_CERT" \
        -subj "/CN=$DOMAIN"
    echo "Self-signed certificate created"
    exit 0
fi

# Try to get Let's Encrypt certificate
echo "Attempting Let's Encrypt certificate for $DOMAIN..."
certbot certonly --standalone \
    --non-interactive \
    --agree-tos \
    --email "$EMAIL" \
    --domains "$DOMAIN" \
    || {
        echo "Let's Encrypt failed, creating self-signed certificate..."
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout "$SSL_KEY" \
            -out "$SSL_CERT" \
            -subj "/CN=$DOMAIN"
        echo "Self-signed certificate created"
    }
SCRIPT
RUN chmod +x /generate-ssl.sh

# Create nginx configuration template
RUN cat > /etc/nginx/nginx.conf.template << 'EOF'
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    client_max_body_size 50M;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;

    # Internal Docker network upstreams
    upstream frontend_upstream {
        server frontend:80;
    }

    upstream backend_upstream {
        server backend:8001;
    }

    # HTTP Server - Redirect ALL traffic to HTTPS
    server {
        listen 80;
        listen [::]:80;
        server_name ${DOMAIN} www.${DOMAIN} localhost _;

        # ACME challenge for Let's Encrypt (must stay on HTTP)
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        # Redirect all other HTTP traffic to HTTPS
        location / {
            return 301 https://$host$request_uri;
        }
    }

    # HTTPS Server - Main Application
    server {
        listen 443 ssl http2;
        listen [::]:443 ssl http2;
        server_name ${DOMAIN} www.${DOMAIN} localhost;

        # SSL Certificates
        ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;

        # SSL Settings
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_prefer_server_ciphers off;
        ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
        ssl_session_timeout 1d;
        ssl_session_cache shared:SSL:50m;

        # Security Headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # API Routes - Proxy to Backend
        location /api/ {
            proxy_pass http://backend_upstream/api/;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_read_timeout 300s;
            proxy_connect_timeout 75s;
        }

        # Uploads - Proxy to Backend
        location /uploads/ {
            proxy_pass http://backend_upstream/uploads/;
            expires 30d;
            add_header Cache-Control "public";
        }

        # Frontend - All routes (including /admin)
        location / {
            proxy_pass http://frontend_upstream;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
EOF

# Create entrypoint script
RUN cat > /docker-entrypoint.sh << 'ENTRY'
#!/bin/bash
set -e

# Set default domain if not provided
export DOMAIN="${DOMAIN:-localhost}"

echo "=========================================="
echo "DryFruto Nginx Proxy Starting..."
echo "Domain: $DOMAIN"
echo "HTTPS Only Mode: Enabled"
echo "Admin Panel: Protected by Application Auth"
echo "=========================================="

# Generate SSL certificates
/generate-ssl.sh

# Generate nginx config from template with environment variables
envsubst '${DOMAIN}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Test nginx configuration
nginx -t

echo "=========================================="
echo "Server ready!"
echo "HTTP  -> Redirects to HTTPS"
echo "HTTPS -> Serves application"
echo "Admin -> /admin/login (application login)"
echo "=========================================="

# Start nginx
exec nginx -g 'daemon off;'
ENTRY
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80 443

ENTRYPOINT ["/docker-entrypoint.sh"]
