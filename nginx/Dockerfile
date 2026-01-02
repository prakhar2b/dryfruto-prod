# Nginx Reverse Proxy with Built-in SSL for dryfruto.com
FROM nginx:alpine

# Install certbot and dependencies
RUN apk add --no-cache certbot certbot-nginx openssl bash curl gettext

# Remove default config
RUN rm -f /etc/nginx/conf.d/default.conf

# Create directories
RUN mkdir -p /var/www/certbot /etc/letsencrypt /var/log/letsencrypt

# Create SSL generation script
RUN cat > /generate-ssl.sh << 'SCRIPT'
#!/bin/bash
set -e

DOMAIN="${DOMAIN:-dryfruto.com}"
EMAIL="${SSL_EMAIL:-admin@dryfruto.com}"

SSL_DIR="/etc/letsencrypt/live/$DOMAIN"
SSL_CERT="$SSL_DIR/fullchain.pem"
SSL_KEY="$SSL_DIR/privkey.pem"

echo "============================================"
echo "SSL Certificate Setup for $DOMAIN"
echo "============================================"

# Check if valid certificates already exist
if [ -f "$SSL_CERT" ] && [ -f "$SSL_KEY" ]; then
    # Check if certificate is still valid (not expiring in next 30 days)
    if openssl x509 -checkend 2592000 -noout -in "$SSL_CERT" 2>/dev/null; then
        echo "Valid SSL certificates exist, skipping generation"
        exit 0
    fi
    echo "Certificates expiring soon, will renew..."
fi

mkdir -p "$SSL_DIR"

# First, create self-signed cert so nginx can start
echo "Creating temporary self-signed certificate..."
openssl req -x509 -nodes -days 1 -newkey rsa:2048 \
    -keyout "$SSL_KEY" \
    -out "$SSL_CERT" \
    -subj "/CN=$DOMAIN"

echo "Temporary certificate created"
echo "Let's Encrypt certificate will be obtained after nginx starts"
SCRIPT
RUN chmod +x /generate-ssl.sh

# Create Let's Encrypt renewal script
RUN cat > /obtain-ssl.sh << 'SCRIPT'
#!/bin/bash
set -e

DOMAIN="${DOMAIN:-dryfruto.com}"
EMAIL="${SSL_EMAIL:-admin@dryfruto.com}"

SSL_DIR="/etc/letsencrypt/live/$DOMAIN"
SSL_CERT="$SSL_DIR/fullchain.pem"
SSL_KEY="$SSL_DIR/privkey.pem"

echo "Attempting to obtain Let's Encrypt certificate for $DOMAIN..."

# Wait for nginx to be ready
sleep 5

# Try to get Let's Encrypt certificate using webroot
certbot certonly --webroot \
    --webroot-path=/var/www/certbot \
    --non-interactive \
    --agree-tos \
    --email "$EMAIL" \
    --domains "$DOMAIN" \
    --domains "www.$DOMAIN" \
    --force-renewal \
    && {
        echo "Let's Encrypt certificate obtained successfully!"
        # Reload nginx to use new certificate
        nginx -s reload
    } || {
        echo "Let's Encrypt failed. Using self-signed certificate."
        echo "Make sure:"
        echo "  1. Domain $DOMAIN points to this server"
        echo "  2. Ports 80 and 443 are open"
        echo "  3. No firewall blocking HTTP validation"
    }
SCRIPT
RUN chmod +x /obtain-ssl.sh

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

    # ==============================================
    # HTTP Server (Port 80) - REDIRECT ONLY
    # All traffic is permanently redirected to HTTPS
    # ==============================================
    server {
        listen 80 default_server;
        listen [::]:80 default_server;
        server_name _;

        # ACME challenge for Let's Encrypt certificate validation
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
            allow all;
        }

        # 301 Permanent Redirect ALL other traffic to HTTPS
        location / {
            return 301 https://$host$request_uri;
        }
    }

    # ==============================================
    # HTTPS Server (Port 443) - Main Application
    # ==============================================
    server {
        listen 443 ssl http2;
        listen [::]:443 ssl http2;
        server_name DOMAIN_PLACEHOLDER www.DOMAIN_PLACEHOLDER;

        # SSL Certificates
        ssl_certificate /etc/letsencrypt/live/DOMAIN_PLACEHOLDER/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/DOMAIN_PLACEHOLDER/privkey.pem;

        # Modern SSL Configuration
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_prefer_server_ciphers off;
        ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
        ssl_session_timeout 1d;
        ssl_session_cache shared:SSL:50m;
        ssl_stapling on;
        ssl_stapling_verify on;

        # Security Headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;

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

        # Frontend - All routes
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

# Set domain from environment or default
export DOMAIN="${DOMAIN:-dryfruto.com}"

echo "=========================================="
echo "DryFruto Production Server"
echo "=========================================="
echo "Domain: $DOMAIN"
echo "SSL Email: ${SSL_EMAIL:-admin@dryfruto.com}"
echo "=========================================="

# Generate initial SSL certificate (self-signed)
/generate-ssl.sh

# Generate nginx config with domain substitution
sed "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Test nginx configuration
nginx -t

echo "=========================================="
echo "Starting Nginx..."
echo "HTTP  (80)  -> Redirects to HTTPS"
echo "HTTPS (443) -> Serves application"
echo "=========================================="

# Start nginx in background
nginx

# Wait a moment then try to obtain real SSL certificate
echo "Attempting to obtain Let's Encrypt certificate in background..."
(/obtain-ssl.sh &)

# Keep nginx running in foreground
wait

# If nginx exits, restart it
exec nginx -g 'daemon off;'
ENTRY
RUN chmod +x /docker-entrypoint.sh

# Create certificate renewal cron job
RUN cat > /etc/periodic/daily/certbot-renew << 'CRON'
#!/bin/sh
certbot renew --quiet --webroot --webroot-path=/var/www/certbot && nginx -s reload
CRON
RUN chmod +x /etc/periodic/daily/certbot-renew

EXPOSE 80 443

ENTRYPOINT ["/docker-entrypoint.sh"]
