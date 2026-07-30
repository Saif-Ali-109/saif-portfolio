# Portfolio

Developer portfolio for Saif Ali Wajid, built with Next.js 16 and a RAG-powered Python AI chatbot assistant. Features a bright rose-accented theme with dark mode toggle.

## Stack

- Next.js 16 + React 19
- TypeScript + Tailwind CSS 4 (with `@custom-variant dark`)
- Framer Motion
- Python FastAPI (RAG chatbot backend with ChromaDB + Google Gemini)

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
The chatbot talks directly to the Python backend at `http://localhost:8001` (configure via `NEXT_PUBLIC_AI_API_URL` in `.env.local`).

### Python Backend (`ai/.env`)
- `GEMINI_API_KEY` — required for AI responses and embeddings
- `GEMINI_MODEL` — optional, defaults to `gemini-2.5-flash`
- `EMBEDDING_MODEL` — optional, defaults to `gemini-embedding-001`

## Commands Reference

- `npm run dev` — start the Next.js dev server
- `npm run build` — production frontend build
- `npm run start` — run the production server
- `npm run lint` — lint the frontend

## Production Notes

- The Python backend must be deployed separately (Railway, Render, or a VPS)
- Update `Chatbot.tsx` with the production backend URL before deploying
- See `documentation.md` for the full Connext technical documentation
