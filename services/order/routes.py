from fastapi import APIRouter, Depends, Query
from controllers import OrderController
from models import OrderData
from shared_config import StandardResponse, standard_response
from shared_utils import login_required

router = APIRouter()

@router.get("/get-all-orders", response_model=StandardResponse)
@standard_response
def get_all_orders(
    search: str = Query(None, description="Search by order ID (ORD-1000 format) or customer name"),
    user_info: dict = Depends(login_required)
):
    controller = OrderController()
    response = controller.get_all_orders(user_info, search=search)
    return response

@router.get("/get-order/{order_id}", response_model=StandardResponse)
@standard_response
def get_order(order_id: int, user_info: int = Depends(login_required)):
    controller = OrderController()
    response = controller.get_order(order_id, user_info)
    return response

@router.post("/create-order", response_model=StandardResponse)
@standard_response
def create_order(order: OrderData, user_info: int = Depends(login_required)):
    controller = OrderController()
    response = controller.create_order(order.dict(), user_info)
    return response

@router.post("/update-order/{order_id}", response_model=StandardResponse)
@standard_response
def update_order(order_id: int, order: OrderData, user_info: int = Depends(login_required)):
    controller = OrderController()
    response = controller.update_order(order_id, order, user_info)
    return response

@router.delete("/delete-order/{order_id}", response_model=StandardResponse)
@standard_response
def delete_order(order_id: int, user_info: int = Depends(login_required)):
    controller = OrderController()
    response = controller.delete_order(order_id, user_info)
    return response

@router.post("/update-order-status", response_model=StandardResponse)
@standard_response
def update_order_status(order_id: int, status: str, user_info: dict = Depends(login_required)):
    controller = OrderController()
    response = controller.update_order_status(order_id, status)
    return response