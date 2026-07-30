"""Script to index the knowledge base into ChromaDB.

Usage:
    cd ai/
    python scripts/index.py
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.ingest import index_knowledge_base


def main():
    result = index_knowledge_base()
    print(f"Status: {result['status']}")
    print(f"Chunks indexed: {result['chunks_indexed']}")


if __name__ == "__main__":
    main()
