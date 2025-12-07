from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId


# ------------------------------
# 🔥 ObjectId Converter for Pydantic
# ------------------------------
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
    
    @classmethod
    def validate(cls, v):
        if isinstance(v, ObjectId):
            return v
        try:
            return ObjectId(v)
        except Exception:
            raise ValueError("Invalid ObjectId")


# ------------------------------
# 👤 User (MongoDB)
# ------------------------------
class UserModel(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    username: str
    hashed_password: str
    role: str = "teacher"
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        populate_by_name = True


# ------------------------------
# 🎓 Student (MongoDB)
# ------------------------------
class StudentModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id")
    name: str
    roll: str
    class_name: str
    photo: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        populate_by_name = True


# ------------------------------
# 📅 Attendance (MongoDB)
# ------------------------------
class AttendanceModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id")
    student_id: PyObjectId
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    status: str
    confidence: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        populate_by_name = True
