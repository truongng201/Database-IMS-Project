from shared_utils import Database

class DeactivateUserQuery:
    def __init__(self):
        self.db = Database()
        
    def check_if_user_exists(self, user_id: int) -> bool:
        """
        Check if a user exists in the database.

        :param user_id: The ID of the user to check.
        :return: True if the user exists, False otherwise.
        """
        query = "SELECT * FROM users WHERE user_id = %s"
        res = self.db.execute_query(query, (user_id,))
        if res is None or len(res) == 0:
            return False
        return True


    def deactivate_user(self, user_id: int):
        """
        Deactivate a user in the database.

        :param user_id: The ID of the user to deactivate.
        :return: None
        """
        query = """
            UPDATE users SET 
                is_active = 0
            WHERE user_id = %s
            """
        res = self.db.execute_query(query, (user_id,))
        if res is None:
            return False
        return True
        
    def close(self):
        """
        Close the database connection.
        """
        self.db.close_pool()