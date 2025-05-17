from queries import LogoutQuery
from shared_config.custom_exception import InvalidDataException
from shared_utils import Cache


EXPIRATION_TIME = 60 * 60 # 1 hour

class LogoutController:
    def __init__(self):
        self.query = LogoutQuery()
        self.cache = Cache()
        
    
    def execute(self, user_info, refresh_token, access_token):
        user_id = user_info.get("user_id")
        if not user_id or not refresh_token:
            self.query.close()
            raise InvalidDataException("Invalid data provided")
        
        if not isinstance(user_id, int):
            self.query.close()
            raise InvalidDataException("Invalid data provided")
        
        if not isinstance(refresh_token, str):
            self.query.close()
            raise InvalidDataException("Invalid data provided")
        
        if not self.query.check_if_refresh_token_exists(user_id, refresh_token):
            self.query.close()
            raise InvalidDataException("Invalid data provided")
        
        res = self.query.delete_refresh_token(user_id, refresh_token)
        if not res:
            self.query.close()
            raise Exception("Failed to delete refresh token")
        
        # Add the access token to the cache as blacklist
        self.cache.set(access_token, user_id, ttl=EXPIRATION_TIME)
        
        return True