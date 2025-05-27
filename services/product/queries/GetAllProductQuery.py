from shared_utils import Database

class GetAllProductQuery:
    def __init__(self):
        self.db = Database()
        
    def close(self):
        self.db.close_pool()

    def get_all_products_by_admin(self, params=(100, 0)):
        query = """
        SELECT * FROM product_summary
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