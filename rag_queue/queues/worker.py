import os

from dotenv import load_dotenv
from google import genai
from google.genai.types import GenerateContentConfig
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_qdrant import QdrantVectorStore


load_dotenv()

client = genai.Client(api_key=os.getenv("gemini_API_Key"))

embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

vector_db = QdrantVectorStore.from_existing_collection(
    embedding=embedding_model,
    url="http://localhost:6333",
    collection_name="ayurvedic book",
)


def process_query(query: str) -> str:
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

    system_prompt = (
        "You are an expert Ayurvedic Consultant. Use the provided documents to give "
        "accurate, empathetic, and traditional medical advice. "
        "If the information is not in the documents, state that you are basing your answer "
        "on general Ayurvedic knowledge but the specific source is not available. "
        "Always remind the user to consult a physical doctor for serious conditions."
        f"{context}\n\n"
    )

    chat = client.chats.create(
        model="gemini-2.5-flash",
        config=GenerateContentConfig(system_instruction=system_prompt),
    )
    resp = chat.send_message(query)
    return resp.text
