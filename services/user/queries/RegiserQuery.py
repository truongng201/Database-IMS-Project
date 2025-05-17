from shared_utils import Database
from models import RegisterModel

class RegisterQuery:
    def __init__(self):
        self.db = Database()
        
    
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
                users (email, password_hash, username, image_url)
            VALUES (%s, %s, %s, %s)
        """
        # dicebear 
        random_image_url = "https://api.dicebear.com/9.x/identicon/svg?seed=" + payload.username
        params = (
            payload.email,
            payload.password,
            payload.username,
            random_image_url
        )
        result = self.db.execute_query(query, params)
        if result is None:
            return False
        return True
    
    def close(self):
        self.db.close_pool()