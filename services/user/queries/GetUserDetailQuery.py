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
                full_name,
                role_name,
                is_active
            FROM users 
            LEFT JOIN roles ON users.role_id = roles.role_id
            WHERE users.user_id = %s
            AND users.is_active = TRUE
        """
        params = (user_id,)
        result = self.db.execute_query(query, params)
        self.db.close_pool()
        if not result:
            return None
        user = result[0]
        res = UserModel(
            user_id=user[0],
            username=user[1],
            email=user[2],
            full_name=user[3],
            role_name=user[4],
            is_active=user[5]
        )
        
        return res