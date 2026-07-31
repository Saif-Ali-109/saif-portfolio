from dotenv import load_dotenv
import os

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
FALLBACK_MODELS = os.getenv("FALLBACK_MODELS", "gemini-2.0-flash,gemini-1.5-flash").split(",")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "gemini-embedding-001")
KNOWLEDGE_DIR = os.getenv("KNOWLEDGE_DIR", os.path.join(os.path.dirname(os.path.dirname(__file__)), "knowledge"))
CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", "500"))
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", "50"))
TOP_K_RESULTS = int(os.getenv("TOP_K_RESULTS", "3"))
MAX_HISTORY = int(os.getenv("MAX_HISTORY", "8"))

# API protection. If API_TOKEN is set, /chat and /ingest require
# "Authorization: Bearer <API_TOKEN>". CORS_ORIGINS is a comma-separated
# allowlist; do NOT set "*" together with credentials (browsers reject it
# anyway and it would open the API to every website).
API_TOKEN = os.getenv("API_TOKEN", "")
CORS_ORIGINS = [o.strip() for o in os.getenv("CORS_ORIGINS", "").split(",") if o.strip()]
RATE_LIMIT_PER_MINUTE = int(os.getenv("RATE_LIMIT_PER_MINUTE", "20"))
# Trust X-Forwarded-For for client IPs (set TRUE behind a trusted proxy such
# as Vercel/nginx). Leave FALSE when the API is directly exposed, otherwise
# clients can spoof the header to bypass per-IP rate limiting.
TRUST_PROXY_HEADERS = os.getenv("TRUST_PROXY_HEADERS", "true").lower() in ("1", "true", "yes")
# Disable OpenAPI/Swagger docs in production (schema/info disclosure).
DOCS_ENABLED = os.getenv("DOCS_ENABLED", "false").lower() in ("1", "true", "yes")

if GEMINI_API_KEY is None:
    raise RuntimeError("GEMINI_API_KEY is missing. Set it in ai/.env or environment variables.")
