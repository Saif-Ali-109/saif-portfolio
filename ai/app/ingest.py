import os

from app.config import KNOWLEDGE_DIR, CHUNK_SIZE, CHUNK_OVERLAP
from app.embeddings import embed_texts
from app.utils import read_markdown_file, chunk_text

_vector_store = {
    "chunks": [],
    "embeddings": [],
    "metadatas": [],
}


def get_store():
    return _vector_store


def index_knowledge_base():
    store = _vector_store
    if store["chunks"]:
        return {"status": "already_indexed", "chunks_indexed": len(store["chunks"])}

    all_chunks = []
    all_metadatas = []

    for filename in os.listdir(KNOWLEDGE_DIR):
        if not filename.endswith(".md"):
            continue
        filepath = os.path.join(KNOWLEDGE_DIR, filename)
        content = read_markdown_file(filepath)
        topic = filename.replace(".md", "")
        chunks = chunk_text(content, CHUNK_SIZE, CHUNK_OVERLAP)
        for chunk in chunks:
            all_chunks.append(chunk)
            all_metadatas.append({"source": filename, "topic": topic})

    if not all_chunks:
        return {"status": "no_content", "chunks_indexed": 0}

    embeddings = embed_texts(all_chunks)
    store["chunks"] = all_chunks
    store["embeddings"] = embeddings
    store["metadatas"] = all_metadatas

    return {"status": "indexed", "chunks_indexed": len(all_chunks)}
