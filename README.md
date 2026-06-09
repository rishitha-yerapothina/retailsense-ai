# RetailSense AI

RetailSense AI is a full-stack retail analytics MVP that helps store managers analyze customer-store conversations from audio recordings.

## Project Structure

- `backend/`
  - `app/` - FastAPI application, models, routes, AI services
  - `requirements.txt` - Python dependencies
- `frontend/`
  - `src/` - React application source
  - `package.json` - frontend scripts and dependencies
- `sample_text.txt` - example transcript for manual text analysis
## Prerequisites

RetailSense AI requires the following tools:

- Node.js + npm
- Python 3.14 or 3.13
- Docker Desktop (optional)

A helper script is provided to verify installations and open download pages:

```powershell
.\install-prereqs.ps1
```

If you prefer manual downloads, use these links:

- Node.js: https://nodejs.org/en/download/
- Python 3.14: https://www.python.org/downloads/release/python-3140/
- Docker Desktop: https://www.docker.com/products/docker-desktop/
## Backend Setup

1. Open a terminal and navigate to `backend/`.
2. Create a virtual environment (recommended):
   - `python -m venv .venv`
   - `.\.venv\Scripts\activate`
3. Install dependencies:
   - `pip install -r requirements.txt`
4. (Optional) Set a Hugging Face API token for remote transcription and sentiment analysis if local Torch is unavailable:
   - `set HUGGING_FACE_API_TOKEN=your_token_here`
5. Run the backend:
   - `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`

The backend will start on `http://localhost:8000`.

## Frontend Setup

1. Open a separate terminal and navigate to `frontend/`.
2. Install dependencies:
   - `npm install`
3. Start the development server:
   - `npm run dev`
4. Open the browser at the displayed Vite URL, usually `http://localhost:5173`.

## API Endpoints

- `GET /` - Health check
- `POST /analyze-audio` - Upload audio file and analyze
- `POST /analyze-text` - Submit transcript text for analysis
- `GET /history` - Retrieve analysis history
- `DELETE /history/{id}` - Delete a history entry

## Features

- Audio upload with drag-and-drop
- Whisper-based audio transcription via Hugging Face
- Rule-based speaker separation
- Sentiment analysis with confidence score
- Issue detection for inventory, pricing, wait time, billing, staffing, and delivery
- Recommendations engine for actionable store improvements
- SQLite analytics history with search and delete
- Responsive dashboard UI built with React

## Notes

- The backend uses `openai/whisper-small` for transcription and `distilbert-base-uncased-finetuned-sst-2-english` for sentiment analysis.
- If an audio file is not supported or an error occurs, the API returns a meaningful error message.
- Use `sample_text.txt` to test text analysis quickly.

## Deployment

### Local Deployment
1. Build the frontend:
   - `cd frontend && npm run build`
2. Optionally serve the built frontend using a static server.
3. Deploy the backend to any FastAPI-compatible host and point the frontend to the backend URL.
4. Configure environment variables or reverse proxy as needed for production.

### Docker Deployment
1. Build the backend container:
   - `cd backend && docker build -t retailsense-backend .`
2. Build the frontend container:
   - `cd frontend && docker build -t retailsense-frontend .`
3. Run the backend container:
   - `docker run -p 8000:8000 retailsense-backend`
4. Run the frontend container:
   - `docker run -p 4173:4173 retailsense-frontend`
5. Open the frontend at `http://localhost:4173`.

### Docker Compose
1. From the project root, run:
   - `docker compose up --build`
2. The backend is available at `http://localhost:8000` and the frontend at `http://localhost:4173`.
3. You can stop the services with `docker compose down`.
