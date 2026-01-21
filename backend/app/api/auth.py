from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from app.models.user import UserCreate, UserLogin, UserInDB, UserRole
from app.core.security import get_password_hash, verify_password, create_access_token
from app.db.mongo import get_database
from datetime import timedelta
from typing import Annotated

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

@router.post("/signup", response_model=UserInDB)
async def signup(user: UserCreate):
    db = get_database()
    
    # Check if user exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user_dict = user.model_dump()
    raw_password = user_dict.pop("password")
    
    # DEBUG: Log password details to diagnose frontend hashing issues
    print(f"DEBUG: Received password length: {len(raw_password)}")
    if len(raw_password) > 72:
        print("WARNING: Password > 72 bytes detected. Frontend hashing might have failed. Applying backend fallback.")
        import hashlib
        # Fallback: Hash excessively long password to ensure it fits bcrypt limits
        # This prevents the 500 error even if frontend logic is bypassed/cached
        raw_password = hashlib.sha256(raw_password.encode()).hexdigest()
        
    user_dict["hashed_password"] = get_password_hash(raw_password)
    user_dict["created_at"] = None
    
    # Let's clean this up:
    hashed_pw = user_dict["hashed_password"]
    # We don't have an ID yet.
    
    new_user = {
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "hashed_password": hashed_pw,
        "is_active": True,
        # created_at handled by default if we instantiate, but for dict insert we should set it if we want it in DB
    }
    
    result = await db.users.insert_one(new_user)
    
    # Return created user
    created_user = await db.users.find_one({"_id": result.inserted_id})
    return UserInDB(**created_user)

@router.post("/login")
async def login(user_credentials: UserLogin):
    db = get_database()
    user = await db.users.find_one({"email": user_credentials.email})
    
    if not user or not verify_password(user_credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate token
    access_token_expires = timedelta(minutes=60 * 24)
    access_token = create_access_token(
        data={"sub": user["email"], "role": user["role"]},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "email": user["email"],
            "full_name": user.get("full_name"),
            "role": user["role"]
        }
    }
