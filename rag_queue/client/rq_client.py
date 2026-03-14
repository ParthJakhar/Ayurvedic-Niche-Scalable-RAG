from redis import Redis
import json
from typing import Any, Dict

redis_conn = Redis(host="localhost", port=6379, decode_responses=True)

QUEUE_NAME = "rag_query_queue"


def enqueue_query(query: str) -> str:
    """
    Push a query onto a Redis list and return a generated job id.
    """
    job_id = f"job:{redis_conn.incr('rag_query_job_id')}"
    payload: Dict[str, Any] = {"job_id": job_id, "query": query}
    redis_conn.rpush(QUEUE_NAME, json.dumps(payload))
    return job_id