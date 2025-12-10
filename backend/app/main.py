from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .db import connect_to_mongo, close_mongo_connection, get_db
from . import auth, students, attendance, classes, analytics, notifications
from . import auth_google
from .utils import get_password_hash
from .models import UserModel

app = FastAPI(
    title="FaceSense API",
    description="Facial Recognition Attendance System",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------------
# 🚀 Startup Event — Connect to Mongo + Create demo user
# --------------------------------------------------------
@app.on_event("startup")
async def startup_event():
    print("[STARTUP] FaceSense API Starting...")
    await connect_to_mongo()
    print("[STARTUP] Connected to MongoDB")
    
    # Create Indexes for Scalability
    from .db import create_indexes
    await create_indexes()


# --------------------------------------------------------
# 🛑 Shutdown Event — Close Mongo Connection
# --------------------------------------------------------
@app.on_event("shutdown")
async def shutdown_event():
    print("[SHUTDOWN] Shutting down FaceSense API...")
    await close_mongo_connection()
    print("[SHUTDOWN] MongoDB connection closed")


# --------------------------------------------------------
# 🌐 Root
# --------------------------------------------------------
@app.get("/")
def root():
    return {
        "message": "FaceSense API is running",
        "docs": "/docs",
        "version": "1.0.0"
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


# --------------------------------------------------------
# 📌 Routers
# --------------------------------------------------------
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(auth_google.router, prefix="/api/auth", tags=["Auth"])
app.include_router(students.router, prefix="/api/students", tags=["Students"])
app.include_router(attendance.router, prefix="/api/attendance", tags=["Attendance"])
app.include_router(classes.router, prefix="/api/classes", tags=["Classes"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])


# --------------------------------------------------------
# Run
# --------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
