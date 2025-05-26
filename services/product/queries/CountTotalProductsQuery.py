from shared_utils import Database

class CountTotalProductsQuery:
    def __init__(self):
        self.db = Database()
        

    def close(self):
        self.db.close_pool()
        
        
    def count_all_products(self):
        query = """
        SELECT COUNT(*) FROM products
        """
        result = self.db.execute_query(query)
        return result[0][0] if result else 0

    
    def count_all_products_warehouse(self, warehouse_id):
        query = """
        SELECT COUNT(*) FROM products WHERE warehouse_id = %s
        """
        result = self.db.execute_query(query, (warehouse_id,))
        return result[0][0] if result else 0