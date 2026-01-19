from app.db.mongo import get_database
from datetime import datetime

async def log_violation(session_id: str, violation_type: str, severity: str, details: str = None):
    db = get_database()
    if db is None:
        return
        
    await db.violations.insert_one({
        "session_id": session_id,
        "type": violation_type,
        "severity": severity, # LOW, MEDIUM, HIGH
        "details": details,
        "timestamp": datetime.utcnow()
    })

async def update_session_risk(session_id: str, score_increment: float):
    db = get_database()
    if db is None:
        return

    # Atomic update
    await db.sessions.update_one(
        {"session_id": session_id},
        {"$inc": {"cum_risk_score": score_increment}, "$set": {"last_active": datetime.utcnow()}},
        upsert=True
    )
