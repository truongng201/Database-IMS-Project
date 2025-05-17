from queries import GetNewAccessTokenQuery
from shared_utils import sign_token
from shared_config.custom_exception import InvalidDataException

class GetNewAccessTokenController:
    def __init__(self):
        self.query = GetNewAccessTokenQuery()
       
       
    def execute(self, refresh_token: str):
        if not refresh_token:
            self.query.close()
            raise InvalidDataException("Invalid data provided")
        
        if not isinstance(refresh_token, str):
            self.query.close()
            raise InvalidDataException("Invalid data provided")
        
        user = self.query.execute(refresh_token)
        self.query.close()
        if not user:
            raise InvalidDataException("Invalid data provided")
        
        # Generate new access token
        access_token = sign_token(user)
        return {
            "access_token": access_token,
            "refresh_token": refresh_token
        }
        
    def close(self):
        self.query.close()