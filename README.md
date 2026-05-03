# Ayurvedic-Niche-Scalable-RAG

A scalable Retrieval-Augmented Generation (RAG) system focused on Ayurvedic knowledge, featuring a chat interface, hospital finder, and quiz functionality. Built with modern web technologies and AI for personalized Ayurvedic consultations.

## Features

- **AI-Powered Chat**: Interact with an Ayurvedic consultant powered by Google's Gemini AI and vectorized Ayurvedic texts.
- **Hospital Finder**: Search for nearby hospitals using Overpass API with distance calculations.
- **Quiz System**: Test your Ayurvedic knowledge with interactive quizzes.
- **Memory Layer**: Persistent storage system for user preferences, session data, and repository-specific facts across conversations.
- **Scalable Architecture**: Uses Redis queue for job processing, Qdrant for vector storage, and FastAPI for backend services.
- **Modern Frontend**: Built with React, Vite, and Tailwind CSS for a responsive UI.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Shadcn/UI
- **Backend**: FastAPI (Python)
- **AI/ML**: Google Gemini AI, LangChain, HuggingFace Embeddings
- **Databases**: Qdrant (vector DB), Redis (queue)
- **APIs**: Overpass API for hospital data
- **Deployment**: Docker Compose for services

## Prerequisites

- Python 3.8+
- Node.js 16+
- Docker and Docker Compose
- Git

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ParthJakhar/Ayurvedic-Niche-Scalable-RAG.git
   cd Ayurvedic-Niche-Scalable-RAG
   ```

2. **Set up environment variables**:
   - Copy `.env.example` to `.env` (if available) or create `.env` with:
     ```
     gemini_API_Key=your_google_gemini_api_key_here
     ```
   - Note: `.env` is in `.gitignore` to keep secrets safe.

3. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   pip install -r backend/requirements.txt
   pip install -r rag_queue/requirements.txt
   ```

4. **Install Node.js dependencies**:
   ```bash
   cd aura-chat
   npm install
   cd ..
   ```

5. **Set up data**:
   - Place PDF files containing Ayurvedic texts in the `data/` directory.
   - The indexing script will process these into the vector database.

## Running the Project

1. **Start databases**:
   ```bash
   docker-compose up -d  # Starts Qdrant on port 6333
   cd rag_queue
   docker-compose up -d  # Starts Redis on port 6379
   cd ..
   ```

2. **Index the data**:
   ```bash
   python index.py
   ```
   This loads PDFs into Qdrant for RAG.

3. **Start the backend API**:
   ```bash
   cd backend
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

4. **Start the RAG queue server**:
   ```bash
   cd rag_queue
   python -m uvicorn server:app --reload --host 0.0.0.0 --port 8001
   ```

5. **Start the worker** (in a new terminal):
   ```bash
   cd rag_queue
   python worker_runner.py
   ```

6. **Start the frontend**:
   ```bash
   cd aura-chat
   npm run dev
   ```

## Usage

- **Frontend**: Open http://localhost:5173
  - Chat with the AI Ayurvedic consultant
  - Take quizzes
  - Find nearby hospitals

- **API Endpoints**:
  - `POST /chat?query=<message>`: Queue a chat query (returns job_id)
  - `GET /job-status?job_id=<id>`: Check job status
  - `GET /api/hospitals`: Search hospitals (backend on port 8000)

## Project Structure

```
Ayurvedic-Niche-Scalable-RAG/
├── aura-chat/          # React frontend
├── backend/            # FastAPI backend
├── rag_queue/          # Redis queue and worker
├── data/               # PDF documents
├── index.py            # Data indexing script
├── docker-compose.yml  # Qdrant service
└── requirements.txt    # Python deps
```

## Development

- **Linting**: `npm run lint` in `aura-chat/`
- **Testing**: `npm run test` in `aura-chat/`
- **Build**: `npm run build` in `aura-chat/`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Troubleshooting

- **Worker not processing queries**: Ensure frontend API_BASE points to port 8001 (in `aura-chat/src/hooks/useAyurvedicChat.js`)
- **Vector DB issues**: Check Qdrant at http://localhost:6333/dashboard
- **Redis issues**: Verify Redis is running on port 6379

For more help, check the code comments or open an issue.</content>
<parameter name="filePath">c:\Users\acer.DESKTOP-GH18VDP\Desktop\AyurAI\Ayurvedic-Niche-Scalable-RAG\README.md