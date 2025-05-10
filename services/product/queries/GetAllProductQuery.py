from shared_utils import Database

class GetAllProductQuery:
    def __init__(self):
        self.db = Database()
        
    def execute(self, params=(100, 0)):
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
        LIMIT %s OFFSET %s
        """
        
        result = self.db.execute_query(query, params)
        self.db.close_pool()
        if not result:
            return []
        
        formatted_result = [
            {
                "product_id": row[0],
                "name": row[1],
                "description": row[2],
                "price": row[3],
                "image_url": row[4],
                "category_name": row[5],
                "supplier_name": row[6],
                "location_name": row[7]
            }
            for row in result
        ]
        return formatted_result