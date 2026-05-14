"""
Append-only chat history in Neo4j Aura (separate from Mem0/Qdrant).

Requires root .env: NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD.
Optional: NEO4J_DATABASE — if unset and URI looks like Aura, ``neo4j`` is used.

Aura tip: username is usually ``neo4j`` (not your instance id). Use the connection
details from the Neo4j Aura console exactly.
"""

from __future__ import annotations

import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from dotenv import load_dotenv

ROOT_ENV_PATH = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(dotenv_path=ROOT_ENV_PATH)

_driver: Any = None
_driver_init_failed = False
_first_write_logged = False


def _strip_env(name: str) -> str:
    return (os.getenv(name) or "").strip()


def is_neo4j_enabled() -> bool:
    if os.getenv("NEO4J_ENABLED", "true").lower() not in ("1", "true", "yes"):
        return False
    return bool(_strip_env("NEO4J_URI") and _strip_env("NEO4J_USERNAME") and _strip_env("NEO4J_PASSWORD"))


def _database_for_uri(uri: str) -> str | None:
    """Aura instances need an explicit database name (default ``neo4j``)."""
    explicit = _strip_env("NEO4J_DATABASE")
    if explicit:
        return explicit
    lower = uri.lower()
    if "databases.neo4j.io" in lower or ".neo4j.io" in lower:
        return "neo4j"
    return None


def _get_driver():  # noqa: ANN202
    global _driver, _driver_init_failed
    if not is_neo4j_enabled():
        return None
    if _driver is not None:
        return _driver
    if _driver_init_failed:
        return None
    try:
        from neo4j import GraphDatabase

        uri = _strip_env("NEO4J_URI")
        user = _strip_env("NEO4J_USERNAME")
        pwd = _strip_env("NEO4J_PASSWORD")
        drv = GraphDatabase.driver(uri, auth=(user, pwd))
        drv.verify_connectivity()
        _driver = drv
        print("Neo4j: driver OK (connectivity verified).")
        return _driver
    except Exception as e:  # noqa: BLE001
        _driver_init_failed = True
        if _driver is not None:
            try:
                _driver.close()
            except Exception:  # noqa: BLE001
                pass
            _driver = None
        print(f"Neo4j driver init failed (graph writes disabled): {e}")
        return None


def record_conversation_turn(user_id: str, question: str, answer: str) -> None:
    """MERGE User, CREATE ConversationTurn and HAD_TURN edge."""
    global _first_write_logged
    drv = _get_driver()
    if drv is None:
        if is_neo4j_enabled():
            print("Neo4j: skip write — driver unavailable (see errors above).")
        return

    uri = _strip_env("NEO4J_URI")
    db = _database_for_uri(uri)

    max_len = int(os.getenv("NEO4J_MAX_TEXT_CHARS", "12000"))
    q = (question or "")[:max_len]
    a = (answer or "")[:max_len]
    created = datetime.now(timezone.utc).isoformat()

    cypher = """
    MERGE (u:User {userId: $user_id})
    CREATE (t:ConversationTurn {
      created: $created,
      question: $question,
      answer: $answer
    })
    CREATE (u)-[:HAD_TURN]->(t)
    """

    try:
        if db:
            with drv.session(database=db) as session:
                session.run(
                    cypher,
                    user_id=user_id,
                    created=created,
                    question=q,
                    answer=a,
                )
        else:
            with drv.session() as session:
                session.run(
                    cypher,
                    user_id=user_id,
                    created=created,
                    question=q,
                    answer=a,
                )
        verbose = os.getenv("NEO4J_VERBOSE", "true").lower() in ("1", "true", "yes")
        if verbose and not _first_write_logged:
            _first_write_logged = True
            print(
                f"Neo4j: first turn saved (database={db or 'default'}, user_id={user_id!r})."
            )
    except Exception as e:  # noqa: BLE001
        print(f"Neo4j write failed: {type(e).__name__}: {e}")
