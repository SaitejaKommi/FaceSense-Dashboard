from fastapi import APIRouter, Depends, HTTPException
from .db import get_db

router = APIRouter(tags=["Analytics"])


@router.get("/summary")
async def analytics_summary(db=Depends(get_db)):
    """
    Return total students and total attendance records.
    """
    try:
        if db is None:
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        students_collection = db["students"]
        attendance_collection = db["attendance"]
        
        # Count students
        student_count = await students_collection.count_documents({})
        
        # Count attendance
        attendance_count = await attendance_collection.count_documents({})

        return {
            "students": student_count,
            "attendance_records": attendance_count
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting analytics summary: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error getting analytics: {str(e)}")
