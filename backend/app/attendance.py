from fastapi import APIRouter, Depends, HTTPException
from typing import List
from datetime import datetime, date, timedelta
from bson import ObjectId
from app import schemas
from app.db import get_db

router = APIRouter(tags=["Attendance"])


@router.post("/mark", response_model=dict)
async def mark_attendance(att: schemas.AttendanceIn, db=Depends(get_db)):
    """
    Mark attendance by roll number.
    """
    # Fetch student by roll number
    students_collection = db["students"]
    student = await students_collection.find_one({"roll": att.roll})

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    attendance_collection = db["attendance"]
    new_attendance = {
        "student_id": student["_id"],
        "student_name": student["name"],
        "roll": att.roll,
        "timestamp": datetime.utcnow(),
        "status": att.status or "Present",
        "confidence": att.confidence,
    }

    result = await attendance_collection.insert_one(new_attendance)
    new_attendance["id"] = str(result.inserted_id)
    new_attendance["student_id"] = str(new_attendance["student_id"])
    
    return new_attendance


@router.get("/", response_model=List[dict])
async def get_attendance(skip: int = 0, limit: int = 100, db=Depends(get_db)):
    """
    Return all attendance records with pagination.
    """
    try:
        if db is None:
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        attendance_collection = db["attendance"]
        
        records = []
        cursor = attendance_collection.find({}).skip(skip).limit(limit)
        async for record in cursor:
            record["id"] = str(record["_id"])
            record["student_id"] = str(record["student_id"])
            record.pop("_id", None)
            records.append(record)
        
        return records
    except Exception as e:
        print(f"Error fetching attendance: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching attendance: {str(e)}")


@router.get("/today", response_model=List[dict])
async def get_today_attendance(db=Depends(get_db)):
    """
    Return today's attendance records.
    """
    try:
        if db is None:
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        today = date.today()
        start_of_day = datetime(today.year, today.month, today.day, 0, 0, 0)
        end_of_day = start_of_day + timedelta(days=1)

        attendance_collection = db["attendance"]
        
        records = []
        cursor = attendance_collection.find({
            "timestamp": {
                "$gte": start_of_day,
                "$lt": end_of_day
            }
        })
        async for record in cursor:
            record["id"] = str(record["_id"])
            record["student_id"] = str(record["student_id"])
            record.pop("_id", None)
            records.append(record)
        
        return records
    except Exception as e:
        print(f"Error fetching today's attendance: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching attendance: {str(e)}")


@router.get("/student/{student_id}", response_model=List[dict])
async def get_student_attendance(student_id: str, db=Depends(get_db)):
    """
    Return attendance history for a specific student.
    """
    try:
        student_obj_id = ObjectId(student_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid student ID format")
    
    attendance_collection = db["attendance"]
    
    records = []
    cursor = attendance_collection.find({"student_id": student_obj_id})
    async for record in cursor:
        record["id"] = str(record["_id"])
        record["student_id"] = str(record["student_id"])
        records.append(record)
    
    return records
