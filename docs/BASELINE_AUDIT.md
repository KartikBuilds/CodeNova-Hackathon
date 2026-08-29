# CodeNova Baseline Audit
**Date:** 2026-08-29  
**Status:** CRITICAL SECURITY ISSUES FOUND

---

## 1. CRITICAL SECURITY FINDINGS

### 🚨 Hardcoded Groq API Key Exposed
**Severity:** CRITICAL  
**Scope:** Frontend code + Git history  
**Details:**
- API key `[REDACTED - Previously Exposed Groq Credential]` hardcoded in 3 files:
  - `apps/client/frontend/src/components/DocumentRAG.jsx:124`
  - `apps/client/frontend/src/components/TutorChat.jsx:132`
  - `apps/client/frontend/src/pages/Flashcards.jsx:235`
- Key is also in Git history (commit 7be52f0)
- **Action Required:** Rotate this API key immediately

### 🚨 Frontend Calling External AI API Directly
**Severity:** CRITICAL  
**Issue:** Frontend components bypass backend and make direct HTTPS calls to Groq API
- Exposes API key to browser (client-side secret)
- Violates separation of concerns
- Creates CORS/security vulnerabilities
- Backend already has proper Groq integration via LangChain but frontend doesn't use it

---

## 2. ARCHITECTURE ASSESSMENT

### Current State
- **Monorepo:** ✅ Proper structure (root + `apps/client/frontend`, `server`)
- **Frontend:** Vite React (React 19.2.0, modern setup)
- **Backend:** Express with LangChain + Groq integration
- **Database:** MongoDB (required, no fallback)
- **Deployment:** Docker multi-stage build configured for Railway

### Architecture Issues
| Issue | Impact | Fix |
|-------|--------|-----|
| Frontend directly calls Groq API | Security breach, poor separation | Route through backend |
| No backend endpoints for chat/RAG/flashcards | Frontend forced to call external APIs | Create missing endpoints |
| MongoDB required but no local test setup | Can't test without MongoDB | Optional fallback for dev |
| Hardcoded API key in frontend | Credential exposure | Use env vars, backend proxy |

---

## 3. CODEBASE STATE

### Working Features
- ✅ Monorepo setup (npm workspaces)
- ✅ Frontend routing (React Router v7)
- ✅ Backend core structure (Express, middleware, routes)
- ✅ LangChain Groq integration (backend)
- ✅ Docker configuration (multi-stage build)
- ✅ Database models (User, Profile, LearningPath, etc.)

### Broken/Incomplete Features
| Component | Status | Issue |
|-----------|--------|-------|
| TutorChat | ❌ Broken | Direct Groq API call with hardcoded key |
| DocumentRAG | ❌ Broken | Direct Groq API call with hardcoded key |
| Flashcards | ❌ Broken | Direct Groq API call with hardcoded key |
| Backend tutor API | ❌ Missing | No `/api/tutor/chat` endpoint |
| Backend RAG API | ❌ Missing | No `/api/analysis/rag` endpoint |
| Backend flashcards API | ❌ Missing | No `/api/learning/flashcards/generate` endpoint |

### Dead Code
- Multiple deployment guides (DEPLOYMENT.md, RAILWAY_DEPLOYMENT.md, etc.) - hackathon artifacts
- Unused AI service functions (mocks included but not referenced in frontend)

---

## 4. DEPENDENCY & BUILD STATUS

### Package Analysis
**Root:** `ai-learning-assistant-monorepo`  
**Frontend:** Vite + React 19.2.0 + TailwindCSS  
**Backend:** Express 4.18.2 + Mongoose 8.20.2 + LangChain 1.1.5 + @langchain/groq 1.0.2  

### Known Issues
- ❌ Frontend linting: ESLint configured but likely failing (hardcoded API keys = linting errors)
- ⚠️ No type safety: Frontend is JSX without TypeScript
- ⚠️ Tests missing: Both frontend and backend have no tests

---

## 5. ENVIRONMENT & CONFIGURATION

### Required Environment Variables
**Backend (.env or deployment):**
- `MONGO_URI` - MongoDB connection string (required)
- `GROQ_API_KEY` - Groq API key (required for AI features)
- `JWT_SECRET` - JWT signing key
- `SESSION_SECRET` - Session signing key
- `CORS_ORIGIN` - Frontend domain for CORS
- `PORT` - Server port (default: 5000)

