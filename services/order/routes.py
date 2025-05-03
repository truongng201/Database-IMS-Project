from fastapi import APIRouter

router = APIRouter()

@router.get("/get-all-orders")
def get_all_orders():
    return {"status": "Success", "data": [], "message": "Get all orders successfully"}

@router.get("/get-order/{order_id}")
def get_order(order_id: int):
    return {"status": "Success", "data": {}, "message": f"Get order with ID {order_id} successfully"}

@router.post("/create-order")
def create_order(order: dict):
    return {"status": "Success", "data": {}, "message": "Order created successfully"}