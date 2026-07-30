# TODO — Vercel Serverless Deployment

## New Files
- [x] Create `api/index.py` — ASGI entry point
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
