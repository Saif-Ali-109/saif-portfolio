from app.config import TOP_K_RESULTS, CHROMA_DB_PATH
from app.embeddings import embed_text
from app.ingest import get_chroma_client, COLLECTION_NAME


def retrieve_context(query: str, k: int = TOP_K_RESULTS) -> str:
    client = get_chroma_client()
    try:
        collection = client.get_collection(COLLECTION_NAME)
    except ValueError:
        return ""

    query_embedding = embed_text(query)
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=k,
    )

    documents = results.get("documents", [[]])[0]
    if not documents:
        return ""

    return "\n\n".join(documents)
