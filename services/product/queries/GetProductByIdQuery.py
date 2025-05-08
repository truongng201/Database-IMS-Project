from shared_utils import Database

class GetProductByIdQuery:
    def __init__(self):
        self.db = Database()
        
    def execute(self, product_id):
        query = """
        SELECT 
            p.product_id, 
            p.name, 
            p.description, 
            p.price, 
            p.image_url,
            c.name AS category_name, 
            s.name AS supplier_name, 
            l.name AS location_name
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
        JOIN suppliers s ON p.supplier_id = s.supplier_id
        JOIN locations l ON p.location_id = l.location_id
        WHERE p.product_id = %s
        """
        
        result = self.db.execute_query(query, (product_id,))
        if not result:
            return {}
        
        row = result[0]
        
        formatted_result = {
            "product_id": row[0],
            "name": row[1],
            "description": row[2],
            "price": row[3],
            "image_url": row[4],
            "category_name": row[5],
            "supplier_name": row[6],
            "location_name": row[7]
        }
        
        return formatted_result