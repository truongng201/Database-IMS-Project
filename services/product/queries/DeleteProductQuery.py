from shared_utils import Database
from shared_config.custom_exception import NotFoundException

class DeleteProductQuery:
    def __init__(self):
        self.db = Database()

    def execute(self, product_id: int):
        # check if the product exists
        query = """
        SELECT p.product_id FROM products p
        WHERE p.product_id = %s;     
        """
        res = self.db.execute_query(query, (product_id,))
        if not res:
            raise NotFoundException("Product not found")
        
        # delete the product
        query = """
        DELETE FROM products
        WHERE product_id = %s;
        """
        
        params = (product_id,)
        res = self.db.execute_query(query, params)
        self.db.close_pool()
        return True if res is not None else False