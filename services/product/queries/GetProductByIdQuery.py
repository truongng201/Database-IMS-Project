from shared_utils import Database

class GetProductByIdQuery:
    def __init__(self):
        self.db = Database()
        
    def close(self):
        self.db.close_pool()
        
    def execute(self, product_id):
        query = """
        SELECT 
            p.product_id, 
            p.name, 
            p.description, 
            p.price, 
            p.quantity,
            p.image_url,
            c.name AS category_name, 
            s.name AS supplier_name, 
            w.name AS warehouse_name
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
        JOIN suppliers s ON p.supplier_id = s.supplier_id
        JOIN warehouses w ON p.warehouse_id = w.warehouse_id
        WHERE p.product_id = %s
        """
        
        result = self.db.execute_query(query, (product_id,))
        self.db.close_pool()
        if not result:
            return {}
        
        row = result[0]
        
        formatted_result = {
            "product_id": row[0],
            "name": row[1],
            "description": row[2],
            "price": row[3],
            "quantity": row[4],
            "image_url": row[5],
            "category_name": row[6],
            "supplier_name": row[7],
            "warehouse_name": row[8]
        }
        
        return formatted_result