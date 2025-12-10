from motor.motor_asyncio import AsyncIOMotorClient
from .core.config import settings
import pymongo

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


async def create_indexes():
    """
    Create indexes for performance and constraint enforcement.
    """
    global db
    if db is None:
        await connect_to_mongo()

    print("[INDEX] Ensuring indexes...")

    # 1. Students: Unique Roll Number
    try:
        await db["students"].create_index("roll", unique=True)
        print("[INDEX] Created unique index on students.roll")
    except Exception as e:
        print("[INDEX] Error creating students.roll index:", e)

    # 2. Attendance: (student_id + timestamp) for optimizing queries
    # and preventing duplicates if we wanted strict unique constraint (but we do time-window check manually)
    try:
        await db["attendance"].create_index([("student_id", pymongo.ASCENDING), ("timestamp", pymongo.DESCENDING)])
        print("[INDEX] Created compound index on attendance(student_id, timestamp)")
    except Exception as e:
        print("[INDEX] Error creating attendance index:", e)
    
    # 3. Users: Unique Username
    try:
        await db["users"].create_index("username", unique=True)
        print("[INDEX] Created unique index on users.username")
    except Exception as e:
        print("[INDEX] Error creating users.username index:", e)
