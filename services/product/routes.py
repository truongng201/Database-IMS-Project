from fastapi import APIRouter
from controllers import GetAllProductController, GetProductByIdController
from models import ProductCreateModel
router = APIRouter()

@router.get("/get-all-products")
def get_all_products() :
    controller = GetAllProductController()
    response = controller.execute()
    return {
        "status": "Success",
        "data": response.products,
        "message": "Get all products successfully"
    }

@router.get("/get-product/{product_id}")
def get_product(product_id: int):
    if not isinstance(product_id, int) or product_id <= 0:
        return {"status": "Error", "data": {}, "message": "Invalid product ID"}
    controller = GetProductByIdController()
    response = controller.execute(product_id=product_id)
    if not response:
        return {"status": "Error", "data": {}, "message": f"Product with ID {product_id} not found"}
    return {"status": "Success", "data": response, "message": f"Get product with ID {product_id} successfully"}


@router.post("/create-product")
def create_product(product: ProductCreateModel):
    
    return {"status": "Success", "data": {}, "message": "Product created successfully !"}

