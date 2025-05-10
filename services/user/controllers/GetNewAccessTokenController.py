from queries import GetNewAccessTokenQuery
from shared_utils import sign_token
from shared_config.custom_exception import InvalidDataException

class GetNewAccessTokenController:
    def __init__(self):
        self.query = GetNewAccessTokenQuery()
       
       
    def execute(self, refresh_token: str):
        if not refresh_token:
            raise InvalidDataException("Invalid data provided")
        
        if not isinstance(refresh_token, str):
            raise InvalidDataException("Invalid data provided")
        
        res = self.query.execute(refresh_token)
        if not res:
            raise InvalidDataException("Invalid data provided")
        
        user_id = res.get("user_id")
        if not user_id:
            raise InvalidDataException("Invalid data provided")
        
        # Generate new access token
        access_token = sign_token({
            "user_id": user_id
        })
        return {
            "access_token": access_token,
            "refresh_token": refresh_token
        }
        