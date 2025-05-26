from fastapi import APIRouter, Depends
from controllers import *
from models import *
from shared_config import StandardResponse, standard_response
from shared_utils import login_required
router = APIRouter()

@router.get("/get-all-products", response_model=StandardResponse)
@standard_response
def get_all_products(limit: int, offset: int, user_info: dict = Depends(login_required)):
    controller = GetAllProductController()
    response = controller.execute(limit=limit, offset=offset, user_info=user_info)
    return {"products": response.products}

@router.get("/get-product/{product_id}", response_model=StandardResponse)
@standard_response
def get_product(product_id: int, user_id: int = Depends(login_required)):
    controller = GetProductByIdController()
    response = controller.execute(product_id=product_id)
    return response


@router.post("/create-product", response_model=StandardResponse)
@standard_response
def create_product(product: ProductCreateModel, user_id: int = Depends(login_required)):
    controller = CreateProductController()
    controller.execute(product)
    return {}


@router.post("/update-product", response_model=StandardResponse)
@standard_response
def update_product(product: ProductUpdateModel, user_id: int = Depends(login_required)):
    controller = UpdateProductController()
    controller.execute(product)
    return {}


@router.delete("/delete-product", response_model=StandardResponse)
@standard_response
def delete_product(product_id: int, user_id: int = Depends(login_required)):
    controller = DeleteProductController()
    controller.execute(product_id=product_id)
    return {}


@router.get("/categories", response_model=StandardResponse)
@standard_response
def get_categories(user_id: int = Depends(login_required)):
    controller = GetAllCategoriesController()
    response = controller.execute()
    return response


@router.get("/products-by-category/{category_id}", response_model=StandardResponse)
@standard_response
def get_products_by_category(category_id: int, user_id: int = Depends(login_required)):
    controller = GetProductsByCategoryController()
    response = controller.execute(category_id=category_id)
    return response


@router.get("/count-total-products", response_model=StandardResponse)
@standard_response
def count_total_products(user_info: dict = Depends(login_required)):
    controller = CountTotalProductsController()
    response = controller.execute(user_info)
    return response