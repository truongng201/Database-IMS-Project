from shared_utils import Database

class ActivateUserQuery:
    def __init__(self):
        self.db = Database()
        
    
    def check_if_warehouse_exists(self, warehouse_id: int):
        """
        Check if a warehouse exists in the database.
        
        :param warehouse_id: The ID of the warehouse to check.
        :return: True if the warehouse exists, False otherwise.
        """
        query = "SELECT COUNT(*) FROM warehouses WHERE warehouse_id = %s"
        res = self.db.execute_query(query, (warehouse_id,))
        if res is None or res[0][0] == 0:
            return False
        return True
        
        
    def activate_user(self, user_id: int, warehouse_id: int):
        """
        Activate a user in the database.
        
        :param user_id: The ID of the user to activate.
        :return: None
        """
        query = """
            UPDATE users SET 
                is_active = 1,
                warehouse_id = %s
            WHERE user_id = %s"""
        res = self.db.execute_query(query, (warehouse_id, user_id))
        if res is None:
            return False
        return True
        
    def close(self):
        """
        Close the database connection.
        """
        self.db.close_pool()