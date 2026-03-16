
from pathlib import Path
from langchain_qdrant import QdrantVectorStore
from langchain_community.embeddings import HuggingFaceEmbeddings

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader


# Directory containing the PDF files to index
data_dir = Path(__file__).parent / "data"

# Collect all PDFs in the data folder
pdf_paths = sorted(data_dir.glob("*.pdf"))
if not pdf_paths:
    raise SystemExit(f"No PDFs found in {data_dir!r}")

# Text splitter configuration
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)

all_chunks = []
for pdf_path in pdf_paths:
    print(f"Loading {pdf_path.name}...")
    loader = PyPDFLoader(file_path=str(pdf_path))
    docs = loader.load()

    # Attach source metadata so we can trace chunks back to the PDF file
    for doc in docs:
        doc.metadata["source"] = str(pdf_path)

    chunks = text_splitter.split_documents(docs)
    all_chunks.extend(chunks)

print(f"Loaded {len(pdf_paths)} PDF(s), created {len(all_chunks)} chunks.")

# Embedding model
embedding_model = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2"
)

# Store embeddings in Qdrant
vector_store = QdrantVectorStore.from_documents(
    documents=all_chunks,
    embedding=embedding_model,
    url="http://localhost:6333",
    collection_name="ayurvedic book"
)

print("Indexing of documents successfully done")