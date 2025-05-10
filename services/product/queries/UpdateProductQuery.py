from shared_utils import Database
from models import ProductUpdateModel

class UpdateProductQuery:
    def __init__(self):
        self.db = Database()
        
    def check_product_exists(self, product_id: int):
        query = """
        SELECT p.product_id FROM products p
        WHERE p.product_id = %s;     
        """
        res = self.db.execute_query(query, (product_id,))
        if not res:
            self.db.close_pool()
            return False
        return True
        
    def execute(self, updated_product: ProductUpdateModel):
        query = """
        UPDATE products
        SET name = %s, description = %s, price = %s, image_url = %s, category_id = %s, supplier_id = %s, location_id = %s
        WHERE product_id = %s;
        """
        
        params = (
            updated_product.name,
            updated_product.description,
            updated_product.price,
            updated_product.image_url,
            updated_product.category_id,
            updated_product.supplier_id,
            updated_product.location_id,
            updated_product.product_id
        )
        res = self.db.execute_query(query, params)
        self.db.close_pool()
        return True if res is not None else False