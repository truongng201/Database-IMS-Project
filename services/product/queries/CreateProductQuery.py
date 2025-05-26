from shared_utils import Database
from models import ProductCreateModel

class CreateProductQuery:
    def __init__(self):
        self.db = Database()

    def create_product(self, params: ProductCreateModel):
        query = """
        INSERT INTO products (name, description, price, quantity, image_url, category_id, supplier_id, warehouse_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
        """
        
        params = (
            params.name,
            params.description,
            params.price,
            params.quantity,
            params.image_url,
            params.category_id,
            params.supplier_id,
            params.warehouse_id
        )
        res = self.db.execute_query(query, params)
        self.db.close_pool()
        return True if res is not None else False
    
    def close(self):
        self.db.close_pool()