# ============================
# 1. Builder Stage
# ============================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json* ./

# Copy workspace package files
COPY server/package.json ./server/
COPY server/package-lock.json* ./server/
COPY apps/client/frontend/package.json ./apps/client/frontend/
COPY apps/client/frontend/package-lock.json* ./apps/client/frontend/

# Install root deps (for workspace scripts)
RUN npm install

# Copy entire monorepo
COPY . .

# Build client
RUN npm run build --workspace=apps/client/frontend

# ============================
# 2. Production Stage
# ============================
FROM node:20-alpine

# Runtime directory is server (important for Railway env vars)
WORKDIR /app/server

# Copy server package files
COPY server/package.json server/package-lock.json* ./

# Install server dependencies using npm install
RUN npm install --omit=dev

# Copy server source code
COPY --from=builder /app/server/src ./src

# Copy built client (dist) into server if server needs to serve it
COPY --from=builder /app/apps/client/frontend/dist ../apps/client/frontend/dist

# Ensure uploads folder exists
RUN mkdir -p uploads

# Expose API port
EXPOSE 5000

# Environment
ENV NODE_ENV=production

# Start server
CMD ["npm", "start"]