from shared_utils import Database
from models import UpdateUserModel

class UpdateUserQuery:
    def __init__(self):
        self.db = Database()
        
    def execute(self, update_user: UpdateUserModel, user_id: int):
        query = """
            UPDATE users
            SET username = %s,
                full_name = %s,
                role_id = %s,
                is_active = %s
            WHERE user_id = %s
        """
        params = (
            update_user.username,
            update_user.full_name,
            update_user.role_id,
            update_user.is_active,
            user_id
        )
        res = self.db.execute_query(query, params)
        self.db.close_pool()
        if res is None:
            return False
        return True