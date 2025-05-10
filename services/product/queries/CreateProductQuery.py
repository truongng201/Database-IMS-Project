from shared_utils import Database
from models import ProductCreateModel

class CreateProductQuery:
    def __init__(self):
        self.db = Database()
        
    def execute(self, params: ProductCreateModel):
        query = """
        INSERT INTO products (name, description, price, image_url, category_id, supplier_id, location_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s);
        """
        
        params = (
            params.name,
            params.description,
            params.price,
            params.image_url,
            params.category_id,
            params.supplier_id,
            params.location_id
        )
        res = self.db.execute_query(query, params)
        self.db.close_pool()
        return True if res is not None else False