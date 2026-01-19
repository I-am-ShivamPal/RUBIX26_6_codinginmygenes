from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.models.schemas import FrameAnalysisRequest, RiskResponse, EventLogRequest
from app.core.face_detection import decode_image, analyze_face
from app.core.risk_engine import risk_engine
from app.core.audit_logger import log_violation, update_session_risk

router = APIRouter()

@router.post("/analyze-frame", response_model=RiskResponse)
async def analyze_frame(request: FrameAnalysisRequest, background_tasks: BackgroundTasks):
    image = decode_image(request.image)
    if image is None:
        raise HTTPException(status_code=400, detail="Invalid image data")

    # CV Analysis
    analysis = analyze_face(image)
    face_count = analysis["face_count"]
    head_pose = analysis["head_pose"]

    # Risk Calculation
    score, violations = risk_engine.calculate_frame_risk(face_count, head_pose)

    # Background Logging (don't block response)
    if score > 0:
        background_tasks.add_task(update_session_risk, request.session_id, score)
        for v in violations:
            severity = "HIGH" if "Multiple" in v or "No face" in v else "LOW"
            background_tasks.add_task(log_violation, request.session_id, "frame_violation", severity, v)

    return RiskResponse(
        face_count=face_count,
        head_pose=head_pose,
        risk_score_increment=score,
        violations=violations,
        status="success"
    )

@router.post("/log-event")
async def log_event(request: EventLogRequest, background_tasks: BackgroundTasks):
    score = risk_engine.calculate_event_risk(request.event_type)
    
    if score > 0:
        background_tasks.add_task(update_session_risk, request.session_id, score)
        background_tasks.add_task(log_violation, request.session_id, "browser_event", "HIGH", request.event_type)

    return {"status": "logged", "risk_increment": score}
