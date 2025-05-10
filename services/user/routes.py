from fastapi import APIRouter, Request, Depends
from shared_config import StandardResponse, standard_response
from shared_utils import login_required
from controllers import *
from models import LoginModel, RegisterModel, TokensModel

router = APIRouter()

@router.post("/login", response_model=StandardResponse)
@standard_response
def login(payload: LoginModel, request: Request) -> TokensModel:
    client_ip = request.client.host
    user_agent = request.headers.get("User-Agent")
    controller = LoginController()
    response = controller.execute(payload, client_ip, user_agent)
    return response

@router.get("/get-user-detail", response_model=StandardResponse)
@standard_response
def get_user_detail(user_id: dict = Depends(login_required)):
    controller = GetUserDetailController()
    response = controller.execute(user_id)
    return response


@router.post("/register", response_model=StandardResponse)
@standard_response
def register(payload: RegisterModel):
    controller = RegisterController()
    controller.execute(payload)
    return {}


@router.get("/get-all-roles", response_model=StandardResponse)
@standard_response
def get_all_roles():
    controller = GetAllRolesController()
    response = controller.execute()
    return response


@router.post("/update-user-info", response_model=StandardResponse)
@standard_response
def update_user_info(user: dict):
    return {}


@router.post("/logout", response_model=StandardResponse)
@standard_response
def logout(user_id: dict = Depends(login_required)):
    return {}


@router.post("/get-new-access-token", response_model=StandardResponse)
@standard_response
def get_new_access_token(refresh_token: str):
    return {}