import os
from pathlib import Path

from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_qdrant import QdrantVectorStore
from openai import OpenAI

from memory_layer import (
    add_conversation,
    is_memory_enabled,
    is_neo4j_enabled,
    record_conversation_turn,
    search_memories,
)


ROOT_ENV_PATH = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=ROOT_ENV_PATH)

openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    raise RuntimeError("Missing OPENAI_API_KEY in root .env")

openai_model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
client = OpenAI(api_key=openai_api_key)

embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

qdrant_url = os.getenv("QDRANT_URL", "http://localhost:6333")
vector_db = QdrantVectorStore.from_existing_collection(
    embedding=embedding_model,
    url=qdrant_url,
    collection_name="ayurvedic book",
)


def process_query(query: str, user_id: str = "anonymous") -> str:
    print("Processing query:", query)

    search_result = vector_db.similarity_search(query=query, k=5)

    context = "\n\n\n".join(
        [
            f"Page Content:{result.page_content}\n"
            f"Page Number:{result.metadata.get('page_label')}\n"
            f"File Location:{result.metadata.get('source')}"
            for result in search_result
        ]
    )

    memory_block = ""
    if is_memory_enabled():
        try:
            mem_json = search_memories(query, user_id)
            if mem_json:
                memory_block = (
                    "\n\nRelevant memories from this user's past conversations "
                    f"(JSON list): {mem_json}\n"
                )
        except Exception as e:  # noqa: BLE001
            print(f"Memory search skipped: {e}")

    system_prompt = (
        "You are an expert Ayurvedic Consultant. Use the provided documents to give "
        "accurate, empathetic, and traditional medical advice. "
        "If the information is not in the documents, state that you are basing your answer "
        "on general Ayurvedic knowledge but the specific source is not available. "
        "Always remind the user to consult a physical doctor for serious conditions."
        "If the user asks about a specific Ayurvedic treatment, provide the treatment name, description, and benefits. "
        "If the user asks about a specific Ayurvedic herb, provide the herb name, description, and benefits. "
        "If the user asks about a specific Ayurvedic disease, provide the disease name, description, and treatment. "
        "If the user asks about a specific Ayurvedic symptom, provide the symptom name, description, and treatment. "
        "If the user asks about a specific Ayurvedic diet, provide the diet name, description, and benefits. "
        "If the user asks about a specific Ayurvedic exercise, provide the exercise name, description, and benefits. "
        "If the user asks about a specific Ayurvedic lifestyle, provide the lifestyle name, description, and benefits. "
        "If the user asks about a specific Ayurvedic meditation, provide the meditation name, description, and benefits. "
        f"{context}\n\n"
        f"{memory_block}"
    )

    resp = client.chat.completions.create(
        model=openai_model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": query},
        ],
    )
    answer = (resp.choices[0].message.content or "").strip()

    if is_memory_enabled():
        try:
            add_conversation(user_id, query, answer)
        except Exception as e:  # noqa: BLE001
            print(f"Memory add skipped: {e}")

    if is_neo4j_enabled():
        record_conversation_turn(user_id, query, answer)

    return answer
