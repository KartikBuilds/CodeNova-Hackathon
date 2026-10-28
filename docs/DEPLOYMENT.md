# CodeNova Deployment Guide

**Status:** Ready for deployment  
**Architecture:** Vercel (frontend) + Render (backend) + MongoDB Atlas (database)

---

## Deployment Stack Overview

### Recommended Architecture

```
User Browser
    ↓
Vercel (Frontend - React + Vite)
    ↓ (API calls to VITE_API_URL)
Render (Backend - Express + Node.js)
    ↓ (MongoDB connection)
MongoDB Atlas (Cloud database)
```

### Why This Stack?

| Component | Platform | Reason |
|-----------|----------|--------|
| Frontend | Vercel | Optimized for React/Vite, CDN by default, zero-config deployment |
| Backend | Render | Simple Node.js deployment, health checks, auto-restart |
| Database | MongoDB Atlas | Free M0 cluster, automatic backups, cloud-hosted |

---

## Pre-Deployment Setup

### 1. MongoDB Atlas

**Create Account & Cluster:**
1. Go to https://mongodb.com/cloud/atlas
2. Create free account
3. Create M0 (free) cluster named `codenova`
4. Choose region closest to your users

**Create Database User:**
1. Database Access → Add New Database User
2. Username: `codenova_db_user` (not your email)
3. Password: Choose strong password (auto-generate recommended)
4. Copy password immediately (cannot retrieve later)

**Get Connection String:**
1. Clusters → Connect → Connect Your Application
2. Copy connection string: `mongodb+srv://username:password@cluster.mongodb.net/codenova?retryWrites=true&w=majority`

### 2. Groq API Key

**IMPORTANT:** The previous key was exposed in git history and must be rotated.

1. Go to https://console.groq.com/keys
2. Generate NEW API key (starts with `gsk_`)
3. Copy key value

### 3. Generate Secrets

```bash
# Generate JWT_SECRET (run locally)
openssl rand -base64 32

# Generate SESSION_SECRET (run locally)
openssl rand -base64 32
```

Save these outputs for Render configuration.

---

## MongoDB Atlas Network Configuration

### Understanding the Trade-off

MongoDB Atlas restricts connections by IP address for security. You have two options:

#### Option 1: CIDR Ranges (Recommended for Production)

**Why:** More restrictive, better security

**Steps:**
1. Get Render's outbound CIDR range for your region
   - Render publishes documented ranges: https://render.com/docs/deploy-to-render
   - Search documentation for your region's egress CIDR
2. Go to MongoDB Atlas → Network Access
3. Add Render's CIDR range to IP whitelist
4. Use strong database password
5. Limit database user privileges to necessary databases only

**Example (check docs for your region):**
```
CIDR: 34.193.0.0/16 (example for us-east-1)
Reason: Render backend server
```

**Verification:**
```bash
# After Render deployment, check logs for connection status
# Render Dashboard → Services → Logs
# Expected: "MongoDB Connected" message
```

#### Option 2: Open Network (Temporary Development Only)

**WARNING:** Not recommended for production. Only for testing/demo.

**Steps:**
1. Go to MongoDB Atlas → Network Access
2. Add IP address: `0.0.0.0/0` (allows ANY IP)
3. Use STRONGEST possible database password
4. Use least-privilege database user (only needed permissions)
5. Plan to migrate to Option 1 before production

**Required Mitigations:**
- ✅ Strong unique password (not reused anywhere else)
- ✅ Least-privilege user (read/write to specific database only)
- ✅ Limit authentication methods
- ✅ Monitor MongoDB Atlas activity logs
- ✅ Set up backups

**Convert to Production Later:**
Once you understand Render's CIDR ranges for your region, replace `0.0.0.0/0` with the specific CIDR blocks for better security.

---

## Vercel Frontend Deployment

### 1. Create Project

1. Go to https://vercel.com
2. Sign up with GitHub / Sign in
3. Click "Add New" → "Project"
4. Search for and select: CodeNova-Hackathon
5. Click "Import"

