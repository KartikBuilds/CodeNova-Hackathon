# Deploying CodeNova to Railway

## Prerequisites

1. Railway account (railway.app)
2. GitHub repo connected
3. Groq API key (console.groq.com)
4. MongoDB Atlas cluster (mongodb.com)

## Steps

1. **Connect GitHub repo on Railway**
   - New Project → GitHub repo → Select CodeNova-Hackathon

2. **Set environment variables**
   - NODE_ENV = production
   - GROQ_API_KEY = [your-groq-key]
   - MONGO_URI = [your-mongodb-connection-string]
   - JWT_SECRET = [strong-random-secret]
   - ALLOWED_ORIGINS = https://[your-railway-domain].railway.app

3. **Deploy**
   - Railway auto-detects Node.js project
   - Runs `npm install && npm run build`
   - Starts `npm start`

4. **Verify**
   ```bash
   curl https://[your-domain]/api/health
   # Should return: { "status": "ok" }
   ```

## After Deployment

1. Test login/register flows
2. Test AI features (tutor chat, flashcards)
3. Monitor logs for errors: Railway dashboard → Logs
4. Set Groq spend limit in console.groq.com

## Troubleshooting

- **MongoDB connection fails:** Check MONGO_URI, whitelist Railway IP in Atlas
- **Groq key not working:** Verify key in console.groq.com, regenerate if needed
- **CORS errors:** Check ALLOWED_ORIGINS matches your domain
- **Build fails:** Check Node version (18+), npm ci doesn't need lock file edits

See `docs/PRODUCTION_CHECKLIST.md` for post-deployment setup.
