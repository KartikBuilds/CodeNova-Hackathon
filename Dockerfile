# ============================
# 1. Builder Stage
# ============================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files (monorepo)
COPY package.json package-lock.json* ./

# Copy workspace package files
COPY server/package.json ./server/
COPY server/package-lock.json* ./server/
COPY apps/client/frontend/package.json ./apps/client/frontend/
COPY apps/client/frontend/package-lock.json* ./apps/client/frontend/

# Install deps for monorepo
RUN npm install

# Copy all source code
COPY . .

# Build client
RUN npm run build --workspace=apps/client/frontend


# ============================
# 2. Production Runtime Stage
# ============================
FROM node:20-alpine

# Keep monorepo structure intact
WORKDIR /app

# Copy root package files for monorepo structure
COPY package.json package-lock.json* ./

# Copy server package files
COPY server/package.json ./server/
COPY server/package-lock.json* ./server/

# Install only server production dependencies (monorepo-aware)
RUN npm install --omit=dev --workspace=server

# Copy server source code
COPY --from=builder /app/server/src ./server/src

# Copy built client (if server serves it)
COPY --from=builder /app/apps/client/frontend/dist ./apps/client/frontend/dist

# Ensure uploads folder exists
RUN mkdir -p /app/server/uploads

# Expose API port
EXPOSE 5000

# Production env
ENV NODE_ENV=production

# Set working directory to server for execution
WORKDIR /app/server

# Start the backend directly (or use workspace command)
CMD ["node", "src/server.js"]