from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

client = None
db = None


async def connect_to_mongo():
    global client, db

    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.MONGO_DB]

    print("Connected to MongoDB:", settings.MONGO_DB)


async def close_mongo_connection():
    global client

    if client:
        client.close()
        print("MongoDB connection closed")


async def get_db():
    """
    FastAPI dependency to get DB object
    """
    return db
