from pydantic import BaseModel, Field

MAX_MESSAGE_LENGTH = 2000
MAX_HISTORY_ITEMS = 20


class ChatMessage(BaseModel):
    role: str = Field(pattern="^(user|assistant)$")
    content: str = Field(min_length=1, max_length=MAX_MESSAGE_LENGTH)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=MAX_MESSAGE_LENGTH)
    history: list[ChatMessage] = Field(default_factory=list, max_length=MAX_HISTORY_ITEMS)
    session_id: str = Field(default="", max_length=128)


class ChatResponse(BaseModel):
    response: str
    session_id: str = ""


class HealthResponse(BaseModel):
    status: str


class IngestResponse(BaseModel):
    status: str
    chunks_indexed: int
