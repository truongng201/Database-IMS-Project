from queries import CreateProductQuery
from models import ProductCreateModel
from shared_utils import logger
from shared_config.custom_exception import InvalidDataException



class CreateProductController:
    def __init__(self):
        self.query = CreateProductQuery()
    
    def execute(self, product: ProductCreateModel):
        if not isinstance(product, ProductCreateModel):
            self.query.close()
            raise InvalidDataException("Invalid product data")
        if not product.name or not product.description or product.price is None:
            self.query.close()
            raise InvalidDataException("Name, description, and price cannot be empty")
        if product.price <= 0:
            self.query.close()
            raise InvalidDataException("Price must be greater than zero")
        if product.quantity is None or product.quantity < 0:
            self.query.close()
            raise InvalidDataException("Quantity must be zero or greater")
        if not product.image_url:
            self.query.close()
            raise InvalidDataException("Image URL cannot be empty")
        if product.category_id <= 0:
            self.query.close()
            raise InvalidDataException("Invalid category ID")
        if product.supplier_id <= 0:
            self.query.close()
            raise InvalidDataException("Invalid supplier ID")
        if product.warehouse_id <= 0:
            self.query.close()
            raise InvalidDataException("Invalid warehouse ID")

        response = self.query.create_product(product)
        if not response:
            self.query.close()
            raise Exception("Failed to create product")

        logger.info(f"Product created with name: {product.name}")
        return True


