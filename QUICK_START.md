# Quick Start Commands

## Development
```bash
# Install all dependencies
npm run install:all

# Start development servers (both client and server)
npm run dev

# Start individual services
npm run dev:client
npm run dev:server

# Seed the database
npm run seed
```

## Production Deployment

### Docker (Recommended)
```bash
# Build and start all services
npm run docker:build
npm run docker:up

# Stop services
npm run docker:down
```

### Cloud Platforms
```bash
# Vercel (Frontend + Serverless API)
npm run deploy:vercel

# Railway (Full Stack)
npm run deploy:railway

# Manual build for other platforms
npm run build
```

## Environment Setup
1. Copy `server/.env.example` to `server/.env`
2. Set `MONGO_URI`, `JWT_SECRET` and `GROQ_API_KEY`
3. Set `ALLOWED_ORIGINS` to your frontend origin for production

## Monorepo Commands
- `npm run build` - Build all apps
- `npm run test` - Run tests in all apps
- `npm run lint` - Lint all apps
- `npm run clean` - Clean all node_modules