from app.config import TOP_K_RESULTS
from app.embeddings import embed_text
from app.ingest import get_store, index_knowledge_base


def _cosine_similarity(a: list[float], b: list[float]) -> float:
    dot = sum(ai * bi for ai, bi in zip(a, b))
    norm_a = sum(ai * ai for ai in a) ** 0.5
    norm_b = sum(bi * bi for bi in b) ** 0.5
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


def retrieve_context(query: str, k: int = TOP_K_RESULTS) -> str:
    store = get_store()
    if not store["chunks"]:
        index_knowledge_base()

    query_embedding = embed_text(query)
    similarities = [
        _cosine_similarity(query_embedding, emb) for emb in store["embeddings"]
    ]

    top_indices = sorted(
        range(len(similarities)),
        key=lambda i: similarities[i],
        reverse=True,
    )[:k]

    chunks = [store["chunks"][i] for i in top_indices]
    return "\n\n".join(chunks)
