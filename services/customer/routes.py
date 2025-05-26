from fastapi import APIRouter, Depends
from controllers import CustomerController
from models import CustomerData
from shared_config import StandardResponse, standard_response
from shared_utils import login_required

router = APIRouter()

@router.get("/get-all-customers", response_model=StandardResponse)
@standard_response
def get_all_customers(user_id: int = Depends(login_required)):
    controller = CustomerController()
    response = controller.get_all_customers()
    return response

@router.get("/get-customer/{customer_id}", response_model=StandardResponse)
@standard_response
def get_customer(customer_id: int, user_id: int = Depends(login_required)):
    controller = CustomerController()
    response = controller.get_customer(customer_id)
    return response

@router.post("/create-customer", response_model=StandardResponse)
@standard_response
def create_customer(customer: CustomerData, user_id: int = Depends(login_required)):
    controller = CustomerController()
    response = controller.create_customer(customer.dict())
    return response

@router.post("/update-customer/{customer_id}", response_model=StandardResponse)
@standard_response
def update_customer(customer_id: int, customer: CustomerData, user_id: int = Depends(login_required)):
    controller = CustomerController()
    response = controller.update_customer(customer_id, customer)
    return response

@router.delete("/delete-customer/{customer_id}", response_model=StandardResponse)
@standard_response
def delete_customer(customer_id: int, user_id: int = Depends(login_required)):
    controller = CustomerController()
    response = controller.delete_customer(customer_id)
    return response

@router.get("/count-customers", response_model=StandardResponse)
@standard_response
def count_customers(user_id: int = Depends(login_required)):
    controller = CustomerController()
    response = controller.count_customers()
    return response