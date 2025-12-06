# Multi-stage build for backend server deployment
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy backend package files
COPY server/package.json server/package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy backend source code
COPY server/src ./src

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files from builder
COPY server/package.json server/package-lock.json* ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy source code from builder
COPY --from=builder /app/src ./src

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 5000

# Set environment
ENV NODE_ENV=production

# Start server
CMD ["npm", "start"]
