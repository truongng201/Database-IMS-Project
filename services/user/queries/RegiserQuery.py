from shared_utils import Database
from models import RegisterModel

class RegisterQuery:
    def __init__(self):
        self.db = Database()
        
        
    def check_role_exists(self, role_id: int):
        query = '''SELECT 
            role_id, 
            role_name 
            FROM roles 
            WHERE role_id = %s
        '''
        params = (role_id,)
        result = self.db.execute_query(query, params)
        if not result:
            return False
        return True
        
    
    def check_email_exists(self, email: str):
        query = '''SELECT 
            user_id, 
            username, 
            email, 
            password_hash 
            FROM users 
            WHERE email = %s
        '''
        params = (email,)
        result = self.db.execute_query(query, params)
        if not result:
            return False
        return True
    
    def create_user(self, payload: RegisterModel):
        query = """
            INSERT INTO
                users (email, password_hash, username, full_name, role_id, is_active)
            VALUES (%s, %s, %s, %s, %s, %s)
        """

        params = (
            payload.email,
            payload.password,
            payload.username,
            payload.full_name,
            payload.role_id,
            True
        )
        result = self.db.execute_query(query, params)
        self.db.close_pool()
        if result is None:
            return False
        return True