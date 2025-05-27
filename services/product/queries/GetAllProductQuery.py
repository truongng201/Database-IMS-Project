from shared_utils import Database

class GetAllProductQuery:
    def __init__(self):
        self.db = Database()
        
    def close(self):
        self.db.close_pool()

    def get_all_products_by_admin(self, params=(100, 0), search=None):
        where_conditions = []
        query_params = []
        
        # Build search conditions - search across name, category, and supplier
        if search:
            where_conditions.append("(name LIKE %s OR category_name LIKE %s OR supplier_name LIKE %s)")
            search_term = f"%{search}%"
            query_params.extend([search_term, search_term, search_term])
        
        # Build query
        query = "SELECT * FROM product_summary"
        if where_conditions:
            query += " WHERE " + " AND ".join(where_conditions)
        query += " LIMIT %s OFFSET %s"
        
        # Add limit and offset parameters
        query_params.extend([params[0], params[1]])
        
        result = self.db.execute_query(query, tuple(query_params))
        if not result:
            return []
        formatted_result = [
            {
                "product_id": row[0],
                "name": row[1],
                "description": row[2],
                "price": row[3],
                "image_url": row[4],
                "quantity": row[5],
                "category": {
                    "category_id": row[6],
                    "name": row[7]
                },
                "supplier": {
                    "supplier_id": row[8],
                    "name": row[9]
                },
                "warehouse": {
                    "warehouse_id": row[10],
                    "name": row[11]
                }
            }
            for row in result
        ]
        return formatted_result

    def get_all_product_by_warehouse(self, warehouse_id, params=(100, 0)):
        query = """
        SELECT * FROM product_summary
        WHERE warehouse_id = %s
        LIMIT %s OFFSET %s
        """
        query_params = (warehouse_id, params[0], params[1])
        result = self.db.execute_query(query, query_params)
        if not result:
            return []
        formatted_result = [
            {
                "product_id": row[0],
                "name": row[1],
                "description": row[2],
                "price": row[3],
                "image_url": row[4],
                "quantity": row[5],
                "category": {
                    "category_id": row[6],
                    "name": row[7]
                },
                "supplier": {
                    "supplier_id": row[8],
                    "name": row[9]
                },
                "warehouse": {
                    "warehouse_id": row[10],
                    "name": row[11]
                }
            }
            for row in result
        ]
        return formatted_result

    def get_all_product_by_user(self, user_id, params=(100, 0), search=None):
        # First get the user's warehouse_id
        user_query = """
        SELECT warehouse_id FROM users WHERE user_id = %s
        """
        user_result = self.db.execute_query(user_query, (user_id,))
        if not user_result:
            return []
        
        warehouse_id = user_result[0][0]
        
        where_conditions = ["warehouse_id = %s"]
        query_params = [warehouse_id]
        
        # Build search conditions - search across name, category, and supplier
        if search:
            where_conditions.append("(name LIKE %s OR category_name LIKE %s OR supplier_name LIKE %s)")
            search_term = f"%{search}%"
            query_params.extend([search_term, search_term, search_term])
        
        # Build query
        query = "SELECT * FROM product_summary WHERE " + " AND ".join(where_conditions)
        query += " LIMIT %s OFFSET %s"
        
        # Add limit and offset parameters
        query_params.extend([params[0], params[1]])
        
        result = self.db.execute_query(query, tuple(query_params))
        if not result:
            return []
        formatted_result = [
            {
                "product_id": row[0],
                "name": row[1],
                "description": row[2],
                "price": row[3],
                "image_url": row[4],
                "quantity": row[5],
                "category": {
                    "category_id": row[6],
                    "name": row[7]
                },
                "supplier": {
                    "supplier_id": row[8],
                    "name": row[9]
                },
                "warehouse": {
                    "warehouse_id": row[10],
                    "name": row[11]
                }
            }
            for row in result
        ]
        return formatted_result