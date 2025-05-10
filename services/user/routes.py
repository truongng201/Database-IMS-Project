from fastapi import APIRouter
from shared_config import StandardResponse, standard_response
from controllers import *
from models import LoginModel, RegisterModel, TokensModel

router = APIRouter()

@router.post("/login", response_model=StandardResponse)
@standard_response
def login(payload: LoginModel) -> TokensModel:
    controller = LoginController()
    response = controller.execute(payload)
    return response

@router.get("/get-user-detail", response_model=StandardResponse)
@standard_response
def get_user_detail(user_id: int):
    return {}


@router.post("/register", response_model=StandardResponse)
@standard_response
def register(payload: RegisterModel):
    controller = RegisterController()
    controller.execute(payload)
    return {}


@router.get("/get-all-roles", response_model=StandardResponse)
@standard_response
def get_all_roles():
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

