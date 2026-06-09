from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional


class SpeakerBreakdown(BaseModel):
    customer: str
    staff: str


class AnalysisResponse(BaseModel):
    id: Optional[int]
    filename: str
    transcript: str
    speaker_breakdown: SpeakerBreakdown
    sentiment: str
    confidence: float
    issues: List[str]
    recommendations: List[str]
    timestamp: Optional[datetime]


class TextAnalysisRequest(BaseModel):
    filename: Optional[str] = "manual-text"
    transcript: str


class HistoryEntry(BaseModel):
    id: int
    filename: str
    transcript: str
    sentiment: str
    confidence: float
    issues: List[str]
    recommendations: List[str]
    speaker_breakdown: SpeakerBreakdown
    timestamp: datetime

    class Config:
        orm_mode = True


class MessageResponse(BaseModel):
    status: str
    message: str
