# Portfolio

Developer portfolio for Saif Ali Wajid, built with Next.js 16 and a RAG-powered Python AI chatbot assistant. Features a bright rose-accented theme with dark mode toggle.

## Stack

- Next.js 16 + React 19
- TypeScript + Tailwind CSS 4 (with `@custom-variant dark`)
- Framer Motion
- Python FastAPI (RAG chatbot backend with in-memory vector store + Google Gemini)

## Featured Project: Connext

A modern, real-time one-to-one messaging application with flexible authentication (username/password, email/password, Google OAuth 2.0), user discovery, shareable invite links (7-day expiry), live message receipts (Sent/Delivered/Read), browser notifications via Firebase Cloud Messaging, and a polished dark mode UI.

- **Live:** https://connext-frontend-production.up.railway.app/
- **GitHub:** https://github.com/Saif-Ali-109/Connext

### Key Features

- **Flexible Authentication:** Sign up with username/password, email/password, or Google OAuth 2.0
- **Email Verification:** 6-digit SMTP codes via Brevo API with rate limiting (10 codes/email/10 min)
- **User Discovery & Requests:** Search by username or email, send connection requests, approve pairs
- **Shareable Invites:** Generate 7-day reusable invite links for quick onboarding
- **Real-Time WebSocket Messaging:** Instant 1-on-1 chat via Socket.IO with automatic fallback
- **Live Message Receipts:** Sent (`✓`), Delivered (`✓✓`), and Read (`✓✓` blue) statuses in real time
- **Browser Notifications:** FCM push notifications when messages arrive
- **Media Sharing:** Image/file uploads via Cloudflare R2 with presigned URLs (25MB limit)
- **E2EE Ready:** Schema supports encrypted content alongside plaintext messages

### Project Architecture

| Workspace | Description | Stack |
| --- | --- | --- |
| `apps/web` | Frontend + NextAuth UI | Next.js 15, React 19, Tailwind CSS 4, Socket.IO Client |
| `apps/server` | REST API + Socket.IO Server | Express 4, Socket.IO 4, JWT, Helmet, Cloudflare R2 |
| `packages/db` | Database Schema & Client | PostgreSQL, Drizzle ORM, scrypt password hashing |

Authentication uses a **two-layer session architecture**: NextAuth handles login (credentials, Google, email code) and issues a JWT session. A bridge mechanism (HMAC-SHA256, 60s TTL) passes the session to Express, which issues its own httpOnly JWT cookie for REST and Socket.IO access.

### Getting Started

```bash
git clone https://github.com/Saif-Ali-109/Connext.git
cd Connext
npm install
# Configure apps/web/.env.local and apps/server/.env (see docs)
npm run db:push
npm run dev
```

- Web App: `http://localhost:3000`
- API Server: `http://localhost:4001`

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Builds DB package, runs web + server concurrently |
| `npm run build` | Builds all workspaces for production |
| `npm run db:push` | Applies Drizzle schema to PostgreSQL |
| `npm run db:migrate` | Runs Drizzle migrations |
| `npm run lint` | ESLint across workspaces |
| `npm run test` | All workspace tests |

---

## Repository Layout

- `src/app/` — App Router entry, layout, global styles
- `src/components/` — Portfolio sections + chat widget
- `public/` — Static assets
- `ai/` — Python FastAPI RAG backend
- `ai/knowledge/` — Knowledge base markdown files

## Local Setup

### Frontend

```bash
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`.

### Python AI Backend

```bash
cd ai
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# or: uv sync
```

Set `GEMINI_API_KEY` in `ai/.env`, then:

```bash
cd ai
python scripts/index.py
uvicorn main:app --reload --port 8001
```

### Chat Assistant

The chatbot at the bottom-right communicates with the Python backend at `http://localhost:8001/chat`.

## Environment Variables

### Frontend
The chatbot talks directly to the Python backend at `http://localhost:8001` (configure via `NEXT_PUBLIC_AI_API_URL` in `.env.local`). For the Vercel serverless deployment, leave `NEXT_PUBLIC_AI_API_URL` empty (the chat calls `/chat` on the same origin) — see [Production Notes](#production-notes).

### Python Backend (`ai/.env`)
See the [Environment Variables (Backend)](#environment-variables-backend) table in Production Notes. Key security variables: set `TRUST_PROXY_HEADERS=true` and leave `API_TOKEN` and `CORS_ORIGINS` empty for the public Vercel chatbot (the browser widget sends no `Authorization` header). For local Docker use, set `CORS_ORIGINS=http://localhost:3000`.

## Commands Reference

- `npm run dev` — start the Next.js dev server
- `npm run build` — production frontend build
- `npm run start` — run the production server
- `npm run lint` — lint the frontend

## Production Notes

- **Local (Docker):** `docker-compose.yml` runs the AI backend on `8001` and the Next.js frontend on `3000`. It sets `NEXT_PUBLIC_AI_API_URL=http://localhost:8001` (line `docker-compose.yml`).
- **Vercel (serverless):** the AI backend runs as a Vercel Python serverless function via `api/[[...path]].py`, which `vercel.json` routes from `/chat`, `/health`, `/ingest`. Because the function is deployed on the same domain as the frontend, `Chatbot.tsx` already defaults `NEXT_PUBLIC_AI_API_URL` to `""` (same-origin) — no manual file edit before deploying. Set `NEXT_PUBLIC_AI_API_URL=` (empty) on Vercel.
- Security: do **not** set `API_TOKEN` for the public Vercel chatbot (the browser widget sends no `Authorization` header and the chat would break). Set `TRUST_PROXY_HEADERS=true`; leave `CORS_ORIGINS` empty (same-origin). For local Docker, set `CORS_ORIGINS=http://localhost:3000`.

## Environment Variables (Backend)

| Variable | Required | Default | Notes |
|---|---|---|---|
| `GEMINI_API_KEY` | Yes | — | Google Gemini API key (responses + embeddings) |
| `GEMINI_MODEL` | No | `gemini-2.5-flash` | Primary response model |
| `FALLBACK_MODELS` | No | `gemini-2.0-flash,gemini-1.5-flash` | Tried in order on 429/503 |
| `EMBEDDING_MODEL` | No | `gemini-embedding-001` | Embedding model |
| `KNOWLEDGE_DIR` | No | `./knowledge` (under `ai/`) | Knowledge base directory |
| `CHUNK_SIZE` | No | `500` | RAG chunk size (chars) |
| `CHUNK_OVERLAP` | No | `50` | RAG chunk overlap (chars) |
| `TOP_K_RESULTS` | No | `3` | Retrieve top-K contexts |
| `MAX_HISTORY` | No | `8` | Conversation turns kept per session |
| `HOST` / `PORT` | No | `0.0.0.0` / `8001` | Local server bind (uvicorn) |
| `API_TOKEN` | No | *(empty)* | Bearer auth for `/chat` + `/ingest`. **Do not set for the public Vercel chatbot.** |
| `CORS_ORIGINS` | No | *(empty)* | Comma-separated allowlist (e.g. `http://localhost:3000`); same-origin Vercel = leave empty |
| `RATE_LIMIT_PER_MINUTE` | No | `20` | Per-client-IP request limit (sliding window) |
| `TRUST_PROXY_HEADERS` | No | `true` | Trust `X-Forwarded-For` (TRUE on Vercel/nginx; FALSE if directly exposed — else spoofable) |
| `DOCS_ENABLED` | No | `false` | Enables `/docs` OpenAPI UI |
| `AI_TEMPERATURE` | No | `0.7` | Generation temperature |
| `AI_MAX_OUTPUT_TOKENS` | No | `250` | Max output tokens |
