# Vercel Serverless Deployment Plan — AI Backend

## Problem

When clicking the chatbot on `saif-portfolio-sand.vercel.app`, Chrome shows:
> *"saif-portfolio-sand.vercel.app wants to access other apps and services on this device"*

This happens because `NEXT_PUBLIC_AI_API_URL=http://localhost:8001` makes the Vercel-hosted frontend (HTTPS) try to fetch `http://localhost:8001` — a Private Network Access request. Chrome blocks it with the "access other apps" permission dialog.

## Solution

Restructure the Python (`ai/`) backend as **Vercel Python Serverless Functions** so the chatbot API lives on the **same domain** as the frontend → no cross-origin / localhost requests → no permission dialog.

### Key Changes

1. **Replace ChromaDB** with a lightweight **in-memory vector store**. The knowledge base is tiny (8 files, 180 lines, ~40 chunks). ChromaDB has native C extensions that may not compile on Vercel's Python runtime and requires filesystem writes. Our in-memory store uses pure Python + Gemini embeddings + cosine similarity.

2. **Create `api/index.py`** — ASGI entry point that Vercel auto-detects as a FastAPI serverless function.

3. **Create `vercel.json`** — Rewrites `/chat`, `/health`, `/ingest` to the Python function.

4. **Create root-level `requirements.txt`** — Vercel uses this for Python dependencies. Lightweight: only `fastapi`, `google-genai`, `python-dotenv`.

5. **Update `NEXT_PUBLIC_AI_API_URL`** to `""` (empty string) — fetch calls use relative paths → same origin.

## Files to Create

| File | Purpose |
|------|---------|
| `api/index.py` | ASGI handler — adds `ai/` to `sys.path`, exposes FastAPI `app` |
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
  → api/index.py (FastAPI)
  → In-memory vector store
  → Gemini API
  → Response
```

## Cold Start

On first request after deployment/idle:
- `index_knowledge_base()` runs lazily in `retrieve_context()`
- Reads 8 markdown files → chunks → Gemini embeddings (~2-4 seconds)
- Subsequent requests use warm in-memory store
