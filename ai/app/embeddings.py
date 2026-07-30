import google.genai as genai
from app.config import GEMINI_API_KEY, EMBEDDING_MODEL

_client = None


def _get_client():
    global _client
    if _client is None:
        _client = genai.Client(api_key=GEMINI_API_KEY)
    return _client


def embed_text(text: str) -> list[float]:
    client = _get_client()
    result = client.models.embed_content(
        model=EMBEDDING_MODEL,
        contents=[text],
    )
    return result.embeddings[0].values


def embed_texts(texts: list[str]) -> list[list[float]]:
    client = _get_client()
    result = client.models.embed_content(
        model=EMBEDDING_MODEL,
        contents=texts,
    )
    return [e.values for e in result.embeddings]
