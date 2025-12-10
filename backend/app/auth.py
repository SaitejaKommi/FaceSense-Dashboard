from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app import schemas, utils
from app.db import get_db
from app.models import UserModel


router = APIRouter(tags=["Auth"])


@router.post("/register", response_model=schemas.Token)
async def register(user: schemas.UserCreate, db=Depends(get_db)):
    """Register a new user and return an access token."""
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection failed")

    users_collection = db["users"]
    # Check both username and email for uniqueness
    existing = await users_collection.find_one({"$or": [{"username": user.username}, {"email": user.email}]})

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this username or email already exists",
        )

    hashed = utils.get_password_hash(user.password)

    new_user = UserModel(
        username=user.username,
        email=user.email,
        hashed_password=hashed,
        role=user.role or "teacher",
    )

    await users_collection.insert_one(
        new_user.dict(by_alias=True, exclude_none=True)
    )

    # Auto-login after registration for frontend convenience
    token = utils.create_access_token(user.username)
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login", response_model=schemas.Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db=Depends(get_db),
):
    """Login user & return access token."""
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection failed")

    users_collection = db["users"]
    user = await users_collection.find_one({"username": form_data.username})

    if not user or not utils.verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )

    token = utils.create_access_token(form_data.username)
    return {"access_token": token, "token_type": "bearer"}