### 2. Configure

**Framework & Root:**
```
Framework Preset: Other (Vite)
Root Directory: apps/client/frontend
```

**Build Settings:**
```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node.js Version: 20.x
```

### 3. Environment Variables

Add this variable before deploying:

| Name | Value |
|------|-------|
| VITE_API_URL | `[RENDER_BACKEND_URL]` |

**Note:** You'll get the Render URL after backend deployment. Deploy frontend first with placeholder, update once Render URL is available.

**To Update Later:**
1. Settings → Environment Variables
2. Update VITE_API_URL to Render's actual URL
3. This triggers automatic redeploy

### 4. Deploy

Click "Deploy"

Expected:
- Build logs show: npm install → npm run build
- "Deployment successful" message
- Frontend URL appears (will be `https://[project].vercel.app` or custom domain)

### 5. Verify Frontend

```bash
# Check frontend loads
curl -I https://[your-vercel-url]

# Expected: 200 OK, text/html content-type
```

---

## Render Backend Deployment

### 1. Create Service

1. Go to https://render.com
2. Sign up with GitHub / Sign in
3. Click "New +" → "Web Service"
4. Search for and select: CodeNova-Hackathon
5. Click "Connect"

### 2. Configure Service

**Basic Settings:**
```
Name: codenova-backend
Environment: Node
Repository: CodeNova-Hackathon
Branch: main
Root Directory: server
```

**Build & Start Commands:**
```
Build Command: npm install
Start Command: node src/server.js
```

**Instance Type:**
```
Free (for testing - spins down after 15 min inactivity)
OR
Starter+ (for production - always on)
```

### 3. Add Environment Variables

Click "Environment" and add each variable:

| Name | Value |
|------|-------|
| `NODE_ENV` | `production` |
| `MONGO_URI` | `mongodb+srv://codenova_db_user:PASSWORD@cluster.mongodb.net/codenova?retryWrites=true&w=majority` |
| `GROQ_API_KEY` | `gsk_[your_new_api_key]` |
| `JWT_SECRET` | `[output from openssl rand -base64 32]` |
| `SESSION_SECRET` | `[output from openssl rand -base64 32]` |
| `CORS_ORIGIN` | `https://[your-vercel-url]` |
| `AI_MOCK_MODE` | `false` |

**Note:** Replace placeholders with actual values.

### 4. Configure Health Check

Click "Settings" → "Health Check":

| Setting | Value |
|---------|-------|
| Path | `/api/health` |
| Port | `10000` |
| Protocol | HTTP |
| Interval | 30 seconds |
| Timeout | 5 seconds |

### 5. Deploy

Click "Create Web Service"

Expected:
- Build logs complete
- "Your service is live" message
- Backend URL displayed (will be `https://[project].onrender.com`)

**Note on Free Tier:** If using free instance, first request after inactivity takes 30-60 seconds (service wakes up). For production, upgrade to Starter+.

### 6. Verify Backend

```bash
# Health check
curl https://[your-render-url]/api/health

# Expected: {"status":"ok"}

# Check logs for startup
# Render Dashboard → Services → [service] → Logs
# Expected: "Server is running on port 5000"
# Expected: "MongoDB Connected"
```

---

## Finalize Frontend Configuration

### Update Vercel with Render URL

1. Get your Render backend URL from deployment
2. Go to Vercel → Settings → Environment Variables
3. Update `VITE_API_URL` with actual Render URL
4. This triggers automatic frontend redeploy

### Verify Integration

```bash
# Frontend loads
curl -s https://[your-vercel-url] | head -20

# Open browser and check:
# 1. Frontend loads at https://[your-vercel-url]
# 2. No CORS errors in Console (F12)
# 3. Try an AI feature (Tutor, Flashcards, etc.)
# 4. API calls reach backend successfully
```

---

## Post-Deployment Testing

### Health Checks

