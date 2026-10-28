# CodeNova: AI-Powered Learning Assistant

CodeNova helps learners study with AI: an AI tutor, generated quizzes, flashcards, learning paths and plans, progress dashboards, and Q&A over pasted or uploaded text.

**Status:** Security-hardened beta. The main flows work, but the project has no automated tests and some features are limited. See [Known limitations](#known-limitations).

## Features

- **AI tutor:** chat about any topic, with optional voice input in Chrome or Edge. Conversations are not saved.
- **Quizzes:** AI-generated multiple-choice quizzes, with scoring and history for signed-in users.
- **Flashcards:** generate cards from pasted notes and save them as decks.
- **Document Q&A:** ask questions about a `.txt` or `.md` document.
- **Learning paths and plans:** structured study plans based on your profile and quiz results.
- **Dashboard:** progress summaries for signed-in users.

## Stack

- **Frontend:** React 19, Vite, React Router, Recharts, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB (Mongoose), LangChain with Groq

## Quick start

Requirements: Node.js 18 or newer, npm 9 or newer, and a MongoDB instance (local or Atlas).

```bash
# 1. Install dependencies for all workspaces
npm install

# 2. Configure the server
cp server/.env.example server/.env
# Edit server/.env: set MONGO_URI, JWT_SECRET and GROQ_API_KEY
# (or set AI_MOCK_MODE=true to run without a Groq key)

# 3. Start the backend (port 5000) and frontend (port 5173)
npm run dev
```

The frontend talks to `http://localhost:5000/api` in development and to `/api` on the same origin in production, so it needs no environment file.

To load sample catalog data into a development database:

```bash
npm run seed
```

The seed script deletes existing catalog data first and refuses to run when `NODE_ENV=production`.

### Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start backend and frontend together |
| `npm run dev:server` / `npm run dev:client` | Start one of them |
| `npm run build` | Build the frontend |
| `npm start` | Start the backend in production mode |
| `npm run lint` | Lint the frontend |
| `npm run seed` | Load sample catalog data (development only) |

## Configuration

Backend variables live in `server/.env`. See `server/.env.example` for the full list.

| Variable | Required | Notes |
|---|---|---|
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Server exits on startup if it is missing or set to the old default |
| `GROQ_API_KEY` | For AI features | Without it, AI endpoints return 503 in production |
| `AI_MOCK_MODE` | No | `true` returns clearly labelled mock responses in development only |
| `ALLOWED_ORIGINS` | No | Comma-separated frontend origins. Defaults to localhost. Set it in production |
| `JWT_EXPIRE` | No | Token lifetime, default `30d` |
| `NODE_ENV` | No | Set to `production` when deployed |

Never commit real values. Keep them in `server/.env` locally and in your host's environment settings in production.

## API overview

All routes are under `/api`. Full request shapes are in the route files under `server/src/routes/`.

| Area | Access |
|---|---|
| Health (`/health`), catalog (`/catalog/*`), tutor chat, quiz generation, document Q&A | Public |
| Auth (`/auth/register`, `/auth/login`) | Public, rate limited |
| Profile, learning paths and plans, flashcard decks, quiz history, dashboard | Signed-in users, scoped to their own data |

AI endpoints are rate limited to 10 requests per 15 minutes per IP. Failed logins are limited to 5 per 15 minutes per IP.

## Security

- Passwords are hashed with bcrypt. Login and registration use email validation and a minimum password length of 6.
- Authenticated routes verify a JWT and check that the record belongs to the caller.
- The server refuses to start without a strong `JWT_SECRET`.
- CORS allows only the origins in `ALLOWED_ORIGINS`.
- Helmet sets standard security headers, including a Content Security Policy and HSTS.
- Production errors return no stack traces.
- Groq credentials are used only by the server. The browser never receives an AI key.

Limitations: tokens last 30 days and are stored in `localStorage`, so a cross-site scripting bug could expose them. There is no refresh-token flow. Set a spend limit on your Groq project, because public AI endpoints cost money to run.

## Known limitations

- **PDF upload is not supported.** Use `.txt` or `.md`, or paste the text.
- **Document Q&A reads only the first 8,000 characters** of a document. It is not retrieval-augmented search.
- **Tutor history and feedback are not stored.** The history endpoint is a placeholder.
- **Voice input** uses the browser's Web Speech API and works only in Chrome and Edge.
- **No automated tests.** Changes are verified manually.
- **Quiz scores** are calculated from answers the client sends back.

## Deployment

The app runs as a single Express process that also serves the built frontend, so it deploys as one service. `railway.toml` configures Railway, and the root `Dockerfile` and `docker-compose.yml` cover Docker. Set the variables in the Configuration table above in your host's environment, and set `ALLOWED_ORIGINS` to your public domain.

## License

MIT. See [LICENSE](LICENSE).
