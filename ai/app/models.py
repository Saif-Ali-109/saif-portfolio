from pydantic import BaseModel


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = []
    session_id: str = ""


class ChatResponse(BaseModel):
    response: str
    session_id: str = ""


class HealthResponse(BaseModel):
    status: str


class IngestResponse(BaseModel):
    status: str
    chunks_indexed: int
