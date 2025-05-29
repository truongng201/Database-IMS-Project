from queries import GetProductByIdQuery
from models import ProductModel
from shared_config.custom_exception import NotFoundException, InvalidDataException

class GetProductByIdController:
    def __init__(self):
        self.query = GetProductByIdQuery()
    
    def execute(self, product_id: int) -> ProductModel:
        if not isinstance(product_id, int) or product_id <= 0:
            self.query.close()
            raise InvalidDataException("Invalid product ID")
        response = self.query.execute(product_id=product_id)
        self.query.close()
        if not response:
            raise NotFoundException("Product not found")
        # Convert Decimal to float for price if needed
        price = float(response.get("price")) if response.get("price") is not None else None
        return ProductModel(
            product_id=response.get("product_id"),
            name=response.get("name"),
            description=response.get("description"),
            price=price,
            quantity=response.get("quantity"),
            image_url=response.get("image_url"),
            category={"name": response.get("category_name")},
            supplier={"name": response.get("supplier_name")},
            warehouse={"name": response.get("warehouse_name")}
        )

