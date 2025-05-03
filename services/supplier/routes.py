from fastapi import APIRouter

router = APIRouter()

@router.get("/get-all-suppliers")
def get_all_suppliers():
    return {"status": "Success", "data": [], "message": "Get all suppliers successfully"}

@router.get("/get-supplier/{supplier_id}")
def get_supplier(supplier_id: int):
    return {"status": "Success", "data": {}, "message": f"Get supplier with ID {supplier_id} successfully"}

@router.post("/create-supplier")
def create_supplier(supplier: dict):
    return {"status": "Success", "data": {}, "message": "Supplier created successfully"}