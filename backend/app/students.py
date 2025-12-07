from fastapi import APIRouter, Depends, HTTPException
from typing import List
from bson import ObjectId
from app import schemas
from app.db import get_db

router = APIRouter()


@router.post("/", response_model=dict)
async def create_student(student: schemas.StudentIn, db=Depends(get_db)):
    """Create a new student"""
    try:
        if db is None:
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        students_collection = db["students"]
        
        new_student = {
            "name": student.name,
            "roll": student.roll,
            "class_name": student.class_name,
            "photo": student.photo or None,
        }
        
        result = await students_collection.insert_one(new_student)
        new_student["id"] = str(result.inserted_id)
        new_student.pop("_id", None)
        
        print(f"Student created successfully: {new_student}")
        return new_student
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating student: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating student: {str(e)}")


@router.get("/", response_model=List[dict])
async def list_students(skip: int = 0, limit: int = 100, db=Depends(get_db)):
    """Get all students with pagination"""
    try:
        if db is None:
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        students_collection = db["students"]
        
        students = []
        cursor = students_collection.find({}).skip(skip).limit(limit)
        async for student in cursor:
            student["id"] = str(student["_id"])
            # Remove _id from response to avoid duplication
            student.pop("_id", None)
            students.append(student)
        
        return students
    except Exception as e:
        print(f"Error fetching students: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching students: {str(e)}")


@router.get("/{student_id}", response_model=dict)
async def get_student(student_id: str, db=Depends(get_db)):
    """Get a specific student by ID"""
    students_collection = db["students"]
    
    try:
        student = await students_collection.find_one({"_id": ObjectId(student_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid student ID format")
    
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    student["id"] = str(student["_id"])
    return student


@router.put("/{student_id}", response_model=dict)
async def update_student(student_id: str, student: schemas.StudentIn, db=Depends(get_db)):
    """Update a student"""
    students_collection = db["students"]
    
    try:
        result = await students_collection.update_one(
            {"_id": ObjectId(student_id)},
            {"$set": {
                "name": student.name,
                "roll": student.roll,
                "class_name": student.class_name,
                "photo": student.photo
            }}
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid student ID format")
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Student not found")
    
    updated_student = await students_collection.find_one({"_id": ObjectId(student_id)})
    updated_student["id"] = str(updated_student["_id"])
    
    return updated_student


@router.delete("/{student_id}")
async def delete_student(student_id: str, db=Depends(get_db)):
    """Delete a student"""
    students_collection = db["students"]
    
    try:
        result = await students_collection.delete_one({"_id": ObjectId(student_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid student ID format")
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Student not found")
    
    return {"detail": "Student deleted successfully"}
