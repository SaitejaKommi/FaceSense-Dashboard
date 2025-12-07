from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.db import get_db
from bson import ObjectId

router = APIRouter(tags=["Classes"])


def serialize_class(doc):
    return {
        "id": str(doc["_id"]),
        "name": doc["name"],
        "students": doc.get("students", 0)
    }


@router.get("/", response_model=List[dict])
async def list_classes(db=Depends(get_db)):
    """
    Return all classes from MongoDB
    """
    try:
        if db is None:
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        classes = []
        cursor = db.classes.find({})
        async for cls in cursor:
            classes.append(serialize_class(cls))
        return classes
    except Exception as e:
        print(f"Error fetching classes: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching classes: {str(e)}")


@router.post("/", response_model=dict)
async def create_class(payload: dict, db=Depends(get_db)):
    """
    Create a new class in MongoDB
    payload example: { "name": "Class 1A" }
    """
    try:
        if db is None:
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        if "name" not in payload:
            raise HTTPException(status_code=400, detail="Class name is required")

        new_class = {
            "name": payload["name"],
            "students": 0  # default
        }

        result = await db.classes.insert_one(new_class)
        new_class["id"] = str(result.inserted_id)

        return {"message": "Class created", "class": new_class}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating class: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating class: {str(e)}")


@router.get("/{class_id}", response_model=dict)
async def get_class_details(class_id: str, db=Depends(get_db)):
    """
    Get details of one class by ID
    """

    cls = await db.classes.find_one({"_id": ObjectId(class_id)})
    if not cls:
        raise HTTPException(status_code=404, detail="Class not found")

    return serialize_class(cls)


@router.delete("/{class_id}", response_model=dict)
async def delete_class(class_id: str, db=Depends(get_db)):
    """
    Delete a class by ID
    """

    result = await db.classes.delete_one({"_id": ObjectId(class_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Class not found")

    return {"message": "Class deleted successfully"}
