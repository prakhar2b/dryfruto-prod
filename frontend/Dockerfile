FROM node:18-alpine AS builder

WORKDIR /app

# Set environment variable for build
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

# Copy package.json
COPY package.json ./

# Install dependencies
RUN npm install --legacy-peer-deps --loglevel verbose

# Copy all source files
COPY public ./public
COPY src ./src
COPY tailwind.config.js ./
COPY craco.config.js ./

# Build
RUN npm run build

# Production image
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]