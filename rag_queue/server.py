from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, HTTPException, Query

from .client.rq_client import enqueue_query, redis_conn


app = FastAPI()


@app.get("/")
def root():
    return {"status": "Server is up and running"}


@app.post("/chat")
def chat(
    query: str = Query(..., description="The chat query of user"),
):
    job_id = enqueue_query(query)
    return {"status": "queued", "job_id": job_id}


@app.get("/job-status")
def job_status(job_id: str = Query(..., description="Job ID to check")):
    """
    Return the status and result (or error) for a given job_id.
    """
    result_key = f"{job_id}:result"
    error_key = f"{job_id}:error"

    result = redis_conn.get(result_key)
    error = redis_conn.get(error_key)

    if result is not None:
        return {"status": "completed", "result": result}

    if error is not None:
        return {"status": "failed", "error": error}

    # Neither result nor error stored yet; job may still be queued or processing
    # We can't distinguish queued vs processing with current data, so just say "pending".
    return {"status": "pending", "job_id": job_id}
