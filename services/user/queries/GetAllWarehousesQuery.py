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
    
    def get_warehouse_by_id(self, warehouse_id):
        """
        Get a specific warehouse by its ID.
        """
        query = "SELECT warehouse_id, name as warehouse_name, address as warehouse_address FROM warehouses WHERE warehouse_id = %s"
        result = self.db.execute_query(query, (warehouse_id,))
        if not result:
            return {}
        row = result[0]
        return {
            "warehouse_id": row[0],
            "warehouse_name": row[1],
            "warehouse_address": row[2]
        }
    
    def close(self):
        """
        Close the database connection.
        """
        self.db.close_pool()