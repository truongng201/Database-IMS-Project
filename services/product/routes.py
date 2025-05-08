from fastapi import APIRouter
from models import ProductListResponseModel, ProductCreateModel, ProductUpdateModel, ProductResponseModel
from controllers import GetAllProductController
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
    return {"status": "Success", "data": {}, "message": f"Get product with ID {product_id} successfully"}


@router.post("/create-product")
def create_product(product: dict):
    return {"status": "Success", "data": {}, "message": "Product created successfully !"}

