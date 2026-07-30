import os
import uuid
import chromadb
from chromadb.config import Settings
from chromadb.errors import NotFoundError

from app.config import KNOWLEDGE_DIR, CHROMA_DB_PATH, CHUNK_SIZE, CHUNK_OVERLAP
from app.embeddings import embed_texts
from app.utils import read_markdown_file, chunk_text

COLLECTION_NAME = os.getenv("CHROMA_COLLECTION_NAME", "saif_knowledge")


def get_chroma_client():
    os.makedirs(CHROMA_DB_PATH, exist_ok=True)
    return chromadb.PersistentClient(path=CHROMA_DB_PATH, settings=Settings(anonymized_telemetry=False))


def get_or_create_collection(client):
    try:
        return client.get_collection(COLLECTION_NAME)
    except NotFoundError:
        return client.create_collection(COLLECTION_NAME)


def index_knowledge_base():
    client = get_chroma_client()
    collection = get_or_create_collection(client)

    if collection.count() > 0:
        return {"status": "already_indexed", "chunks_indexed": collection.count()}

    all_chunks = []
    all_metadatas = []
    all_ids = []

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
            all_ids.append(str(uuid.uuid4()))

    if not all_chunks:
        return {"status": "no_content", "chunks_indexed": 0}

    embeddings = embed_texts(all_chunks)
    collection.add(
        embeddings=embeddings,
        documents=all_chunks,
        metadatas=all_metadatas,
        ids=all_ids,
    )

    return {"status": "indexed", "chunks_indexed": len(all_chunks)}
