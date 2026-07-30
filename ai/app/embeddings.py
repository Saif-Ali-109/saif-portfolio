import time

import google.genai as genai
from app.config import GEMINI_API_KEY, EMBEDDING_MODEL

_client = None
MAX_RETRIES = 3


def _get_client():
    global _client
    if _client is None:
        _client = genai.Client(api_key=GEMINI_API_KEY)
    return _client


def embed_text(text: str) -> list[float]:
    client = _get_client()
    last_error = None
    for attempt in range(MAX_RETRIES):
        try:
            result = client.models.embed_content(
                model=EMBEDDING_MODEL,
                contents=[text],
            )
            return result.embeddings[0].values
        except Exception as e:
            last_error = e
            if attempt < MAX_RETRIES - 1:
                time.sleep(2 ** attempt)
    raise last_error


def embed_texts(texts: list[str]) -> list[list[float]]:
    client = _get_client()
    last_error = None
    for attempt in range(MAX_RETRIES):
        try:
            result = client.models.embed_content(
                model=EMBEDDING_MODEL,
                contents=texts,
            )
            return [e.values for e in result.embeddings]
        except Exception as e:
            last_error = e
            if attempt < MAX_RETRIES - 1:
                time.sleep(2 ** attempt)
    raise last_error
