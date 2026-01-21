from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import proctor
from app.db.mongo import connect_db, close_db
import os

app = FastAPI(title="AI Smart Proctoring API")

# CORS configuration
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database events
@app.on_event("startup")
async def startup_db_client():
    await connect_db()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_db()

# Routes
app.include_router(proctor.router, prefix="/api", tags=["proctor"])
from app.api import auth
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])

@app.get("/health")
async def health_check():
    return {"status": "ok"}
