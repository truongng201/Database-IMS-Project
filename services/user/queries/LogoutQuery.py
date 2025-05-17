from shared_utils import Database

class LogoutQuery:
    def __init__(self):
        self.db = Database()
        
        
    def check_if_refresh_token_exists(self, user_id, refresh_token):
        query = """
        SELECT * FROM login_logs
        WHERE user_id = %s AND refresh_token = %s
        """
        params = (user_id, refresh_token)
        res = self.db.execute_query(query, params)
        if not res:
            return False
        return True
        
        
    def delete_refresh_token(self, user_id, refresh_token):
        query = """
        DELETE FROM login_logs
        WHERE user_id = %s AND refresh_token = %s
        """
        params = (user_id, refresh_token)
        res = self.db.execute_query(query, params)
        if res is None:
            return False
        return True
    
    def close(self):
        self.db.close_pool()