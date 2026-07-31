# Vercel Serverless Deployment Plan — AI Backend

## Problem

When clicking the chatbot on `saif-portfolio-sand.vercel.app`, Chrome shows:
> *"saif-portfolio-sand.vercel.app wants to access other apps and services on this device"*

This happens because `NEXT_PUBLIC_AI_API_URL=http://localhost:8001` makes the Vercel-hosted frontend (HTTPS) try to fetch `http://localhost:8001` — a Private Network Access request. Chrome blocks it with the "access other apps" permission dialog.

## Solution

Restructure the Python (`ai/`) backend as **Vercel Python Serverless Functions** so the chatbot API lives on the **same domain** as the frontend → no cross-origin / localhost requests → no permission dialog.

### Key Changes

1. **Replace ChromaDB** with a lightweight **in-memory vector store**. The knowledge base is tiny (8 files, 180 lines, ~40 chunks). ChromaDB has native C extensions that may not compile on Vercel's Python runtime and requires filesystem writes. Our in-memory store uses pure Python + Gemini embeddings + cosine similarity.

2. **Create `api/[[...path]].py`** — ASGI catch-all entry point that Vercel auto-detects as a FastAPI serverless function for every `/api/*` path. It strips the `/api` prefix (added by the `vercel.json` rewrites) so FastAPI routes resolve.

3. **Create `vercel.json`** — Rewrites `/chat`, `/health`, `/ingest` to the Python function.

4. **Create root-level `requirements.txt`** — Vercel uses this for Python dependencies. Lightweight: only `fastapi`, `google-genai`, `python-dotenv`.

5. **Update `NEXT_PUBLIC_AI_API_URL`** to `""` (empty string) — fetch calls use relative paths → same origin.

## Files to Create

| File | Purpose |
|------|---------|
| `api/[[...path]].py` | ASGI catch-all — adds `ai/` to `sys.path`, exposes FastAPI `app`, strips `/api` prefix |
| `vercel.json` | Rewrites: `/chat`, `/health`, `/ingest` → Python function |
| `requirements.txt` | `fastapi`, `google-genai`, `python-dotenv` |

## Files to Modify

| File | Change |
|------|--------|
| `ai/app/ingest.py` | Replace ChromaDB with in-memory store (`_vector_store` global) |
| `ai/app/retriever.py` | Query in-memory store with cosine similarity instead of ChromaDB |
| `ai/app/config.py` | Remove `CHROMA_DB_PATH` |
| `ai/pyproject.toml` | Remove `chromadb` dependency |
| `src/components/Chatbot.tsx` | Default `API_URL` → `""` (relative paths) |

## Vercel Environment Variables

| Variable | Required | Value |
|----------|----------|-------|
| `GEMINI_API_KEY` | Yes | Your Google Gemini API key |
| `NEXT_PUBLIC_AI_API_URL` | Yes | `""` (empty string) |
| `GEMINI_MODEL` | No | Default: `gemini-2.5-flash` |
| `EMBEDDING_MODEL` | No | Default: `gemini-embedding-001` |

## Request Flow (After)

```
Browser (saif-portfolio-sand.vercel.app)
  → fetch("/chat")              ← same-origin, no permission dialog
  → Vercel rewrite to /api
  → api/[[...path]].py (FastAPI)
  → In-memory vector store
  → Gemini API
  → Response
```

## Cold Start

On first request after deployment/idle:
- `index_knowledge_base()` runs lazily in `retrieve_context()`
- Reads 8 markdown files → chunks → Gemini embeddings (~2-4 seconds)
- Subsequent requests use warm in-memory store

---

# Security Remediation Plan (2026-07-31)

Audit result: full security review surfaced 1 hardcoded secret, 4 high-severity, and 6 medium-severity issues.

## Resolved

- **REVOKED** — live Google Gemini key found in `ai/.env.local` (new `AQ.Ab...` 2026 format, gitignored & never committed). Key was rotated in Google AI Studio by owner. File should be deleted and `ai/.env` created from `.env.example`.

## Fixes

