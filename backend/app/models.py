from sqlalchemy import Column, Integer, String, Text, DateTime
from .db import Base
from datetime import datetime


class AnalysisHistory(Base):
    __tablename__ = "analysis_history"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(256), nullable=False)
    transcript = Column(Text, nullable=False)
    sentiment = Column(String(32), nullable=False)
    confidence = Column(String(16), nullable=False)
    issues = Column(Text, nullable=False)
    recommendations = Column(Text, nullable=False)
    speaker_breakdown = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
