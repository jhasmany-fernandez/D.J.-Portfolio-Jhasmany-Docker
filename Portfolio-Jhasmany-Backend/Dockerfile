# Multi-stage build for NestJS
FROM node:20-alpine AS base

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app directory
RUN mkdir -p /home/node/app && chown node:node /home/node/app
WORKDIR /home/node/app

# Switch to node user
USER node

# Builder stage
FROM base AS builder

# Copy package files
COPY --chown=node:node package*.json ./
COPY --chown=node:node tsconfig*.json ./
COPY --chown=node:node nest-cli.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy source code
COPY --chown=node:node src/ ./src/

# Build the application
RUN npm run build && npm prune --omit=dev

# Production stage
FROM base AS production

# Install curl for healthcheck
USER root
RUN apk add --no-cache curl
USER node

# Copy package files
COPY --chown=node:node package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy built application and production node_modules from builder stage
COPY --from=builder --chown=node:node /home/node/app/dist ./dist
COPY --from=builder --chown=node:node /home/node/app/node_modules ./node_modules

# Expose port
EXPOSE 3001

# Health check with better error handling
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/main"]