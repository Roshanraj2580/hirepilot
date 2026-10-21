# ==========================================
# Production Dockerfile for Express.js API
# ==========================================
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies (only production if needed, or build deps)
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Ensure upload directory exists and has appropriate permissions
RUN mkdir -p public && chown -R node:node /usr/src/app

# Run container as non-root user for security compliance
USER node

# Expose backend port
EXPOSE 8000

ENV NODE_ENV=production
ENV PORT=8000

# Start production server
CMD ["node", "index.js"]
