# TODO — Vercel Serverless Deployment

## New Files
- [x] Create `api/[[...path]].py` — ASGI entry point (catch-all for `/api/*`)
- [x] Create `vercel.json` — route config
- [x] Create `requirements.txt` (root) — Python deps

## Modified Files
- [x] `ai/app/ingest.py` — Replace ChromaDB with in-memory vector store
- [x] `ai/app/retriever.py` — Use in-memory store with cosine similarity
- [x] `ai/app/config.py` — Remove `CHROMA_DB_PATH`
- [x] `ai/pyproject.toml` — Remove `chromadb` dependency
- [x] `src/components/Chatbot.tsx` — Change `API_URL` default to `""` (already uses `|| ''` fallback)

## Vercel Dashboard (post-deploy)
- [ ] Set `GEMINI_API_KEY`
- [ ] Set `NEXT_PUBLIC_AI_API_URL` = `""`
- [ ] Do NOT set `API_TOKEN` (browser chat sends no auth header); set `TRUST_PROXY_HEADERS=true`

## Security Remediation (2026-07-31)
- [x] Revoke leaked key (was in `ai/.env.local`, deleted)
- [x] Harden `renderMarkdown` against XSS + add CSP header
- [x] Add bearer-token auth, per-IP rate limiting, tightened CORS
- [x] Fix bypassable off-topic/injection guardrails
- [x] Upgrade `next` 16.2.6 → 16.2.11; override vulnerable `postcss`/`sharp`
- [x] Fix `docker-compose.yml` paths + browser URL + CORS; pin deps; non-root Dockerfile
- [x] Vercel `/api/*` catch-all routing (`api/[[...path]].py`) + prefix-strip middleware
- [x] CSP corrected to documented "Without Nonces" pattern (hash-only broke hydration)
- [x] Documentation sync (docs vs code) reconciled; stale references removed
