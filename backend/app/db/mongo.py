from motor.motor_asyncio import AsyncIOMotorClient
import os

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

db = MongoDB()

async def connect_db():
    mongo_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    db_name = os.getenv("DATABASE_NAME", "rubix_db")
    print(f"Connecting to MongoDB at {mongo_url}")
    db.client = AsyncIOMotorClient(mongo_url)
    db.db = db.client[db_name]
    print("Connected to MongoDB")

async def close_db():
    if db.client:
        db.client.close()
        print("Closed MongoDB connection")

def get_database():
    return db.db
