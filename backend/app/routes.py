import json
from datetime import datetime
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session
from .db import SessionLocal
from .services.audio_processing import save_upload_file, transcribe_audio
from .services.analysis import (
    analyze_sentiment,
    extract_issues,
    generate_recommendations,
    tag_speakers,
    serialize_breakdown,
)
from .schemas import AnalysisResponse, TextAnalysisRequest, HistoryEntry, MessageResponse
from .models import AnalysisHistory

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=MessageResponse)
def root():
    return {"status": "ok", "message": "RetailSense AI backend is running."}


@router.post("/analyze-audio", response_model=AnalysisResponse)
async def analyze_audio(file: UploadFile = File(...), db: Session = Depends(get_db)):
    saved_path = await save_upload_file(file)
    transcript = transcribe_audio(saved_path)
    if not transcript:
        raise HTTPException(status_code=500, detail="No transcript was generated from the audio file.")

    speaker_breakdown = tag_speakers(transcript)
    sentiment_result = analyze_sentiment(transcript)
    issues = extract_issues(transcript)
    recommendations = generate_recommendations(issues, sentiment_result["sentiment"])

    analysis = AnalysisHistory(
        filename=file.filename,
        transcript=transcript,
        sentiment=sentiment_result["sentiment"],
        confidence=str(sentiment_result["confidence"]),
        issues=json.dumps(issues),
        recommendations=json.dumps(recommendations),
        speaker_breakdown=serialize_breakdown(speaker_breakdown),
        timestamp=datetime.utcnow(),
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return AnalysisResponse(
        id=analysis.id,
        filename=analysis.filename,
        transcript=analysis.transcript,
        speaker_breakdown=speaker_breakdown,
        sentiment=analysis.sentiment,
        confidence=float(analysis.confidence),
        issues=issues,
        recommendations=recommendations,
        timestamp=analysis.timestamp,
    )


@router.post("/analyze-text", response_model=AnalysisResponse)
def analyze_text(request: TextAnalysisRequest, db: Session = Depends(get_db)):
    transcript = request.transcript.strip()
    if not transcript:
        raise HTTPException(status_code=400, detail="Transcript text cannot be empty.")

    speaker_breakdown = tag_speakers(transcript)
    sentiment_result = analyze_sentiment(transcript)
    issues = extract_issues(transcript)
    recommendations = generate_recommendations(issues, sentiment_result["sentiment"])

    analysis = AnalysisHistory(
        filename=request.filename or "manual-text",
        transcript=transcript,
        sentiment=sentiment_result["sentiment"],
        confidence=str(sentiment_result["confidence"]),
        issues=json.dumps(issues),
        recommendations=json.dumps(recommendations),
        speaker_breakdown=serialize_breakdown(speaker_breakdown),
        timestamp=datetime.utcnow(),
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return AnalysisResponse(
        id=analysis.id,
        filename=analysis.filename,
        transcript=analysis.transcript,
        speaker_breakdown=speaker_breakdown,
        sentiment=analysis.sentiment,
        confidence=float(analysis.confidence),
        issues=issues,
        recommendations=recommendations,
        timestamp=analysis.timestamp,
    )


@router.get("/history", response_model=list[HistoryEntry])
def get_history(db: Session = Depends(get_db)):
    records = db.query(AnalysisHistory).order_by(AnalysisHistory.timestamp.desc()).all()
    history = []
    for record in records:
        history.append(
            HistoryEntry(
                id=record.id,
                filename=record.filename,
                transcript=record.transcript,
                sentiment=record.sentiment,
                confidence=float(record.confidence),
                issues=json.loads(record.issues or "[]"),
                recommendations=json.loads(record.recommendations or "[]"),
                speaker_breakdown=json.loads(record.speaker_breakdown or "{}"),
                timestamp=record.timestamp,
            )
        )
    return history


@router.delete("/history/{analysis_id}", response_model=MessageResponse)
def delete_history(analysis_id: int, db: Session = Depends(get_db)):
    analysis = db.query(AnalysisHistory).filter(AnalysisHistory.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis entry not found.")
    db.delete(analysis)
    db.commit()
    return {"status": "ok", "message": "History entry deleted."}
