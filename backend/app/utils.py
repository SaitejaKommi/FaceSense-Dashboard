from datetime import datetime, timedelta
from jose import jwt
from app.core.config import settings
import hashlib
import os

def get_password_hash(password: str):
    """Hash password using PBKDF2 instead of bcrypt to avoid compatibility issues"""
    salt = os.urandom(32)
    pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    return (salt + pwd_hash).hex()

def verify_password(plain: str, hashed: str):
    """Verify password against hash"""
    try:
        hash_bytes = bytes.fromhex(hashed)
        salt = hash_bytes[:32]
        stored_hash = hash_bytes[32:]
        pwd_hash = hashlib.pbkdf2_hmac('sha256', plain.encode('utf-8'), salt, 100000)
        return pwd_hash == stored_hash
    except Exception:
        return False

def create_access_token(subject: str, expires_delta: int = None):
    expire = datetime.utcnow() + timedelta(minutes=(expires_delta or settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    payload = {"sub": subject, "exp": expire}
    token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return token
