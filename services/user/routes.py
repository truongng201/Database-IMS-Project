from fastapi import APIRouter, Request, Depends
from shared_config import StandardResponse, standard_response
from shared_utils import login_required
from controllers import *
from models import LoginModel, RegisterModel, TokensModel, UpdateUserModel

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
def get_user_detail(user_info: dict = Depends(login_required)):
    controller = GetUserDetailController()
    response = controller.execute(user_info)
    return response


@router.post("/register", response_model=StandardResponse)
@standard_response
def register(payload: RegisterModel):
    controller = RegisterController()
    controller.execute(payload)
    return {}


@router.post("/update-user-info", response_model=StandardResponse)
@standard_response
def update_user_info(updated_user: UpdateUserModel, user_id: int = Depends(login_required)):
    controller = UpdateUserController()
    controller.execute(updated_user, user_id)
    return {}


@router.post("/logout", response_model=StandardResponse)
@standard_response
def logout(refresh_token: str, request: Request, user_id: int = Depends(login_required)):
    access_token = request.headers.get("Authorization")
    controller = LogoutController()
    controller.execute(user_id, refresh_token, access_token)
    return {}


@router.post("/get-new-access-token", response_model=StandardResponse)
@standard_response
def get_new_access_token(refresh_token: str):
    controller = GetNewAccessTokenController()
    response = controller.execute(refresh_token)
    return response

# @router.post("/activate-user", response_model=StandardResponse)
# @standard_response
# def activate_user(user_id: int, activation_code: str):
#     controller = ActivateUserController()
#     controller.execute(user_id, activation_code)
#     return {}

# @router.post("/assign-warehouse", response_model=StandardResponse)
# @standard_response
# def assign_warehouse(user_id: int, warehouse_id: int, user_id_from_token: int = Depends(login_required)):
#     controller = AssignWarehouseController()
#     controller.execute(user_id, warehouse_id, user_id_from_token)
#     return {}