### 1. XSS in `renderMarkdown` (HIGH)
- **File:** `src/components/Chatbot.tsx:39-71`
- **Problem:** only `& < >` escaped; link URLs inserted verbatim into `href` → attribute breakout (`[x](https://a.com" onclick="...)`). Rendered via `dangerouslySetInnerHTML`, persisted in localStorage.
- **Fix:** escape `& < > " ' \``; `safeUrl()` strips attribute-breaking chars and allows http/https only. **Verified: 0/11 adversarial payloads produced executable HTML.**

### 2. Prompt injection + bypassable guardrails (HIGH)
- **Files:** `ai/app/rag.py:62`, `ai/app/guardrails.py`
- **Problem:** user input concatenated verbatim into prompt; on-topic keyword short-circuited all off-topic checks.
- **Fix:** off-topic + injection-pattern checks run first (no on-topic bailout); history user messages are also checked; anti-injection system instruction added. **Verified: test suite passes.**

### 3. No auth / rate limit on paid endpoints (HIGH)
- **Files:** `ai/main.py:45-60`
- **Problem:** `/chat` (2 paid Gemini calls) and `/ingest` open, unbounded → quota/cost abuse, DoS.
- **Fix:** optional bearer token (`API_TOKEN`); per-IP sliding-window limiter on `/chat` AND `/ingest`; request-size limits on `ChatRequest`. **Verified: 401/422/429 behavior live.**
- **Caveat:** `API_TOKEN` must stay unset on the public Vercel chatbot — the browser sends no Authorization header. It protects non-browser/direct-exposed deployments.

### 4. CORS misconfiguration (HIGH)
- **File:** `ai/main.py`
- **Problem:** `allow_origins=["*"]` + `allow_credentials=True`.
- **Fix:** allowlist from `CORS_ORIGINS`, never paired with `*`; empty by default. **Verified: only allowlisted origins get ACAO; `*`+credentials impossible.**

### 5. Outdated Next.js (HIGH)
- **File:** `package.json`
- **Fix:** `next` 16.2.6 → 16.2.11; overrides pin `postcss@8.5.25`, `sharp@0.35.3`, plus dev-only `@babel/core`/`js-yaml`/`brace-expansion`. `npm audit`: 1 remaining finding, dev-only (`brace-expansion@1.x` under deprecated `minimatch@3`, no patched 1.x exists — build-time only, not shipped).

### 6. CSP (MEDIUM) — corrected after review
- **File:** `next.config.ts`
- **Approach:** documented "Without Nonces" CSP (`script-src 'self' 'unsafe-inline'`). A strict hash/nonce-only `script-src` **breaks hydration**: Next.js streams inline `self.__next_f` flight scripts that can't be hashed in static mode. Nonce-based CSP requires dynamic rendering (loses static/CDN caching) — not worth it for this portfolio. XSS defense rests on the verified sanitizer (fix 1); CSP still guards non-script vectors (object-src, frame-ancestors, base-uri, form-action, img/font/connect sources).

### 7. Vercel routing (MEDIUM) — corrected after review
- **Files:** `api/[[...path]].py`, `vercel.json`
- **Fix:** rewrites `/chat|/health|/ingest → /api/<route>`; `api/[[...path]].py` catch-all dispatches every `/api/*` path (Vercel file-based routing maps `api/index.py` only to `/api`), with a middleware stripping the `/api` prefix. Handles both rewritten and original paths.

### 8. Ops/config (MEDIUM)
- `docker-compose.yml`: paths fixed, browser URL `localhost:8001`, `CORS_ORIGINS=http://localhost:3000`, optional `env_file`, healthcheck.
- `requirements.txt`/`pyproject.toml`: pinned, `uvicorn` added.
- `ai/Dockerfile`: non-root user + healthcheck.
- Logging added; indexing failure logs + 503 instead of silent swallow.
- `TRUST_PROXY_HEADERS` controls X-Forwarded-For trust (spoofable when directly exposed).
- `/docs` + `/openapi.json` disabled by default (`DOCS_ENABLED`).

## Verification
- `npm run lint`, `tsc`, `npm audit`
- Boot `ai/` server and hit `/health`, `/chat` (with/without token), `/ingest`
- Confirm CORS headers and rate-limit behavior
- Independent audit + functional verification subagents: all fixes PASS
- `vercel dev` / test deployment still required to confirm `/api/*` catch-all dispatch (Vercel file routing)
