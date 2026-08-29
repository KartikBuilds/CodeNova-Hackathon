# CodeNova - AI-Powered Learning Assistant

A production-ready web application that uses AI to create personalized learning experiences. CodeNova provides intelligent tutoring, adaptive quizzes, flashcard generation, and document analysis to help learners master new topics effectively.

## Key Features

- **AI Tutor Chat**: 24/7 conversational AI assistant for learning support
- **Adaptive Quizzes**: AI-generated quizzes that adapt to learner performance
- **Flashcard Generation**: Automatically generate flashcards from any content
- **Document Analysis**: Ask questions about uploaded documents (RAG)
- **Learning Paths**: Personalized learning roadmaps based on goals
- **Progress Analytics**: Track learning progress and identify knowledge gaps
- **Voice Support**: Voice input/output for accessible learning

## Technology Stack

**Frontend:**
- React 19.2.0
- Vite (build tool)
- TailwindCSS (styling)
- React Router v7 (routing)
- Recharts (analytics)

**Backend:**
- Node.js + Express
- MongoDB (database)
- LangChain (AI orchestration)
- Groq LLM (AI inference)

**Deployment:**
- Docker (containerization)
- Railway (recommended deployment platform)
- MongoDB Atlas (cloud database)

## Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- MongoDB instance (Atlas or self-hosted)
- Groq API key (free from https://console.groq.com)

### Setup

1. **Clone and install:**
   ```bash
   git clone <repository>
   cd CodeNova-Hackathon
   npm install
   ```

2. **Configure environment:**
   ```bash
   # Create .env from .env.example
   cp .env.example .env

   # Edit .env with your values:
   # - MONGO_URI=<your-mongodb-connection>
   # - GROQ_API_KEY=<your-groq-api-key>
   # - JWT_SECRET=<random-string>
   # - SESSION_SECRET=<random-string>
   ```

3. **Configure frontend:**
   ```bash
   cd apps/client/frontend
   cp .env.example .env.local

   # Set VITE_API_URL to your backend URL
   # (default: http://localhost:5000 for local development)
   ```

4. **Start development:**
   ```bash
   # From root directory
   npm run dev

   # This starts both backend (port 5000) and frontend (port 5173)
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## Environment Variables

### Backend (.env)

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | Yes | `production` or `development` |
| `PORT` | No | Server port (default: 5000) |
| `MONGO_URI` | Yes | MongoDB connection string |
| `GROQ_API_KEY` | Yes* | Groq API key for AI features |
| `JWT_SECRET` | Yes | Secret for JWT signing |
| `SESSION_SECRET` | Yes | Secret for session management |
| `CORS_ORIGIN` | No | Frontend domain for CORS |
| `ALLOWED_ORIGINS` | No | Multiple allowed origins (comma-separated) |
| `AI_MOCK_MODE` | No | Set to `true` for dev/test only to enable mock responses |

*Groq API key is required for AI features. In production mode without it, AI endpoints return 503 Service Unavailable.

### Frontend (.env.local)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes | Backend API base URL (e.g., `http://localhost:5000`) |
| `VITE_APP_NAME` | No | Application name for UI |
| `VITE_ENVIRONMENT` | No | `development` or `production` |

## API Endpoints

### Core AI Endpoints

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/api/tutor/chat` | Chat with AI tutor | Optional |
| POST | `/api/learning/flashcards/generate` | Generate flashcards | Optional |
| POST | `/api/analysis/document` | Document Q&A (RAG) | Optional |
| POST | `/api/quiz/generate` | Generate quiz questions | Optional |

### Other Endpoints

See full API documentation in deployment guide.

## Deployment

### Recommended: Railway + MongoDB Atlas

1. **Create Railway project:**
   ```bash
   npm install -g @railway/cli
   railway login
   railway init
   ```

2. **Add MongoDB Atlas:**
   - Visit https://mongodb.com/cloud/atlas
   - Create free cluster
   - Get connection string

3. **Set environment variables in Railway:**
   - `MONGO_URI` - MongoDB connection
   - `GROQ_API_KEY` - Groq API key
   - `JWT_SECRET` - Random 32+ character string
   - `SESSION_SECRET` - Random 32+ character string
   - `CORS_ORIGIN` - Your frontend domain
   - `NODE_ENV` - Set to `production`
   - `AI_MOCK_MODE` - Leave as `false` (default)

4. **Deploy:**
   ```bash
   railway up
   ```

### Docker Deployment

```bash
# Build image
docker build -t codenova:latest .

# Run container
docker run -p 5000:5000 \
  -e MONGO_URI=<uri> \
  -e GROQ_API_KEY=<key> \
  -e JWT_SECRET=<secret> \
  -e SESSION_SECRET=<secret> \
  -e NODE_ENV=production \
  codenova:latest
```

## Security

**Important:** This application requires API credentials to function:
- **Groq API Key** - Stored securely server-side only
- **MongoDB URI** - Stored securely server-side only
- **JWT Secret** - Never exposed to client

**All credentials must be:**
- Set as environment variables (never hardcoded)
- Stored securely in deployment platform
- Rotated regularly in production

**Frontend does NOT have access to:**
- API keys
- Database credentials
- Authentication secrets

All AI requests go through the backend, which maintains secure credential isolation.

**Production Safety:**
- When AI credentials are missing and `AI_MOCK_MODE=false` (default in production), all AI endpoints return 503 Service Unavailable
- Mock responses are only returned in development mode with `AI_MOCK_MODE=true`
- All mock responses include `source="mock-fallback"` indicator for transparency

## Troubleshooting

### "Failed to connect to MongoDB"
- Verify `MONGO_URI` is correct
- Check MongoDB connection whitelist includes your IP
- Ensure MongoDB instance is running

### "Groq API key not configured"
- In production: AI endpoints return 503 Service Unavailable (expected behavior)
- In development: either set `GROQ_API_KEY` or set `AI_MOCK_MODE=true` for mock responses
- Verify key is valid at https://console.groq.com

### "CORS error on frontend API calls"
- Verify `CORS_ORIGIN` or `ALLOWED_ORIGINS` in backend .env
- Ensure frontend domain matches backend CORS config
- Check `VITE_API_URL` in frontend .env

### "Frontend build fails"
- Clear cache: `npm run clean`
- Reinstall: `npm install`
- Check Node version: `node -v` (requires 18+)

## Development

### Project Structure

```
CodeNova-Hackathon/
├── apps/client/frontend/          # React frontend
│   ├── src/
│   │   ├── pages/                # Page components
│   │   ├── components/           # Reusable components
│   │   └── api/                  # API client helpers
│   └── dist/                     # Built output
├── server/                        # Express backend
│   ├── src/
│   │   ├── routes/               # API routes
│   │   ├── controllers/          # Route handlers
│   │   ├── services/             # Business logic
│   │   └── models/               # Database schemas
│   └── src/server.js             # Entry point
├── docs/                          # Documentation
├── .env.example                   # Environment template
├── package.json                   # Monorepo config
└── Dockerfile                     # Production build

```

### Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:server       # Start backend only
npm run dev:client       # Start frontend only

# Production
npm run build            # Build for production
npm start                # Start backend in production mode

# Validation
npm run lint             # Run ESLint on frontend
npm test                 # Run tests (if available)

# Cleanup
npm run clean            # Remove build artifacts and node_modules
```

## Contributing

CodeNova is deployed to production. For changes:

1. Create a feature branch
2. Implement changes with tests
3. Ensure builds pass: `npm run build`
4. Submit pull request for review
5. Deployment follows code review approval

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
1. Check the [Deployment Guide](docs/COMPLETION_REPORT.md)
2. Review the [Baseline Audit](docs/BASELINE_AUDIT.md)
3. Check logs: `railway logs` (if on Railway)
4. Create an issue in the repository

---

**Status:** Production Ready ✅
**Last Updated:** 2026-08-29
**Deployment Platform:** Railway + MongoDB Atlas
**Support Level:** Community (MIT Licensed)
