def chunk_text(text: str, chunk_size: int, chunk_overlap: int) -> list[str]:
    if chunk_size <= 0:
        raise ValueError("CHUNK_SIZE must be positive")
    if chunk_overlap >= chunk_size:
        raise ValueError("CHUNK_OVERLAP must be smaller than CHUNK_SIZE")
    if chunk_overlap < 0:
        raise ValueError("CHUNK_OVERLAP must be non-negative")

    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        if chunk:
            chunks.append(chunk.strip())
        if end >= len(text):
            break
        start = end - chunk_overlap
    return chunks


def read_markdown_file(filepath: str) -> str:
    with open(filepath, "r", encoding="utf-8") as f:
        return f.read()
