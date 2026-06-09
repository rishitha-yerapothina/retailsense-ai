import os
import tempfile
from pathlib import Path
from typing import Optional
from fastapi import HTTPException, UploadFile
from .config import ALLOWED_EXTENSIONS, ASR_MODEL, HF_API_TOKEN_ENV

try:
    from transformers import pipeline
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False

try:
    import torch  # noqa: F401
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False

import requests

asr_pipeline = None


def get_remote_inference_token() -> str:
    token = os.environ.get(HF_API_TOKEN_ENV, "")
    if not token:
        raise RuntimeError(
            "Hugging Face API token missing. Set the HUGGING_FACE_API_TOKEN environment variable to enable remote inference."
        )
    return token


def create_asr_pipeline():
    global asr_pipeline
    if asr_pipeline is None:
        if not TRANSFORMERS_AVAILABLE or not TORCH_AVAILABLE:
            raise RuntimeError("Local ASR unavailable because transformers or torch is not installed.")
        asr_pipeline = pipeline(
            "automatic-speech-recognition",
            model=ASR_MODEL,
            chunk_length_s=30,
            device="cpu",
        )
    return asr_pipeline


async def save_upload_file(upload_file: UploadFile) -> Path:
    if not upload_file.filename:
        raise HTTPException(status_code=400, detail="Uploaded file has no filename.")

    extension = upload_file.filename.split(".")[-1].lower()
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Unsupported file type. Use WAV, MP3, or M4A.")

    target = Path(tempfile.gettempdir()) / f"retailsense_upload_{upload_file.filename}"
    contents = await upload_file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    target.write_bytes(contents)
    return target


def transcribe_audio(file_path: Path) -> str:
    if TRANSFORMERS_AVAILABLE and TORCH_AVAILABLE:
        try:
            model = create_asr_pipeline()
            result = model(str(file_path))
            return result.get("text", "").strip()
        except Exception:
            pass

    token = get_remote_inference_token()
    url = f"https://api-inference.huggingface.co/models/{ASR_MODEL}"
    headers = {"Authorization": f"Bearer {token}"}
    try:
        with open(file_path, "rb") as audio_file:
            response = requests.post(url, headers=headers, files={"file": audio_file}, timeout=180)
        response.raise_for_status()
        data = response.json()
        if isinstance(data, dict) and "text" in data:
            return data.get("text", "").strip()
        raise RuntimeError(data.get("error", str(data)))
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=(
                "Transcription failed. This can occur if local Torch is unavailable and remote inference failed. "
                f"{exc}"
            ),
        )
