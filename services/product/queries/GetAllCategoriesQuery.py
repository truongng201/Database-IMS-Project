from shared_utils import Database

class GetAllCategoriesQuery:
    def __init__(self):
        self.db = Database()
        
    def execute(self):
        query = """
        SELECT 
            c.category_id, 
            c.name, 
            c.description
        FROM categories c
        """
        
        result = self.db.execute_query(query)
        
        if not result:
            return []
        
        formatted_result = [
            {
                "category_id": row[0],
                "name": row[1],
                "description": row[2]
            }
            for row in result
        ]
        return formatted_result