**Frontend (.env):**
- `VITE_API_URL` - Backend API base URL
- Currently missing: `VITE_GROQ_API_KEY` (wrong approach - should not be in frontend)

### .env.example Status
- ✅ Exists but incomplete
- ❌ Missing `GROQ_API_KEY`
- ❌ `.env` files NOT tracked (correct)
- ⚠️ Placeholder values only

---

## 6. DEPLOYMENT READINESS

### Current Deployment Status: ❌ NOT PRODUCTION-READY

| Aspect | Status | Notes |
|--------|--------|-------|
| Security | ❌ CRITICAL | Hardcoded API keys in frontend |
| Architecture | ❌ BROKEN | Frontend bypasses backend |
| Build Process | ⚠️ WARNING | Not tested locally |
| MongoDB | ⚠️ REQUIRED | No local dev option |
| CI/CD | ⚠️ MISSING | No GitHub Actions or CI pipeline |
| Error Handling | ✅ OK | Backend has error middleware |
| Logging | ⚠️ BASIC | Console logging only |

### Deployment Platform
**Target:** Railway (docker-compose.yml and railway.json configured)  
**Docker:** Multi-stage build configured correctly  
**Startup:** `node server/src/server.js`

---

## 7. FEATURE VERIFICATION

### Verified Working Features
- ✅ Health check endpoint (`/api/health`)
- ✅ Backend structure and routing
- ✅ Middleware setup (CORS, body parsing, error handling)
- ✅ React Router setup on frontend
- ✅ TailwindCSS configured

### Unverified / Broken Features
- ❌ Authentication flow (JWT setup exists but not tested)
- ❌ Quiz generation (backend logic exists, frontend doesn't use it)
- ❌ Chat functionality (frontend has hardcoded key)
- ❌ Document RAG (frontend has hardcoded key)
- ❌ Flashcard generation (frontend has hardcoded key)
- ❌ Learning paths and analytics (backend routes exist)
- ❌ User profiles (backend routes exist, untested)

---

## 8. GIT HISTORY & SECRETS

### Secret Rotation Needed
- ✅ **Groq API Key** `[REDACTED - Previously Exposed Groq Credential]`
  - Found in commit 7be52f0 (Git history - no rewrite recommended)
  - Found in current working tree (will be removed)
  - **Action:** Revoke this key on Groq dashboard immediately

### Git Status
- ✅ Working tree clean (no uncommitted changes)
- ✅ .gitignore properly excludes .env files
- ⚠️ Git history contains exposed secret (credential rotation only, no history rewrite)

---

## 9. RECOMMENDED FIX PRIORITY

### Phase 1: CRITICAL (Blocking Deployment)
1. Remove hardcoded API keys from frontend files
2. Create backend API endpoints for AI features (chat, RAG, flashcards)
3. Update frontend components to call backend endpoints
4. Update .env.example with correct variables

### Phase 2: IMPORTANT (Before Production)
1. Verify MongoDB connection flow
2. Test complete auth flow (register → login → protected routes)
3. Validate error handling and user feedback
4. Ensure no secrets leak in production build

### Phase 3: NICE-TO-HAVE (Not Blocking)
1. Add TypeScript to frontend
2. Add unit tests
3. Add GitHub Actions CI/CD
4. Remove hackathon deployment guides
5. Add request logging

---

## 10. DEPLOYMENT PREREQUISITES

Before deploying to production, ensure:
- [ ] All hardcoded API keys removed from code
- [ ] MongoDB instance provisioned (cloud or self-hosted)
- [ ] Groq API key obtained and set in deployment environment
- [ ] Frontend built and verified locally
- [ ] Backend server starts without errors
- [ ] Health check endpoint responds
- [ ] Full user flow tested (auth → learning → AI features)
- [ ] Secret rotation completed for exposed key
- [ ] GitHub repository status clean (no staged secrets)

---

## Summary

**Current Status:** ❌ **BLOCKED - CRITICAL SECURITY ISSUES**

**Must Fix Before Deployment:**
1. Remove hardcoded API keys (3 files)
2. Create missing backend endpoints
3. Update frontend to use backend APIs
4. Rotate exposed Groq API key

**Estimated Effort:** 2-3 hours for core fixes + testing
