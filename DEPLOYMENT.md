# Monorepo Deployment Guide

## Overview
This AI-based Personalized Learning Assistant is structured as a monorepo with the following architecture:

```
ai-learning-assistant-monorepo/
├── apps/
│   ├── client/          # React frontend (Vite + Tailwind)
│   └── server/          # Node.js backend (Express + MongoDB)
├── ai/                  # AI prompts and examples
├── docs/                # Documentation
├── docker-compose.yml   # Docker orchestration
└── package.json         # Monorepo configuration
```

## Development Setup

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB (local or cloud)
- Docker (optional)

### Local Development

1. **Clone and Install**
   ```bash
   git clone <your-repo-url>
   cd ai-learning-assistant-monorepo
   npm run install:all
   ```

2. **Environment Setup**
   ```bash
   # In apps/server/
   cp .env.example .env
   # Configure MongoDB URI, JWT_SECRET, etc.
   ```

3. **Start Development Servers**
   ```bash
   npm run dev
   # This starts both client (port 3000) and server (port 5000)
   ```

4. **Individual Service Commands**
   ```bash
   npm run dev:client    # Client only
   npm run dev:server    # Server only
   npm run seed          # Seed database
   ```

## Deployment Options

### 1. Docker Deployment (Recommended)

**Complete Stack with Docker Compose:**
```bash
# Build and start all services
npm run docker:build
npm run docker:up

# Stop services
npm run docker:down
```

**Individual Container Builds:**
```bash
# Client container
cd apps/client && docker build -t learning-assistant-client .

# Server container
cd apps/server && docker build -t learning-assistant-server .
```

### 2. Vercel Deployment (Frontend + Serverless)

**Setup:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
npm run deploy:vercel
```

**vercel.json Configuration:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "apps/client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "apps/server/src/app.js"
    },
    {
      "src": "/(.*)",
      "dest": "apps/client/dist/$1"
    }
  ]
}
```

### 3. Railway Deployment (Full Stack)

**Setup:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
npm run deploy:railway
```

**railway.json:**
```json
{
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "on_failure"
  }
}
```

### 4. Render Deployment (Full Stack)

**Setup Steps:**
1. Connect your GitHub repository to Render
2. Create a Web Service for the server:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Root Directory: `apps/server`

3. Create a Static Site for the client:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `apps/client/dist`
   - Root Directory: `apps/client`

### 5. Heroku Deployment

**Setup:**
```bash
# Install Heroku CLI and create apps
heroku create your-app-client
heroku create your-app-server

# Deploy server
git subtree push --prefix=apps/server heroku-server main

# Deploy client
git subtree push --prefix=apps/client heroku-client main
```

## Environment Variables

### Server (.env)
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/learnAI
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=https://your-frontend-domain.com
```

### Client (.env)
```bash
VITE_API_URL=https://your-backend-domain.com/api
VITE_APP_NAME=AI Learning Assistant
```

## CI/CD Pipeline

**GitHub Actions Example:**
```yaml
name: Deploy Monorepo

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build applications
        run: npm run build
        
      - name: Deploy to production
        run: |
          # Your deployment commands here
          npm run deploy:vercel
```

## Monitoring & Scaling

### Health Checks
- Client: `GET /`
- Server: `GET /api/health`
- Database: MongoDB Atlas monitoring

### Scaling Considerations
- **Horizontal Scaling**: Use load balancers for multiple server instances
- **Database Scaling**: MongoDB Atlas auto-scaling
- **CDN**: Use Cloudflare or AWS CloudFront for static assets
- **Caching**: Implement Redis for session/data caching

## Troubleshooting

### Common Issues
1. **CORS Errors**: Check CORS_ORIGIN environment variable
2. **Database Connection**: Verify MongoDB URI and network access
3. **Build Failures**: Ensure all dependencies are installed
4. **Port Conflicts**: Check if ports 3000/5000 are available

### Logs
```bash
# Docker logs
docker-compose logs -f

# Heroku logs
heroku logs --tail -a your-app-name

# Railway logs
railway logs
```

## Performance Optimization

### Frontend
- Enable Vite build optimizations
- Implement code splitting
- Use React.lazy for route-based splitting
- Optimize images and assets

### Backend
- Enable gzip compression
- Implement response caching
- Use MongoDB indexes for queries
- Monitor API response times

### Database
- Index frequently queried fields
- Use MongoDB aggregation pipelines
- Implement connection pooling
- Regular database maintenance

## Security

### Best Practices
- Use HTTPS in production
- Implement rate limiting
- Validate all inputs
- Use JWT tokens securely
- Keep dependencies updated
- Enable MongoDB authentication
- Use environment variables for secrets