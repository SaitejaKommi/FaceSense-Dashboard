from fastapi import APIRouter

router = APIRouter()


@router.post("/send")
async def send_notification(payload: dict):
    """Send a notification (placeholder - integrate email/SMS/push provider)"""
    return {"detail": "Notification queued", "payload": payload}
