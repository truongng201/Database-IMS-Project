from queries import UpdateProductQuery
from models import ProductUpdateModel
from shared_config.custom_exception import InvalidDataException, NotFoundException

class UpdateProductController:
    def __init__(self):
        self.query = UpdateProductQuery()
        
    def execute(self, updated_product: ProductUpdateModel):
        if updated_product.product_id <= 0:
            raise InvalidDataException("Invalid product ID")
        if not updated_product.name or not updated_product.description:
            raise InvalidDataException("Name and description cannot be empty")
        if updated_product.price <= 0:
            raise InvalidDataException("Price must be greater than zero")
        if not updated_product.image_url:
            raise InvalidDataException("Image URL cannot be empty")
        if updated_product.category_id <= 0:
            raise InvalidDataException("Invalid category ID")
        if updated_product.supplier_id <= 0:
            raise InvalidDataException("Invalid supplier ID")
        if updated_product.location_id <= 0:
            raise InvalidDataException("Invalid location ID")
        
        if not self.query.check_product_exists(updated_product.product_id):
            raise NotFoundException("Product does not exist")
        
        response = self.query.execute(updated_product)
        if not response:
            raise Exception("Failed to update product")
        return True