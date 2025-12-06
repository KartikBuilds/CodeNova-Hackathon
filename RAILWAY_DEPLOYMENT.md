# Railway Deployment Guide

## Prerequisites
- Railway CLI installed: `npm i -g @railway/cli`
- Git repository connected to Railway
- MongoDB Atlas (or Railway PostgreSQL) for database

## Environment Variables Required

Add these to Railway project settings:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret-key>
VITE_API_URL=https://<your-railway-app>.up.railway.app/api
```

## Deployment Steps

1. **Login to Railway**
   ```bash
   railway login
   ```

2. **Link to Railway project**
   ```bash
   railway link
   ```

3. **Deploy**
   ```bash
   railway up
   ```

4. **Monitor logs**
   ```bash
   railway logs
   ```

## How It Works

- Railway uses `railway.toml` to configure the build and deployment
- The root `Dockerfile` builds the entire monorepo as a multi-stage build
- Only the server (Node.js API) is deployed; the React client is built as static assets
- Environment variables are injected at runtime

## Troubleshooting

### Build fails with "No workspaces found"
- Ensure `package.json` has correct workspace paths: `apps/client/frontend` and `apps/server`
- Run locally: `npm install` (should install both workspaces)

### Port already in use
- Railway automatically assigns an available port
- Check `process.env.PORT` in your server code

### MongoDB connection fails
- Verify `MONGODB_URI` is set correctly in Railway
- Ensure IP whitelist includes Railway's IP range (if using Atlas)

### Static client files not found
- Built client files are in `apps/client/frontend/dist`
- Server must serve these files if using API backend for SPA

## Rollback
```bash
railway rollback
```

## Local Testing Before Deploy

```bash
# Build and run locally like Railway does
npm install
npm run build
npm start
```
