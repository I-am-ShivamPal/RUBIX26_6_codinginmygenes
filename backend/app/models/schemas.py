from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class FrameAnalysisRequest(BaseModel):
    session_id: str
    image: str # base64
    timestamp: datetime = None

class RiskResponse(BaseModel):
    face_count: int
    head_pose: str
    risk_score_increment: float
    violations: List[str]
    status: str

class EventLogRequest(BaseModel):
    session_id: str
    event_type: str # tab_switch, window_blur, etc
    timestamp: datetime = None
    details: Optional[str] = None
