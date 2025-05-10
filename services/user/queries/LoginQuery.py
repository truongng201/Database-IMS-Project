from shared_utils import Database
from models import LoginLogModel

class LoginQuery:
    def __init__(self):
        self.db = Database()
        
        
    def get_user_by_email(self, email: str):
        query = '''SELECT 
            user_id, 
            username, 
            email, 
            password_hash 
            FROM users 
            WHERE email = %s AND is_active = True
            
        '''
        params = (email,)
        result = self.db.execute_query(query, params)
        if not result:
            return None
        result = result[0]
        res = {
            "user_id": result[0],
            "username": result[1],
            "email": result[2],
            "password_hash": result[3],
        }
        
        return res
    
    def create_login_log(self, loginlog: LoginLogModel):
        query = """
            INSERT INTO
                login_logs (user_id, refresh_token, ip_address, user_agent)
            VALUES (%s, %s, %s, %s)
        """

        params = (
            loginlog.user_id,
            loginlog.refresh_token,
            loginlog.ip_address,
            loginlog.user_agent
        )
        result = self.db.execute_query(query, params)
        self.db.close_pool()
        if result is None:
            return False
        return True