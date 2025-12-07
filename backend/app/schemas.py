from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class UserCreate(BaseModel):
    username: str
    password: str
    role: Optional[str] = "teacher"

class StudentBase(BaseModel):
    name: str
    roll: str
    class_name: str
    photo: Optional[str] = None

class StudentIn(StudentBase):
    pass

class StudentOut(StudentBase):
    id: str = Field(..., alias="_id")
    class Config:
        populate_by_name = True

class AttendanceIn(BaseModel):
    roll: str
    status: str = "Present"
    confidence: Optional[float] = None

class AttendanceOut(BaseModel):
    id: str = Field(..., alias="_id")
    student_id: str
    timestamp: datetime
    status: str
    confidence: Optional[float] = None
    class Config:
        populate_by_name = True
