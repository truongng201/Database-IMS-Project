from fastapi import APIRouter
from controllers import *
from models import *
from shared_config import StandardResponse, standard_response
router = APIRouter()

@router.get("/get-all-products", response_model=StandardResponse)
@standard_response
def get_all_products():
    controller = GetAllProductController()
    response = controller.execute()
    return response.products

@router.get("/get-product/{product_id}", response_model=StandardResponse)
@standard_response
def get_product(product_id: int):
    controller = GetProductByIdController()
    response = controller.execute(product_id=product_id)
    return response


@router.post("/create-product", response_model=StandardResponse)
@standard_response
def create_product(product: ProductCreateModel):
    controller = CreateProductController()
    controller.execute(product)
    return {}


@router.post("/update-product", response_model=StandardResponse)
@standard_response
def update_product(product: ProductUpdateModel):
    controller = UpdateProductController()
    controller.execute(product)
    return {}


@router.delete("/delete-product", response_model=StandardResponse)
@standard_response
def delete_product(product_id: int):
    controller = DeleteProductController()
    controller.execute(product_id=product_id)
    return {}


@router.get("/categories", response_model=StandardResponse)
@standard_response
def get_categories():
    controller = GetAllCategoriesController()
    response = controller.execute()
    return response


@router.get("/products-by-category/{category_id}", response_model=StandardResponse)
@standard_response
def get_products_by_category(category_id: int):
    controller = GetProductsByCategoryController()
    response = controller.execute(category_id=category_id)
    return response