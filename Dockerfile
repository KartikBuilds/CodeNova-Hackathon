# Multi-stage build for monorepo deployment
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy root package files and lock files
COPY package*.json ./

# Copy workspace packages
COPY server/package.json ./server/
COPY server/package-lock.json* ./server/
COPY apps/client/frontend/package.json ./apps/client/frontend/
COPY apps/client/frontend/package-lock.json* ./apps/client/frontend/

# Install dependencies for monorepo
RUN npm ci

# Copy all source code
COPY . .

# Build all workspaces
RUN npm run build --workspaces --if-present

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy root package files and lock files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/package-lock.json* ./

# Copy workspace packages from builder
COPY --from=builder /app/server/package.json ./server/
COPY --from=builder /app/server/package-lock.json* ./server/
COPY --from=builder /app/apps/client/frontend/package.json ./apps/client/frontend/
COPY --from=builder /app/apps/client/frontend/package-lock.json* ./apps/client/frontend/

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built applications from builder
COPY --from=builder /app/server/src ./server/src
COPY --from=builder /app/apps/client/frontend/dist ./apps/client/frontend/dist

# Create uploads directory for server
RUN mkdir -p server/uploads

# Expose port
EXPOSE 5000

# Set environment
ENV NODE_ENV=production

# Start server
CMD ["npm", "run", "start", "--workspace=server"]
