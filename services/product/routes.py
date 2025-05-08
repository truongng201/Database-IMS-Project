from fastapi import APIRouter, HTTPException
from controllers import GetAllProductController, GetProductByIdController, CreateProductController
from models import ProductCreateModel, ProductModel, ProductUpdateModel
from shared_config import StandardResponse, standard_response
router = APIRouter()

@router.get("/get-all-products", response_model=StandardResponse)
@standard_response
def get_all_products():
    controller = GetAllProductController()
    response = controller.execute()
    return response

@router.get("/get-product/{product_id}", response_model=StandardResponse[ProductModel])
@standard_response
def get_product(product_id: int):
    if not isinstance(product_id, int) or product_id <= 0:
        raise HTTPException(status_code=400, detail="Invalid Product ID")
    controller = GetProductByIdController()
    response = controller.execute(product_id=product_id)
    if not response:
        raise HTTPException(status_code=404, detail=f"Product with id {product_id} not found")
    return response


@router.post("/create-product", response_model=StandardResponse)
@standard_response
def create_product(product: ProductCreateModel):
    if not isinstance(product, ProductCreateModel):
        raise HTTPException(status_code=400, detail="Invalid product data")
    controller = CreateProductController()
    response = controller.execute(product)
    if not response:
        raise HTTPException(status_code=400, detail="Failed to create product")
    return {}

@router.post("/update-product", response_model=StandardResponse)
@standard_response
def update_product(product: ProductUpdateModel):
    if not isinstance(product, ProductCreateModel):
        raise HTTPException(status_code=400, detail="Invalid product data")
    
    return {}

@router.delete("/delete-product", response_model=StandardResponse)
@standard_response
def delete_product(product_id: int):
    if not isinstance(product_id, int) or product_id <= 0:
        raise HTTPException(status_code=400, detail="Invalid product id")
    return {}