```bash
# Backend health
curl https://[your-render-url]/api/health
# Expected: {"status":"ok"}

# Frontend loads
curl https://[your-vercel-url]
# Expected: HTML response

# Protected route (should reject)
curl https://[your-render-url]/api/quiz/history
# Expected: 401 Unauthorized
```

### AI Features

**Without Groq API Key (Expected Behavior in Production):**
```bash
curl -X POST https://[your-render-url]/api/tutor/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'
# Expected: 503 Service Unavailable (not mock data)
```

**With Groq API Key:**
```bash
# Same endpoint returns real AI response (200 OK)
```

### Full Integration Test

1. Open https://[your-vercel-url] in browser
2. Open DevTools (F12) → Console
3. Navigate to any AI feature
4. Verify:
   - ✅ No CORS errors
   - ✅ API calls succeed (or return 503 if no GROQ_API_KEY)
   - ✅ Frontend displays responses correctly
   - ✅ If GROQ_API_KEY missing: warning displayed, 503 shown

---

## Troubleshooting

### Frontend Won't Build (Vercel)

**Steps:**
1. Vercel Dashboard → Deployments
2. Click failed deployment (red X)
3. View "Build Logs" for error
4. Verify: Root Directory = `apps/client/frontend`
5. Verify: Build Command = `npm run build`

**Common Issues:**
- Missing dependency: Check `apps/client/frontend/package.json`
- Environment variable missing: Check VITE_API_URL is set
- Node version: Ensure 20.x is selected

### Backend Won't Start (Render)

**Steps:**
1. Render Dashboard → Services → [service]
2. View "Logs" tab
3. Look for error messages
4. Click "Restart" to retry

**Common Issues:**
- MongoDB connection failed: Check MONGO_URI and password are correct
- Database IP not whitelisted: Add Render's CIDR range or 0.0.0.0/0 to MongoDB Atlas
- Missing environment variables: Verify all 7 variables are set
- Port conflict: Server uses `process.env.PORT` (no need to set manually)

### CORS Errors in Frontend Console

**Steps:**
1. Render Dashboard → Services → codenova-backend → Environment
2. Update `CORS_ORIGIN` to match exact Vercel URL
3. Service auto-redeploys
4. Refresh browser (clear cache if needed)

**Note:** Must be exact match (including protocol and domain):
```
✅ https://codenova-frontend.vercel.app
❌ https://codenova-frontend.vercel.app/ (trailing slash)
❌ codenova-frontend.vercel.app (missing https://)
```

### MongoDB Connection Failed

**Steps:**
1. Verify connection string in Render environment: `MONGO_URI`
2. Check database password is correct (no special char encoding needed in env var)
3. Verify database IP whitelist:
   - If using CIDR: Confirm Render's range is correct for your region
   - If using 0.0.0.0/0: Already allows connection
4. Test connection string locally:
   ```bash
   mongosh "mongodb+srv://user:password@cluster/codenova"
   ```

---

## Production Considerations

### Scaling

**Frontend (Vercel):**
- Automatically scales globally via CDN
- No manual intervention needed

**Backend (Render):**
- Free tier: Service sleeps after 15 min inactivity
- Production: Upgrade to Starter+ for always-on service
- Further scaling: Add more instances if needed

**Database (MongoDB Atlas):**
- Free M0: Good for development/testing
- Production: Consider M2 or higher for reliability

### Monitoring

**Vercel:**
- Automatic error tracking
- Check: Dashboard → Logs
- View: Analytics for traffic patterns

**Render:**
- Service health status: Auto-restart on failure
- Check: Services → [name] → Logs
- View: Metrics for CPU/memory usage

**MongoDB Atlas:**
- Check: Clusters → Activity for query patterns
- Review: Network Access logs
- Monitor: Backups are running

### Security

**Required Before Production:**
- ✅ Groq API key rotated (old key was exposed)
- ✅ MongoDB password is strong and unique
- ✅ Database user has least-privilege access
- ✅ CORS_ORIGIN updated to match Vercel domain
- ✅ AI_MOCK_MODE set to false
- ✅ All secrets in platform dashboards only
- ✅ No .env files committed to git

