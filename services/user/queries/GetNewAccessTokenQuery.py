from shared_utils import Database

class GetNewAccessTokenQuery:
    def __init__(self):
        self.db = Database()
        
    def execute(self, refresh_token: str):
        query = """
        SELECT user_id FROM login_logs
        WHERE refresh_token = %s
        """
        params = (refresh_token,)
        res = self.db.execute_query(query, params)
        self.db.close_pool()
        if not res:
            return False
        
        return {
            "user_id": res[0][0]
        }