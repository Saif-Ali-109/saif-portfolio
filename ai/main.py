import logging
import os

from fastapi import Depends, FastAPI, Header, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware

from app.config import (
    API_TOKEN,
    CORS_ORIGINS,
    DOCS_ENABLED,
    RATE_LIMIT_PER_MINUTE,
    TRUST_PROXY_HEADERS,
)
from app.models import ChatRequest, ChatResponse, HealthResponse, IngestResponse
from app.rag import generate_response
from app.ingest import index_knowledge_base
from app.ratelimit import SlidingWindowLimiter

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("saif-ai")

HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8001"))

app = FastAPI(
    title="Saif AI",
    description="RAG-powered AI assistant for Saif Ali Wajid's portfolio.",
    version="1.0.0",
    docs_url="/docs" if DOCS_ENABLED else None,
    redoc_url="/redoc" if DOCS_ENABLED else None,
    openapi_url="/openapi.json" if DOCS_ENABLED else None,
)

# Index lazily — fail loudly (with a log) instead of silently serving an
# empty knowledge base on every cold start.
_initialized = False


def ensure_indexed():
    global _initialized
    if _initialized:
        return
    try:
        result = index_knowledge_base()
        _initialized = True
        logger.info("Knowledge base indexed: %s", result)
    except Exception:
        logger.exception("Knowledge base indexing failed")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Knowledge base not ready. Try again shortly.",
        )


def _cors_origins() -> list[str]:
    if not CORS_ORIGINS:
        return []
    if "*" in CORS_ORIGINS:
        return ["*"]
    return CORS_ORIGINS


def _cors_allow_credentials() -> bool:
    # Browsers forbid "*" together with credentials; refusing to pair them
    # prevents any website from making credentialed drive-by requests.
    return bool(CORS_ORIGINS) and "*" not in CORS_ORIGINS


app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins(),
    allow_credentials=_cors_allow_credentials(),
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)


_limiter = SlidingWindowLimiter(max_requests=RATE_LIMIT_PER_MINUTE, window_seconds=60.0)


def _client_key(request: Request) -> str:
    # Behind a trusted proxy (Vercel, nginx) the real client IP is in
    # X-Forwarded-For. When the API is directly exposed this header is
    # spoofable, so only trust it when TRUST_PROXY_HEADERS is set.
    if TRUST_PROXY_HEADERS:
        forwarded = request.headers.get("x-forwarded-for")
        if forwarded:
            return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def rate_limited(request: Request) -> None:
    if not _limiter.allow(_client_key(request)):
        logger.warning("Rate limit exceeded for %s", _client_key(request))
        raise HTTPException(status_code=429, detail="Too many requests. Please slow down.")


def require_api_token(authorization: str | None = Header(default=None)) -> None:
    if API_TOKEN and authorization != f"Bearer {API_TOKEN}":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid API token.",
        )


@app.get("/")
async def root():
    return {"message": "Saif AI Backend Running Successfully"}


@app.get("/health", response_model=HealthResponse)
async def health():
    return {"status": "healthy"}


@app.post(
    "/chat",
    response_model=ChatResponse,
    dependencies=[Depends(rate_limited), Depends(require_api_token)],
)
async def chat(request: ChatRequest):
    try:
        ensure_indexed()
        response = generate_response(request.message, request.history)
        return ChatResponse(response=response, session_id=request.session_id)
    except HTTPException:
        raise
    except Exception:
        logger.exception("Chat request failed")
        return ChatResponse(
            response="Sorry, I'm having trouble connecting to the AI right now. Please try again later.",
            session_id=request.session_id,
        )


@app.post(
    "/ingest",
    response_model=IngestResponse,
    dependencies=[Depends(rate_limited), Depends(require_api_token)],
)
async def ingest():
    result = index_knowledge_base()
    logger.info("Ingest result: %s", result)
    return IngestResponse(
        status=result["status"],
        chunks_indexed=result["chunks_indexed"],
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host=HOST, port=PORT)
