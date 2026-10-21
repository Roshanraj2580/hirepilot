# ==========================================
# Stage 1: Build React 19 Frontend with Vite
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./
RUN npm ci

# Copy application source code
COPY . .

# Accept build arguments for environment variables
ARG VITE_SERVER_URL
ARG VITE_FIREBASE_APIKEY
ARG VITE_RAZORPAY_KEY_ID

ENV VITE_SERVER_URL=$VITE_SERVER_URL
ENV VITE_FIREBASE_APIKEY=$VITE_FIREBASE_APIKEY
ENV VITE_RAZORPAY_KEY_ID=$VITE_RAZORPAY_KEY_ID

# Build static bundle for production
RUN npm run build

# ==========================================
# Stage 2: Serve Production Assets with NGINX
# ==========================================
FROM nginx:alpine

# Copy built static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration for React Router SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
