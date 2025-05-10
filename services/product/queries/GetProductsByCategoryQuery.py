from shared_utils import Database

class GetProductsByCategoryQuery:
    def __init__(self):
        self.db = Database()
        
    def execute(self, category_id: int):
        query = """
            SELECT p.product_id, p.name, p.description, p.price, c.name AS category_name
            FROM products p
            JOIN categories c ON p.category_id = c.category_id
            WHERE c.category_id = %s
        """
        params = (category_id,)
        result = self.db.execute_query(query, params)
        self.db.close_pool()
        if not result:
            return []
        products = []
        for row in result:
            product = {
                "id": row[0],
                "name": row[1],
                "description": row[2],
                "price": row[3],
                "category_name": row[4]
            }
            products.append(product)
        
        return products