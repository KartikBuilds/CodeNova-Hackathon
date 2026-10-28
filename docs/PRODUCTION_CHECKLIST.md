# Production Checklist

Work through this list before pointing real users at a deployment.

## Secrets

- [ ] The Groq API key is rotated and set only in the host's environment variables, never in a tracked file.
- [ ] `JWT_SECRET` is a random value of at least 32 characters. The server refuses to start if it is missing or set to the old default.
- [ ] `MONGO_URI` points to a database user with only the access the app needs.
- [ ] `git grep -E "gsk_|mongodb\+srv://[^<]*:[^@]*@"` finds no real credentials in tracked files.

## Configuration

- [ ] `NODE_ENV=production`
- [ ] `AI_MOCK_MODE` is `false` or unset.
- [ ] `ALLOWED_ORIGINS` lists only your real frontend origin(s). It defaults to localhost, which is wrong for production.
- [ ] A spend limit is set for the Groq project in the Groq console.

## Verification

- [ ] `GET /api/health` returns `{"status":"ok"}`.
- [ ] A request from an origin not in `ALLOWED_ORIGINS` gets no `Access-Control-Allow-Origin` header.
- [ ] The rate limiter returns 429 after the thresholds (10 AI requests and 5 failed logins per 15 minutes per IP).
- [ ] An unauthenticated request to `/api/learning/path` returns 401.
- [ ] Error responses in production contain no stack traces.
- [ ] `server/src/scripts/seedData.js` refuses to run with `NODE_ENV=production`. Never seed a production database.

## Transport

- [ ] The site is served over HTTPS (Railway provides this).
- [ ] HSTS is enabled by helmet's default. Add `preload` only after you have confirmed HTTPS works for the whole domain, since removing preload is slow.

## Known gaps before launch

- No automated test suite. Verify changes manually before deploying.
- Tokens last 30 days and are stored in `localStorage`.
- Quiz scores are calculated from answers the client sends back.
