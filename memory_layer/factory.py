"""
Mem0-backed user memory (Qdrant + OpenAI embeddings/LLM for extraction).

Note: Mem0 open-source v3+ removed Neo4j `graph_store` from Memory config.
Per-turn chat history can be stored in Neo4j Aura via ``neo4j_graph``;
Mem0 user memory stays in Qdrant (separate collection from RAG).
"""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any

from dotenv import load_dotenv

ROOT_ENV_PATH = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(dotenv_path=ROOT_ENV_PATH)

_memory_instance: Any | None = None
_memory_init_failed = False


def is_memory_enabled() -> bool:
    return os.getenv("MEM0_ENABLED", "true").lower() in ("1", "true", "yes")


def _mem0_config() -> dict[str, Any]:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is required for Mem0")

    host = os.getenv("QDRANT_HOST", "localhost")
    port = int(os.getenv("QDRANT_PORT", "6333"))
    collection = os.getenv("MEM0_QDRANT_COLLECTION", "ayur_user_memory")
    embed_model = os.getenv("MEM0_EMBED_MODEL", "text-embedding-3-small")
    embed_dims = int(os.getenv("MEM0_EMBEDDING_DIMS", "1536"))
    llm_model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    return {
        "embedder": {
            "provider": "openai",
            "config": {
                "model": embed_model,
                "api_key": api_key,
                "embedding_dims": embed_dims,
            },
        },
        "llm": {
            "provider": "openai",
            "config": {
                "model": llm_model,
                "api_key": api_key,
            },
        },
        "vector_store": {
            "provider": "qdrant",
            "config": {
                "host": host,
                "port": port,
                "collection_name": collection,
            },
        },
    }


def get_memory():  # noqa: ANN201
    global _memory_instance, _memory_init_failed
    if not is_memory_enabled():
        return None
    if _memory_instance is not None:
        return _memory_instance
    if _memory_init_failed:
        return None
    try:
        from mem0 import Memory

        _memory_instance = Memory.from_config(_mem0_config())
        return _memory_instance
    except Exception as e:  # noqa: BLE001
        _memory_init_failed = True
        print(f"Mem0 init failed (memory layer disabled): {e}")
        return None


def search_memories(query: str, user_id: str) -> str:
    mem = get_memory()
    if mem is None:
        return ""
    raw = mem.search(query=query, filters={"user_id": user_id})
    if isinstance(raw, dict):
        items = raw.get("results", [])
    else:
        items = list(raw) if raw else []
    if not items:
        return ""
    return json.dumps([str(x) for x in items], ensure_ascii=False)


def add_conversation(user_id: str, user_text: str, assistant_text: str) -> None:
    mem = get_memory()
    if mem is None:
        return
    mem.add(
        user_id=user_id,
        messages=[
            {"role": "user", "content": user_text},
            {"role": "assistant", "content": assistant_text},
        ],
    )
