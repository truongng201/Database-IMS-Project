from shared_utils import Database
from models import UserModel

class GetUserDetailQuery:
    def __init__(self):
        self.db = Database()
        
    
    def execute(self, user_id: str):
        query = """
            SELECT 
                user_id,
                username,
                email,
                role_name,
                image_url,
                users.warehouse_id as warehouse_id,
                warehouses.name as warehouse_name,
                warehouses.address as warehouse_address
            FROM users 
            LEFT JOIN warehouses ON users.warehouse_id = warehouses.warehouse_id
            WHERE users.user_id = %s
            AND users.is_active = TRUE
        """
        params = (user_id,)
        result = self.db.execute_query(query, params)
        if not result:
            return None
        user = result[0]
        res = UserModel(
            user_id=user[0],
            username=user[1],
            email=user[2],
            role_name=user[3],
            image_url=user[4],
            warehouse_id=user[5],
            warehouse_name=user[6],
            warehouse_address=user[7]
        )
        
        return res
    
    def close(self):
        self.db.close_pool()