from fastapi import APIRouter, Depends, HTTPException, status, Body
from app import schemas, utils
from app.db import get_db
from app.models import UserModel
from google.oauth2 import id_token
from google.auth.transport import requests
from app.core.config import settings

router = APIRouter()

@router.post("/google/login", response_model=schemas.Token)
async def google_login(token_data: schemas.GoogleLoginIn = Body(...), db=Depends(get_db)):
    """
    Verify Google ID Token and login/register user.
    """
    try:
        # Verify the token
        id_info = id_token.verify_oauth2_token(
            token_data.credential, 
            requests.Request(), 
            settings.GOOGLE_CLIENT_ID
        )

        email = id_info.get("email")
        full_name = id_info.get("name")
        picture = id_info.get("picture")

        if not email:
             raise HTTPException(status_code=400, detail="Invalid Google Token: No email found")

        # Check for existing user by email
        users_collection = db["users"]
        existing = await users_collection.find_one({"email": email})

        if not existing:
            # Auto-register Google user; derive a username from email prefix if needed
            base_username = email.split("@")[0]

            new_user = UserModel(
                username=base_username,
                email=email,
                full_name=full_name,
                picture_url=picture,
                hashed_password="",  # No password for Google users
                role="teacher"  # Default role
            )
            await users_collection.insert_one(new_user.dict(by_alias=True, exclude_none=True))
        
        # Create Access Token
        token = utils.create_access_token(email)
        return {"access_token": token, "token_type": "bearer"}

    except ValueError as e:
        raise HTTPException(status_code=401, detail=f"Invalid Google Token: {str(e)}")
    except Exception as e:
        print(f"Google Login Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Login Error")
