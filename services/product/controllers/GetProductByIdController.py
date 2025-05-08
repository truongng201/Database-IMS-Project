from queries import GetProductByIdQuery
from models import ProductResponseModel

class GetProductByIdController:
    def __init__(self):
        self.query = GetProductByIdQuery()
    
    def execute(self, product_id: int) -> ProductResponseModel:
        if not isinstance(product_id, int) or product_id <= 0:
            raise ValueError("Invalid product ID")
        response = self.query.execute(product_id=product_id)
        if not response:
            return None
        
        return ProductResponseModel(
            product_id=response.get("product_id"),
            name=response.get("name"),
            description=response.get("description"),
            price=response.get("price"),
            image_url=response.get("image_url"),
            category_name=response.get("category_name"),
            supplier_name=response.get("supplier_name"),
            location_name=response.get("location_name"),
        )
        
        