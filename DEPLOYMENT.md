# CodeNova Deployment Guide

**Status:** Ready for deployment  
**Architecture:** Vercel (frontend) + Render (backend) + MongoDB Atlas (database)  
**Frontend Build Time:** ~1-2 minutes  
**Backend Start Time:** ~30-60 seconds

---

## Recommended Deployment Stack

### Frontend: Vercel
- ✅ Optimal for React + Vite
- ✅ Zero-config deployment
- ✅ Global CDN with edge caching
- ✅ Environment variables management
- ✅ Free tier with generous limits

### Backend: Render
- ✅ Easy Node.js deployment
- ✅ Built-in health checks
- ✅ Auto-restart on failure
- ✅ Environment variables dashboard
- ✅ MongoDB integration ready

### Database: MongoDB Atlas
- ✅ Free M0 cluster included
- ✅ Automatic backups
- ✅ IP whitelist security
- ✅ Connection string auto-generation

---

## Deployment Architecture

### Service Layout

```
Frontend (Vercel)
└─ apps/client/frontend/
   ├─ React + Vite app
   ├─ Build: npm run build
   ├─ Output: dist/
   └─ API calls to: VITE_API_URL (Render backend URL)

Backend (Render)
└─ server/
   ├─ Express + Node.js
   ├─ Serves: /api/* routes
   ├─ Port: process.env.PORT || 5000
   └─ Health check: GET /api/health

Database (MongoDB Atlas)
└─ Cloud MongoDB
   ├─ Free M0 cluster
   └─ URI: MONGO_URI env variable
```

### Request Flow

```
Browser → Vercel (frontend) → Render (backend) → MongoDB Atlas
                ↓
            VITE_API_URL
            (points to Render)
```

---

## Pre-Deployment Setup

### 1. MongoDB Atlas (One-time)

**Create MongoDB Cluster:**
1. Go to https://mongodb.com/cloud/atlas
2. Sign in / Create free account
3. Create new organization
4. Create new project: "CodeNova"
5. Create M0 (free) cluster
   - Cloud provider: AWS
   - Region: closest to users
   - Cluster name: `codenova`
6. Create database user:
   - Username: `codenova_user` (not your account email)
   - Auto-generate password
   - Copy password immediately
7. Set IP whitelist:
   - Click "Add IP Address"
   - For development: add `0.0.0.0/0` (any IP)
   - For production: add Render's static IP (from logs after first deploy)
8. Get connection string:
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string: `mongodb+srv://username:password@cluster.mongodb.net/codenova?retryWrites=true`

### 2. Groq API Key

1. Go to https://console.groq.com/keys
2. Sign in / Create account
3. Create new API key
4. Copy key (format: `gsk_...`)

### 3. Generate Secrets

```bash
# Generate JWT_SECRET
openssl rand -base64 32

# Generate SESSION_SECRET
openssl rand -base64 32

# Example output:
# a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

---

## Vercel Frontend Deployment

### Dashboard Settings

**Project Setup:**
| Setting | Value |
|---------|-------|
| Framework Preset | Next.js → **Other (Vite)** |
| Root Directory | `apps/client/frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

**Environment Variables:**
| Variable | Value | Example |
|----------|-------|---------|
| VITE_API_URL | Backend Render URL | `https://codenova-backend.onrender.com` |

**Build Settings:**
- Ignore Build Step: (leave unchecked)
- Framework: Vite
- Node Version: 20.x

### Step-by-Step Vercel Deployment

**1. Create Vercel Account**
```
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel to access repositories
```

**2. Import Project**
```
In Vercel dashboard:
1. Click "Add New"
2. Select "Project"
3. Search for "CodeNova-Hackathon"
4. Click "Import"
```

**3. Configure Project**
```
Project Name: codenova-frontend
Framework Preset: Other (Vite)
Root Directory: apps/client/frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

**4. Add Environment Variables**
```
In Vercel → Settings → Environment Variables:

Name: VITE_API_URL
Value: https://codenova-backend.onrender.com
Environments: Production, Preview, Development
```

**5. Deploy**
```
Click "Deploy"
Wait for: "Deployment Successful"
Note URL: https://codenova-frontend.vercel.app
```

**6. Verify Deployment**
```bash
# Frontend loads
curl https://codenova-frontend.vercel.app

# API URL is configured
curl https://codenova-frontend.vercel.app | grep "api" -i

