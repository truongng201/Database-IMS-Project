from queries import GetUserDetailQuery
from shared_config.custom_exception import InvalidDataException

class GetUserDetailController:
    def __init__(self):
        self.query = GetUserDetailQuery()
        
        
    def execute(self, user_id: int):
        if not user_id or not isinstance(user_id, int) or user_id <= 0:
            raise InvalidDataException("Invalid user ID")
        user = self.query.execute(user_id)
        if not user:
            return None
        return user