**Network Security (MongoDB):**
- ✅ Use CIDR ranges (preferred) OR 0.0.0.0/0 with strong password
- ✅ Monitor MongoDB Atlas for unauthorized connection attempts
- ✅ Plan to migrate from 0.0.0.0/0 to CIDR before release

---

## Environment Variables Reference

### Frontend (Vercel)

| Variable | Required | Purpose |
|----------|----------|---------|
| `VITE_API_URL` | Yes | Backend API base URL (e.g., `https://[render-url]`) |

### Backend (Render)

| Variable | Required | Purpose |
|----------|----------|---------|
| `NODE_ENV` | Yes | Set to `production` |
| `MONGO_URI` | Yes | MongoDB connection string |
| `GROQ_API_KEY` | Yes* | Groq API key for AI features |
| `JWT_SECRET` | Yes | Random 32+ character string for JWT |
| `SESSION_SECRET` | Yes | Random 32+ character string for sessions |
| `CORS_ORIGIN` | Yes | Frontend URL for CORS (e.g., `https://[vercel-url]`) |
| `AI_MOCK_MODE` | No | Set to `false` (default) for production |

*Missing GROQ_API_KEY returns 503 (expected behavior in production)

---

## Deployment Checklist

### Pre-Deployment
- [ ] MongoDB cluster created
- [ ] Database user created (codenova_db_user)
- [ ] Connection string copied
- [ ] Network access configured (CIDR or 0.0.0.0/0)
- [ ] NEW Groq API key generated
- [ ] JWT_SECRET generated via openssl
- [ ] SESSION_SECRET generated via openssl

### Backend (Render)
- [ ] Create Render account
- [ ] Create Web Service from repository
- [ ] Set Root: server
- [ ] Set Build: npm install
- [ ] Set Start: node src/server.js
- [ ] Add all environment variables
- [ ] Configure health check: /api/health
- [ ] Deploy and verify "service is live"
- [ ] Test health endpoint
- [ ] Check logs for "MongoDB Connected"

### Frontend (Vercel)
- [ ] Create Vercel account
- [ ] Import repository
- [ ] Set Root: apps/client/frontend
- [ ] Set Build: npm run build
- [ ] Set Output: dist
- [ ] Add VITE_API_URL with Render URL
- [ ] Deploy and verify
- [ ] Test frontend loads
- [ ] Test API integration

### Post-Deployment
- [ ] Health check passes
- [ ] Frontend loads without errors
- [ ] API calls work (verify in browser DevTools)
- [ ] CORS errors resolved
- [ ] Monitor logs for first hour
- [ ] Test AI features (expect 503 if no key, or mock warning if enabled)

---

## Quick Reference

| Task | Platform | Path |
|------|----------|------|
| Deploy Frontend | Vercel | https://vercel.com/dashboard |
| Deploy Backend | Render | https://dashboard.render.com |
| Configure Database | MongoDB Atlas | https://cloud.mongodb.com |
| Get Groq Key | Groq Console | https://console.groq.com/keys |
| View Frontend Logs | Vercel | Dashboard → Project → Logs |
| View Backend Logs | Render | Dashboard → Services → [name] → Logs |

---

## Support

**Vercel Documentation:** https://vercel.com/docs
**Render Documentation:** https://render.com/docs
**MongoDB Documentation:** https://docs.mongodb.com
**Groq API Documentation:** https://console.groq.com/docs

---

## Summary

1. **MongoDB Atlas:** Create M0 cluster, add IP whitelist (CIDR preferred, 0.0.0.0/0 fallback)
2. **Render Backend:** Deploy first, get URL
3. **Vercel Frontend:** Deploy second, set VITE_API_URL to Render URL
4. **Verify:** Test health, integration, and error handling
5. **Monitor:** Check logs for issues in first hour

**Do not deploy with mock data in production.** When GROQ_API_KEY is missing, endpoints return 503 Service Unavailable (not silent mock fallback).
