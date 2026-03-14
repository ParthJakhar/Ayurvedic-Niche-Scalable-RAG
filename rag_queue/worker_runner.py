import json
import time

from redis import Redis

from .queues.worker import process_query
from .client.rq_client import QUEUE_NAME


redis_conn = Redis(host="localhost", port=6379, decode_responses=True)


def run_worker(poll_interval: float = 1.0) -> None:
    """
    Simple blocking worker loop that pulls jobs from Redis and processes them.
    """
    print("Starting simple Redis worker. Waiting for jobs...")
    while True:
        _, raw = redis_conn.blpop(QUEUE_NAME)
        payload = json.loads(raw)
        job_id = payload.get("job_id")
        query = payload.get("query")
        print(f"Processing {job_id} with query: {query!r}")

        try:
            result = process_query(query)
            redis_conn.set(f"{job_id}:result", result)
            print(f"Job {job_id} completed.")
        except Exception as e:  # noqa: BLE001
            redis_conn.set(f"{job_id}:error", str(e))
            print(f"Job {job_id} failed: {e}")

        # optional small sleep to avoid tight loop if needed
        if poll_interval:
            time.sleep(poll_interval)


if __name__ == "__main__":
    run_worker()

