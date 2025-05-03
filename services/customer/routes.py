from fastapi import APIRouter

router = APIRouter()

@router.get("/get-all-customers")
def get_all_customers():
    return {"status": "Success", "data": [], "message": "Get all customers successfully"}

@router.get("/get-customer/{customer_id}")
def get_customer(customer_id: int):
    return {"status": "Success", "data": {}, "message": f"Get customer with ID {customer_id} successfully"}

@router.post("/create-customer")
def create_customer(customer: dict):
    return {"status": "Success", "data": {}, "message": "Customer created successfully"}