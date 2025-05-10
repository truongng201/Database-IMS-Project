from fastapi import APIRouter
from shared_config import StandardResponse, standard_response

router = APIRouter()

@router.post("/login", response_model=StandardResponse)
@standard_response
def login():
    return {
        "access_token": "string",
        "refresh_token": "string",
    }

@router.get("/get-user-detail", response_model=StandardResponse)
@standard_response
def get_user_detail(user_id: int):
    return {}

@router.post("/register", response_model=StandardResponse)
@standard_response
def register(user: dict):
    return {}

@router.post("/update-user-info", response_model=StandardResponse)
@standard_response
def update_user_info(user: dict):
    return {}

@router.delete("/delete-user", response_model=StandardResponse)
@standard_response
def delete_user(user_id: int):
    return {}

@router.post("/logout", response_model=StandardResponse)
@standard_response
def logout():
    return {}

