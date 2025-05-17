from shared_utils import Database
from models import UpdateUserModel

class UpdateUserQuery:
    def __init__(self):
        self.db = Database()
        
    def update_user_by_email(self, update_user: UpdateUserModel, user_email: str):
        query = """
            UPDATE users
            SET username = %s,
                image_url = %s
            WHERE email = %s
        """
        params = (
            update_user.username,
            update_user.image_url,
            user_email
        )
        res = self.db.execute_query(query, params)
        if res is None:
            return False
        return True
    
    
    def close(self):
        self.db.close_pool()