# Expected: HTML response with app content
```

---

## Render Backend Deployment

### Dashboard Settings

**Service Configuration:**
| Setting | Value |
|---------|-------|
| Service Type | Web Service (Node.js) |
| Root Directory | `server` |
| Build Command | `npm install` |
| Start Command | `node src/server.js` |
| Environment | Node 20 |
| Port | Auto-detect from `process.env.PORT` |

**Health Check:**
| Setting | Value |
|---------|-------|
| Path | `/api/health` |
| Port | `10000` |
| Protocol | HTTP |
| Interval | 30 seconds |
| Timeout | 5 seconds |

**Environment Variables:**
| Variable | Value | Example |
|----------|-------|---------|
| NODE_ENV | production | production |
| PORT | (auto, don't set) | |
| MONGO_URI | MongoDB connection | mongodb+srv://user:pass@cluster... |
| GROQ_API_KEY | Groq API key | gsk_... |
| JWT_SECRET | Random 32+ chars | (generated) |
| SESSION_SECRET | Random 32+ chars | (generated) |
| CORS_ORIGIN | Frontend URL | https://codenova-frontend.vercel.app |
| AI_MOCK_MODE | false | false |

### Step-by-Step Render Deployment

**1. Create Render Account**
```
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access repositories
```

**2. Create Web Service**
```
In Render dashboard:
1. Click "New +"
2. Select "Web Service"
3. Search for "CodeNova-Hackathon"
4. Click "Connect"
```

**3. Configure Service**
```
Name: codenova-backend
Environment: Node
Build Command: npm install
Start Command: node src/server.js
Root Directory: server
Instance Type: Free (for testing) or Starter+ (production)
```

**4. Add Environment Variables**
```
In Render → Services → codenova-backend → Environment:

Click "Add Environment Variable" for each:

