# 🛒 RetailSense AI

[![React](https://img.shields.io/badge/React-18+-blue?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4+-purple?logo=vite)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.13+-blue?logo=python)](https://www.python.org/)
[![SQLite](https://img.shields.io/badge/SQLite-Latest-003B57?logo=sqlite)](https://www.sqlite.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

> **A full-stack retail conversation analytics platform powered by AI. Analyze customer-store interactions in real-time using advanced speech recognition, sentiment analysis, and intelligent recommendations.**

## 🎯 Quick Links

- 🌐 **[Live Frontend](https://retailsense-ai.vercel.app/)** - Deployed on Vercel
- 🚀 **[Live Backend API](https://retailsense-ai-ju0p.onrender.com/)** - Deployed on Render
- 📚 **[API Documentation](https://retailsense-ai-ju0p.onrender.com/docs)** - Interactive Swagger UI
- 💻 **[GitHub Repository](https://github.com/rishitha-yerapothina/retailsense-ai)** - Full source code

---

## 📖 Overview

**RetailSense AI** is an intelligent analytics platform designed to help retail managers understand and improve customer-store interactions. By leveraging cutting-edge AI technologies, the platform transforms customer conversations into actionable insights through real-time transcription, sentiment analysis, issue detection, and AI-powered recommendations.

Whether you're analyzing a single conversation or tracking trends across hundreds of interactions, RetailSense AI provides the tools to optimize retail operations and enhance customer experiences.

### Key Benefits

- 📊 **Real-time Analysis** - Instant insights from customer conversations
- 🎤 **Effortless Recording** - Voice or manual transcript input
- 🤖 **AI-Powered Insights** - Sentiment, issues, and recommendations
- 📈 **Historical Tracking** - Build analytics over time
- 🎨 **Beautiful Dashboard** - Modern, responsive UI
- 🔌 **Developer-Friendly** - Clean API with Swagger documentation

---

## 🏗️ Architecture

RetailSense AI follows a modern full-stack architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                  RetailSense AI Platform                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Frontend (React + Vite)        Backend (FastAPI)            │
│  ├── Dashboard                  ├── Audio Processing         │
│  ├── Upload/Recording           ├── Transcription (Whisper)  │
│  ├── Analysis Results           ├── Sentiment Analysis       │
│  └── History Tracking           ├── Issue Detection          │
│                                 ├── Recommendations Engine   │
│                                 └── Analytics Database       │
│                                                               │
│  Data Layer (SQLite)                                         │
│  └── Conversation History, Analysis Results                  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

### 🎤 Voice Conversation Analysis
- Real-time microphone recording via Web Speech API
- Fallback manual transcript input for unsupported browsers
- Live transcript display with speaker turn detection

### 🗣️ Speech-to-Text Transcription
- Powered by OpenAI's Whisper Small model
- Via Hugging Face API for cloud-based processing
- Support for various audio formats and languages
- Speaker separation and formatting

### 💭 Sentiment Analysis
- Confidence-scored sentiment classification (Positive/Negative/Neutral)
- Fine-tuned DistilBERT model via Hugging Face
- Real-time feedback with visual indicators
- Trend analysis over conversation history

### 🚨 Issue Detection
- Automatic identification of retail-specific problems:
  - Inventory availability issues
  - Pricing concerns
  - Wait time complaints
  - Billing/payment problems
  - Staffing concerns
  - Delivery issues

### 💡 AI-Powered Recommendations
- Intelligent, actionable suggestions based on detected issues
- Context-aware recommendations for store operations
- Prioritized recommendations for maximum impact

### 📚 Conversation History Tracking
- Complete audit trail of all analyzed conversations
- Search and filter capabilities
- Delete functionality with confirmation
- Timestamp-based organization

### 📊 Dashboard Analytics
- Key metrics at a glance (sentiment distribution, issue count)
- Visual analytics and charts
- Historical trends and patterns
- Export-ready data format

---

## 🛠️ Technology Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | React 18, Vite, Tailwind CSS |
| **Backend** | FastAPI, Python 3.13+, Uvicorn |
| **AI/ML** | Hugging Face Transformers, OpenAI Whisper |
| **Database** | SQLite3 |
| **Deployment** | Vercel (Frontend), Render (Backend), Docker |
| **APIs** | Hugging Face Inference API, Web Speech API |

---

## 🚀 Quick Start

### Prerequisites

RetailSense AI requires:

- **Node.js** 18+ and npm
- **Python** 3.13+ with pip
- **Git** for cloning the repository
- **Docker** (optional, for containerized deployment)

#### Verify Installation

```powershell
# Windows
.\install-prereqs.ps1

# macOS/Linux
python3 --version && node --version && npm --version
```

### Local Development Setup

#### 1️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.\.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set environment variable (optional for advanced features)
export HUGGING_FACE_API_TOKEN=your_token_here

# Start the backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`

#### 2️⃣ Frontend Setup

```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

#### 3️⃣ Access the Application

- 🎨 **Frontend**: [http://localhost:5173](http://localhost:5173)
- 📚 **API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- 🔄 **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 📁 Project Structure

```
retailsense-ai/
├── frontend/                    # React + Vite application
│   ├── src/
│   │   ├── pages/              # Page components (Upload, Dashboard, History, Analysis)
│   │   ├── components/         # Reusable UI components
│   │   ├── services/           # API integration layer
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # Entry point
│   ├── index.html              # HTML template
│   ├── package.json            # Frontend dependencies
│   └── vite.config.js          # Vite configuration
│
├── backend/                     # FastAPI application
│   ├── app/
│   │   ├── main.py             # FastAPI application setup
│   │   ├── routes.py           # API endpoints
│   │   ├── models.py           # Database models
│   │   ├── schemas.py          # Request/response schemas
│   │   ├── db.py               # Database configuration
│   │   ├── config.py           # Configuration management
│   │   └── services/           # Business logic
│   │       ├── analysis.py     # Analysis pipeline
│   │       └── audio_processing.py  # Audio handling
│   ├── requirements.txt        # Python dependencies
│   └── Dockerfile              # Backend container configuration
│
├── docker-compose.yml          # Multi-container orchestration
├── README.md                    # This file
├── sample_text.txt             # Sample transcript for testing
└── install-prereqs.ps1         # Prerequisites verification script
```

---

## 🔌 API Endpoints

### Health & Metadata

```http
GET /
```
Health check endpoint

### Analysis

```http
POST /analyze-audio
Content-Type: multipart/form-data

# Upload and analyze audio file
```

```http
POST /analyze-text
Content-Type: application/json

{
  "transcript": "Customer conversation text..."
}
```

### History Management

```http
GET /history
# Retrieve all analysis history
```

```http
DELETE /history/{id}
# Delete specific analysis entry
```

### Full API Documentation

Visit the interactive Swagger UI at your backend URL + `/docs`

---

## 🐳 Docker Deployment

### Build & Run Locally

```bash
# Build images
docker-compose build

# Start all services
docker-compose up

# Stop services
docker-compose down
```

### Individual Container Deployment

```bash
# Backend
cd backend
docker build -t retailsense-backend .
docker run -p 8000:8000 retailsense-backend

# Frontend (new terminal)
cd frontend
docker build -t retailsense-frontend .
docker run -p 5173:5173 retailsense-frontend
```

---

## 🌐 Production Deployment

### Frontend (Vercel)

```bash
# Push to GitHub
git push origin main

# Connect repository to Vercel
# Vercel automatically deploys on push
```

### Backend (Render)

```bash
# Render detects Dockerfile automatically
# Set environment variables in Render dashboard
# Automatic deployment on push to main
```

### Environment Variables

Create `.env` file in backend root:

```env
HUGGING_FACE_API_TOKEN=your_token_here
DATABASE_URL=sqlite:///./retailsense.db
```

---

## 📊 Example Usage

### 1. Record a Conversation

- Click **"Start Recording"** on the Upload page
- Have a natural conversation
- Click **"Stop Recording"**

### 2. Analyze

- Click **"Analyze Transcript"**
- View real-time sentiment, issues, and recommendations

### 3. Track History

- Navigate to **History** page
- Search past analyses
- View trends and patterns

### 4. Use Dashboard

- See key metrics at a glance
- Export data for reports
- Monitor operational improvements

---

## 🔧 Configuration

### Backend Configuration

Edit `backend/app/config.py` for:
- Database settings
- API timeouts
- Model parameters
- CORS configuration

### Frontend Configuration

Edit `frontend/vite.config.js` for:
- Backend API URL (for production)
- Build optimizations
- Dev server settings

---

## 📈 Future Enhancements

- 🌍 **Multi-language Support** - Analyze conversations in multiple languages
- 📱 **Mobile App** - Native iOS/Android applications
- ⚡ **Real-time Streaming** - Live analysis as conversations happen
- 📊 **Advanced Analytics Dashboard** - ML-powered insights and forecasting
- ☁️ **Cloud Database Integration** - PostgreSQL, MongoDB support
- 🏪 **Multi-store Analytics** - Compare performance across locations
- 📧 **Email Alerts** - Automated notifications for critical issues
- 🔐 **Enterprise Security** - SSO, RBAC, compliance certifications
- 🎯 **Retail Performance Insights** - KPIs and benchmark comparisons
- 🤖 **Conversational AI Assistant** - Ask questions about your data

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 Notes

- 🧠 **Models Used**:
  - Transcription: `openai/whisper-small` (4.3GB)
  - Sentiment Analysis: `distilbert-base-uncased-finetuned-sst-2-english`

- 🎤 **Speech Recognition**: Web Speech API with Hugging Face fallback

- 💾 **Database**: SQLite for lightweight local storage

- ⚠️ **First Run**: Model download may take time on first analysis (~2-3 minutes)

- 🧪 **Testing**: Use `sample_text.txt` for quick text-based testing

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Rishitha Yerapothina**

- GitHub: [@rishitha-yerapothina](https://github.com/rishitha-yerapothina)
- Portfolio: [RetailSense AI](https://retailsense-ai.vercel.app/)

---

## 🙏 Acknowledgments

- OpenAI for Whisper model
- Hugging Face for transformers and inference API
- FastAPI for excellent web framework
- React and Vite communities
- All contributors and supporters

---

## 📞 Support

For issues, questions, or suggestions:

1. 📖 Check the [API Documentation](https://retailsense-ai-ju0p.onrender.com/docs)
2. 🐛 Search existing [GitHub Issues](https://github.com/rishitha-yerapothina/retailsense-ai/issues)
3. 💬 Create a new issue with detailed information
4. 📧 Reach out directly via GitHub

---

**Last Updated**: June 2025 | **Status**: Active Development

### Docker Compose
1. From the project root, run:
   - `docker compose up --build`
2. The backend is available at `http://localhost:8000` and the frontend at `http://localhost:4173`.
3. You can stop the services with `docker compose down`.
