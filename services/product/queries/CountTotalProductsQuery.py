from shared_utils import Database

class CountTotalProductsQuery:
    def __init__(self):
        self.db = Database()
        

    def close(self):
        self.db.close_pool()
        
        
    def count_all_products(self, search: str = None):
        if search:
            query = """
            SELECT COUNT(*) FROM product_summary 
            WHERE name LIKE %s OR category_name LIKE %s OR supplier_name LIKE %s
            """
            search_term = f"%{search}%"
            result = self.db.execute_query(query, (search_term, search_term, search_term))
        else:
            query = """
            SELECT COUNT(*) FROM products
            """
            result = self.db.execute_query(query)
        return result[0][0] if result else 0

    
    def count_all_products_warehouse(self, warehouse_id, search: str = None):
        if search:
            query = """
            SELECT COUNT(*) FROM product_summary 
            WHERE warehouse_id = %s AND (name LIKE %s OR category_name LIKE %s OR supplier_name LIKE %s)
            """
            search_term = f"%{search}%"
            result = self.db.execute_query(query, (warehouse_id, search_term, search_term, search_term))
        else:
            query = """
            SELECT COUNT(*) FROM products WHERE warehouse_id = %s
            """
            result = self.db.execute_query(query, (warehouse_id,))
        return result[0][0] if result else 0