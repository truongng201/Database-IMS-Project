from shared_utils import Database

class GetAllProductQuery:
    def __init__(self):
        self.db = Database()
        
    def close(self):
        self.db.close_pool()

    def get_all_products_by_admin(self, params=(100, 0)):
        query = """
        SELECT 
            p.product_id, 
            p.name, 
            p.description, 
            p.price, 
            p.image_url,
            p.quantity,
            c.category_id AS category_id,
            c.name AS category_name,
            s.supplier_id AS supplier_id,
            s.name AS supplier_name,
            w.warehouse_id AS warehouse_id,
            w.name AS warehouse_name
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
        JOIN suppliers s ON p.supplier_id = s.supplier_id
        JOIN warehouses w ON p.warehouse_id = w.warehouse_id
        ORDER BY p.product_id
        LIMIT %s OFFSET %s
        """
        result = self.db.execute_query(query, params)
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

    def get_all_product_by_user(self, user_id, params=(100, 0)):
        query = """
        SELECT 
            p.product_id, 
            p.name, 
            p.description, 
            p.price, 
            p.image_url,
            p.quantity,
            c.category_id AS category_id,
            c.name AS category_name,
            s.supplier_id AS supplier_id,
            s.name AS supplier_name,
            w.warehouse_id AS warehouse_id,
            w.name AS warehouse_name
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
        JOIN suppliers s ON p.supplier_id = s.supplier_id
        JOIN warehouses w ON p.warehouse_id = w.warehouse_id
        JOIN users u ON w.warehouse_id = u.warehouse_id
        WHERE u.user_id = %s
        ORDER BY p.product_id
        LIMIT %s OFFSET %s
        """
        query_params = (user_id, params[0], params[1])
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