NODE_ENV = production
MONGO_URI = mongodb+srv://username:password@cluster.mongodb.net/codenova?retryWrites=true&w=majority
GROQ_API_KEY = gsk_[YOUR_KEY]
JWT_SECRET = [GENERATED_32_CHAR_STRING]
SESSION_SECRET = [GENERATED_32_CHAR_STRING]
CORS_ORIGIN = https://codenova-frontend.vercel.app
AI_MOCK_MODE = false
```

**5. Deploy**
```
Click "Create Web Service"
Wait for: "Your service is live at https://codenova-backend.onrender.com"
Note URL: https://codenova-backend.onrender.com
```

**6. Get Static IP (for MongoDB whitelist)**
```
After deployment:
1. Go to Settings → General
2. Copy "Static IP"
3. Go to MongoDB Atlas → Network Access
4. Add Static IP to whitelist (remove 0.0.0.0/0 in production)
```

**7. Update Frontend Environment**
```
In Vercel → Settings → Environment Variables:
Update VITE_API_URL to the Render URL
(e.g., https://codenova-backend.onrender.com)

This will trigger a redeploy of the frontend
```

**8. Verify Deployment**
```bash
# Health check
curl https://codenova-backend.onrender.com/api/health
# Expected: {"status":"ok"}

# Database connection (check logs)
# Expected log: "MongoDB Connected"

# CORS check
curl -H "Origin: https://codenova-frontend.vercel.app" \
     https://codenova-backend.onrender.com/api/health
# Expected: 200 OK with CORS headers
```

---

## Post-Deployment Testing

### Frontend Tests

```bash
# Load frontend
curl -I https://codenova-frontend.vercel.app
# Expected: 200 OK, text/html content-type

# Check API URL configuration
curl https://codenova-frontend.vercel.app | grep -i "api"
# Expected: Reference to API URL in JavaScript
```

### Backend Tests

```bash
# Health endpoint
curl https://codenova-backend.onrender.com/api/health
# Expected: {"status":"ok"}

# Protected route (no auth)
curl -s https://codenova-backend.onrender.com/api/quiz/history
# Expected: 401 Unauthorized

# AI endpoint (production, no mock)
curl -X POST https://codenova-backend.onrender.com/api/tutor/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'
# Expected: 200 (if GROQ_API_KEY set) or 503 (if missing)
```

### Database Tests

```
In Render → codenova-backend → Logs:
1. Look for "MongoDB Connected" message
2. Confirm no database connection errors
3. Check for Mongoose warnings (non-fatal)
```

### End-to-End Tests

```bash
# Frontend calls backend
# 1. Open https://codenova-frontend.vercel.app
# 2. Navigate to any AI feature (Tutor, Flashcards, etc.)
# 3. Observe:
#    - No CORS errors in console
#    - API calls go to backend URL
#    - Responses display correctly
#    - Mock warning if GROQ_API_KEY missing
```

---

## Monitoring & Maintenance

### Vercel Monitoring
- **Dashboard:** https://vercel.com/dashboard
- **View Logs:** Projects → codenova-frontend → Logs
- **Deployments:** View each deployment status
- **Analytics:** View built-in analytics

### Render Monitoring
- **Dashboard:** https://dashboard.render.com
- **View Logs:** Services → codenova-backend → Logs
- **Metrics:** View CPU, memory, request count
- **Health Check:** Auto-restarts on failure
- **Redeploy:** Manual redeploy available

### MongoDB Atlas Monitoring
- **Cluster Status:** https://cloud.mongodb.com/v2
- **Connection Stats:** View active connections
- **Backups:** Check automated backup status
- **Performance:** Monitor query performance

---

## Scaling & Performance

### If Frontend Gets Slow
```
Vercel automatically handles scaling:
- Distributed to global CDN
- Edge functions for dynamic content
- Automatic cache invalidation
```

### If Backend Gets Slow
```
Render Dashboard → Services → codenova-backend:
1. Go to Settings
2. Change Instance Type to higher tier
3. Or add more resources (CPU/RAM)
4. Service redeploys automatically
```

### If Database Gets Slow
```
MongoDB Atlas → Cluster → Metrics:
1. Review query performance
2. Consider upgrading to M2 or higher
3. Add indexes if needed
```

---

## Troubleshooting

### Frontend: "Cannot GET /"
- Check Vercel deployment status
- Verify build command ran successfully
- Confirm `dist/` folder contains files
- Check build logs for errors

### Frontend: API calls return 404
- Verify VITE_API_URL points to Render backend
- Check Vercel environment variables
- Confirm Render backend is running
- Test backend health endpoint directly

### Backend: "Failed to connect to MongoDB"
- Verify MONGO_URI is correct
- Check MongoDB user credentials
- Confirm Render IP is whitelisted in MongoDB
- Test connection string locally

### Backend: "Groq API key not configured"
- In production: endpoints return 503 (expected)
- Verify GROQ_API_KEY in Render environment
- Check key is valid at console.groq.com
- Ensure no leading/trailing spaces in key

### Backend: "CORS errors in frontend"
- Verify CORS_ORIGIN matches frontend URL
- Check Render environment variables
- Restart backend service
- Clear browser cache

### Slow Startup
- Free Render instances spin down after 15 min inactivity
- First request will take 30-60 seconds
- Upgrade to Starter+ for always-on service
- Or use monitoring service to keep alive

---

## Security Checklist

Before Going Live:

- [ ] Groq API key rotated (old key was exposed in git)
- [ ] MongoDB user password is strong
- [ ] Render static IP added to MongoDB whitelist
- [ ] CORS_ORIGIN matches frontend domain
- [ ] AI_MOCK_MODE is false
- [ ] All secrets in Vercel/Render environment (not .env files)
- [ ] No .env files committed to git
- [ ] JWT_SECRET is random
- [ ] SESSION_SECRET is random
- [ ] Frontend doesn't expose any API keys
- [ ] Backend properly validates inputs
- [ ] HTTPS enabled (automatic on Vercel/Render)
- [ ] Health checks passing consistently
- [ ] Logs show no errors

---

## Environment Variables Reference

### Frontend (Vercel)

| Variable | Required | Example |
|----------|----------|---------|
| VITE_API_URL | Yes | https://codenova-backend.onrender.com |

### Backend (Render)

| Variable | Required | Example |
|----------|----------|---------|
| NODE_ENV | Yes | production |
| MONGO_URI | Yes | mongodb+srv://user:pass@cluster.mongodb.net/codenova |
| GROQ_API_KEY | Yes* | gsk_... |
| JWT_SECRET | Yes | (random 32+ chars) |
| SESSION_SECRET | Yes | (random 32+ chars) |
| CORS_ORIGIN | Yes | https://codenova-frontend.vercel.app |
| AI_MOCK_MODE | No | false |

*Groq key required for AI features; missing → 503 response

---

## Quick Reference

| Task | Platform | Action |
|------|----------|--------|
| Deploy frontend | Vercel | git push → auto-deploys |
| Deploy backend | Render | git push → auto-deploys |
| View frontend logs | Vercel | Projects → Logs |
| View backend logs | Render | Services → Logs |
| Set env variables | Vercel | Settings → Environment Variables |
| Set env variables | Render | Environment → Add Variable |
| Scale frontend | Vercel | Automatic (built-in) |
| Scale backend | Render | Settings → Instance Type |
| Check health | Backend | curl /api/health |
| Update frontend URL | Render | Update CORS_ORIGIN |
| Update backend URL | Vercel | Update VITE_API_URL |

---

## Support

**Vercel Docs:** https://vercel.com/docs  
**Render Docs:** https://render.com/docs  
**MongoDB Docs:** https://docs.mongodb.com/manual/  
**Groq API Docs:** https://console.groq.com/docs

---

## Summary

**Frontend:** Vercel (automatic deployment from git)  
**Backend:** Render (automatic deployment from git)  
**Database:** MongoDB Atlas (cloud-hosted)  
**Deployment:** No manual steps after initial setup  
**Scaling:** Automatic for frontend, manual for backend  
**Cost:** Free tier available for all services
