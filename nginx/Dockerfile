# Nginx Dockerfile with embedded config
FROM nginx:alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Create nginx configuration
RUN cat > /etc/nginx/nginx.conf << 'EOF'
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

    upstream frontend {
        server frontend:80;
    }

    upstream backend {
        server backend:8001;
    }

    # HTTP Server
    server {
        listen 80;
        listen [::]:80;
        server_name statellmarketing.com www.statellmarketing.com localhost;

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        location /api/ {
            proxy_pass http://backend/api/;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_read_timeout 300s;
        }

        location /uploads/ {
            proxy_pass http://backend/uploads/;
            expires 30d;
            add_header Cache-Control "public";
        }
    }

    # HTTPS Server (uncomment after SSL setup)
    # server {
    #     listen 443 ssl http2;
    #     listen [::]:443 ssl http2;
    #     server_name statellmarketing.com www.statellmarketing.com;
    #
    #     ssl_certificate /etc/letsencrypt/live/statellmarketing.com/fullchain.pem;
    #     ssl_certificate_key /etc/letsencrypt/live/statellmarketing.com/privkey.pem;
    #     ssl_protocols TLSv1.2 TLSv1.3;
    #
    #     location / {
    #         proxy_pass http://frontend;
    #         proxy_http_version 1.1;
    #         proxy_set_header Host $host;
    #         proxy_set_header X-Real-IP $remote_addr;
    #         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    #         proxy_set_header X-Forwarded-Proto $scheme;
    #     }
    #
    #     location /api/ {
    #         proxy_pass http://backend/api/;
    #         proxy_set_header Host $host;
    #         proxy_set_header X-Real-IP $remote_addr;
    #     }
    #
    #     location /uploads/ {
    #         proxy_pass http://backend/uploads/;
    #     }
    # }
}
EOF

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
