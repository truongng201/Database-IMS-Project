from shared_utils import Database

class GetNewAccessTokenQuery:
    def __init__(self):
        self.db = Database()
        
    def execute(self, refresh_token: str):
        query = """
        SELECT 
            users.user_id as user_id,
            users.email as email,
            users.role_name as role_name,
            users.warehouse_id as warehouse_id
        FROM login_logs
        LEFT JOIN users ON login_logs.user_id = users.user_id
        WHERE refresh_token = %s
        """
        params = (refresh_token,)
        res = self.db.execute_query(query, params)
        self.db.close_pool()
        if not res:
            return False
        
        return {
            "user_id": res[0][0],
            "email": res[0][1],
            "role_name": res[0][2],
            "warehouse_id": res[0][3]
        }

    def close(self):
        self.db.close_pool()