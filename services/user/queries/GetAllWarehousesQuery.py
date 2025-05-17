from shared_utils import Database

class GetAllWarehousesQuery:
    def __init__(self):
        self.db = Database()
        
        
    def get_all_warehouses(self):
        """
        Get all warehouses from the database.
        """
        query = "SELECT warehouse_id, name as warehouse_name, address as warehouse_address FROM warehouses"
        result = self.db.execute_query(query)
        if result is None:
            return []
        result = [
            {
                "warehouse_id": row[0],
                "warehouse_name": row[1],
                "warehouse_address": row[2]
            }
            for row in result
        ]
        return result
    
    def close(self):
        """
        Close the database connection.
        """
        self.db.close_pool()