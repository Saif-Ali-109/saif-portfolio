import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.models import ChatRequest, ChatResponse, HealthResponse, IngestResponse
from app.rag import generate_response
from app.ingest import index_knowledge_base

HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8001"))
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")

app = FastAPI(
    title="Saif AI",
    description="RAG-powered AI assistant for Saif Ali Wajid's portfolio.",
    version="1.0.0",
)


@app.on_event("startup")
async def build_index():
    index_knowledge_base()

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Saif AI Backend Running Successfully"}


@app.get("/health", response_model=HealthResponse)
async def health():
    return {"status": "healthy"}


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    response = generate_response(request.message, request.history)
    return ChatResponse(response=response, session_id=request.session_id)


@app.post("/ingest", response_model=IngestResponse)
async def ingest():
    result = index_knowledge_base()
    return IngestResponse(
        status=result["status"],
        chunks_indexed=result["chunks_indexed"],
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=HOST, port=PORT)
