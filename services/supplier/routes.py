from fastapi import APIRouter, Depends
from controllers import SupplierController
from models import SupplierData
from shared_config import StandardResponse, standard_response
from shared_utils import login_required

router = APIRouter()

@router.get("/get-all-suppliers", response_model=StandardResponse)
@standard_response
def get_all_suppliers(user_info: dict = Depends(login_required)):
    controller = SupplierController()
    response = controller.get_all_suppliers(user_info=user_info)
    return response

@router.get("/get-supplier/{supplier_id}", response_model=StandardResponse)
@standard_response
def get_supplier(supplier_id: int, user_info: dict = Depends(login_required)):
    controller = SupplierController()
    response = controller.get_supplier(supplier_id=supplier_id, user_info=user_info)
    return response

@router.post("/create-supplier", response_model=StandardResponse)
@standard_response
def create_supplier(supplier: SupplierData, user_id: int = Depends(login_required)):
    controller = SupplierController()
    response = controller.create_supplier(supplier.dict())
    return response

@router.post("/update-supplier/{supplier_id}", response_model=StandardResponse)
@standard_response
def update_supplier(supplier_id: int, supplier: SupplierData, user_id: int = Depends(login_required)):
    controller = SupplierController()
    response = controller.update_supplier(supplier_id, supplier)
    return response

@router.delete("/delete-supplier/{supplier_id}", response_model=StandardResponse)
@standard_response
def delete_supplier(supplier_id: int, user_id: int = Depends(login_required)):
    controller = SupplierController()
    response = controller.delete_supplier(supplier_id)
    return response

@router.get("/count-suppliers", response_model=StandardResponse)
@standard_response
def count_suppliers(user_info: dict = Depends(login_required)):
    controller = SupplierController()
    response = controller.count_suppliers(user_info=user_info)
    return response