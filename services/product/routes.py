from fastapi import APIRouter

router = APIRouter()

@router.get("/get-all-products")
def get_all_products():
    return {"status": "Success", "data": [], "message": "Get all products successfully"}

@router.get("/get-product/{product_id}")
def get_product(product_id: int):
    return {"status": "Success", "data": {}, "message": f"Get product with ID {product_id} successfully"}


@router.post("/create-product")
def create_product(product: dict):
    return {"status": "Success", "data": {}, "message": "Product created successfully"}
