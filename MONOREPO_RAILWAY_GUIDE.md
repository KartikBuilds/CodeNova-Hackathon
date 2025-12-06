# Railway Monorepo Deployment Guide

**Auto-Generated: December 7, 2025**  
**Monorepo Type:** npm workspaces  
**Apps Detected:** 2 (Frontend + Backend)

---

## 📊 Monorepo Structure

```
CodeNova-Hackathon (root)
├── apps/client/frontend/      # React + Vite frontend
│   ├── src/
│   ├── package.json
│   └── dist/                   # Built assets
├── server/                     # Node.js Express backend
│   ├── src/
│   ├── package.json
│   └── uploads/
└── package.json               # Root workspace config
```

---

## 🔍 Auto-Detection Results

### Overall Configuration
- **Monorepo Type:** npm workspaces
- **Package Manager:** npm
- **Node.js Version Required:** ≥18.0.0
- **npm Version Required:** ≥9.0.0

### App #1: Frontend
- **Path:** `apps/client/frontend/`
- **Type:** Frontend (React + Vite)
- **Port:** 3000
- **Build Command:** `vite build`
- **Start Command:** `vite` (dev) / `vite preview` (production)
- **Features:** None detected

### App #2: Backend
- **Path:** `server/`
- **Type:** Backend (Node.js/Express)
- **Port:** 5000
- **Build Command:** None (no build step needed)
- **Start Command:** `node src/server.js`
- **Features:** 
  - Database: Mongoose (MongoDB)
  - Authentication: JWT (jsonwebtoken)

---

## 🚀 Deployment Options

### Option 1: Backend Only (Recommended for initial deployment)

**Single Railway Service deploying just the backend:**

```bash
# Deploy backend to Railway
railway up

# or with CLI
railway link
railway up
```

**Configuration:**
```
Service Name: CodeNova-Backend
Root Directory: / (monorepo root)
Build Command: (automatic)
Start Command: npm run start --workspace=server
Port: 5000
```

**Environment Variables needed:**
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/learnAI
JWT_SECRET=your-secret-key-here
```

---

### Option 2: Backend + Frontend (Full Stack)

**Two separate Railway services for complete deployment:**

#### Service 1: Backend API
```
Name: CodeNova-Backend
Root: / (uses monorepo structure)
Start: npm run start --workspace=server
Port: 5000
```

#### Service 2: Frontend App
```
Name: CodeNova-Frontend
Root: /apps/client/frontend
Build: npm run build
Start: npm run preview
Port: 3000
```

**Setup Steps:**

1. Create two services in Railway
2. Backend service:
   - No root directory change needed
   - Keep default build behavior
   - Override start: `npm run start --workspace=server`
   - Set PORT=5000

3. Frontend service:
   - Set root directory: `apps/client/frontend`
   - Build stays automatic
   - Override start: `npm run preview`
   - Set VITE_API_URL=https://your-backend-url/api
   - Set PORT=3000

---

## 📋 Environment Variables

### Backend (Required)
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/learnAI
JWT_SECRET=your-long-random-secret-key
```

### Frontend (Optional but recommended)
```bash
VITE_API_URL=https://your-railway-backend.up.railway.app/api
VITE_APP_NAME=CodeNova
```

---

## 🛠️ Nixpacks Build Behavior

Railway uses **Nixpacks** for automatic build detection:

### For Backend (server/)
```
Detected: Node.js
Node version: Auto-detected from package.json (18+)
Build: npm ci (install dependencies)
Start: npm run start --workspace=server
```

### For Frontend (apps/client/frontend/)
```
Detected: Node.js + Vite
Node version: Auto-detected (18+)
Build: npm ci && npm run build --workspace=apps/client/frontend
Start: npm run preview
```

---

## 🔧 Build and Start Commands Reference

### Monorepo Root Commands
```bash
# Install all workspaces
npm install

# Build all apps
npm run build

# Build specific app
npm run build --workspace=server
npm run build --workspace=apps/client/frontend

# Start server
npm run start --workspace=server

# Start client (preview mode)
npm run preview --workspace=apps/client/frontend

# Dev mode (concurrent)
npm run dev
```

### Backend Only
```bash
cd server
npm install
npm start
```

### Frontend Only
```bash
cd apps/client/frontend
npm install
npm run build
npm run preview
```

---

## 🚄 Railway Deployment Process

### Step 1: Prepare
```bash
# Install Railway CLI
npm install -g @railway/cli

# Or via homebrew (macOS)
brew install railway
```

### Step 2: Authenticate
```bash
railway login
# Follow login flow
```

### Step 3: Link Project
```bash
railway link
# Select or create a new Railway project
```

### Step 4: Deploy
```bash
railway up
```

### Step 5: Monitor
```bash
railway logs
railway status
```

---

## 📈 Scaling & Advanced Config

### Multi-Service with Database
```toml
# For backend service with MongoDB
[env]
MONGODB_URI = "your-connection-string"
JWT_SECRET = "your-secret"
NODE_ENV = "production"

# For frontend service
[env]
VITE_API_URL = "https://backend-service.railway.app"
VITE_API_KEY = "optional-api-key"
```

### Custom Build Steps
If you need pre-build steps, create a `build.sh`:
```bash
#!/bin/bash
npm ci
npm run build --workspace=apps/client/frontend
npm run seed --workspace=server  # Optional: seed database
```

Then in railway.toml:
```toml
[build]
buildCommand = "bash build.sh"
```

---

## 🐛 Troubleshooting

### Build fails with "No workspaces found"
**Issue:** railway.toml has wrong start command
**Fix:** Ensure `startCommand = "npm run start --workspace=server"`

### Port already in use
**Issue:** Railway assigns port automatically
**Fix:** Don't set PORT if using Railway (it provides $PORT env var)

### Frontend can't connect to backend
**Issue:** Hardcoded API URL
**Fix:** Use `VITE_API_URL` environment variable in frontend

### Build succeeds but app crashes
**Issue:** Missing environment variables
**Fix:** Set all required env vars in Railway dashboard

---

## 📞 Support & Resources

- **Railway Docs:** https://railway.app/docs
- **Monorepo Guide:** https://railway.app/docs/deployments/monorepo
- **Environment Variables:** https://railway.app/docs/develop/variables
- **Logs & Debugging:** https://railway.app/docs/deployments/logs

---

## ✅ Verification Checklist

- [ ] Docker build succeeds locally: `docker build -t app .`
- [ ] npm install works: `npm install`
- [ ] Backend starts: `npm run start --workspace=server`
- [ ] Frontend builds: `npm run build --workspace=apps/client/frontend`
- [ ] All env vars set in Railway dashboard
- [ ] GitHub repo is connected to Railway
- [ ] railway.toml exists and is correct
- [ ] Deploy command runs: `railway up`
- [ ] Logs show no errors: `railway logs`
- [ ] API responds on backend port
- [ ] Frontend loads if separate service
- [ ] Database connection works
- [ ] Authentication tokens work

---

**Generated by monorepo-detector.py**  
**For detailed app info, see: .monorepo-detection.json**
