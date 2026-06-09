from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DB_URL = f"sqlite:///{BASE_DIR / 'retailsense.db'}"
ALLOWED_EXTENSIONS = {"wav", "mp3", "m4a"}
ASR_MODEL = "openai/whisper-small"
SENTIMENT_MODEL = "distilbert-base-uncased-finetuned-sst-2-english"
HF_API_TOKEN_ENV = "HUGGING_FACE_API_TOKEN"
MAX_UPLOAD_SIZE_BYTES = 120000000  # 120 MB
