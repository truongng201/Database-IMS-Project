from queries import GetUserDetailQuery
from shared_config.custom_exception import InvalidDataException, NotFoundException

class GetUserDetailController:
    def __init__(self):
        self.query = GetUserDetailQuery()
        
        
    def execute(self, user_info: dict):
        user_id = user_info.get("user_id")
        if not user_id:
            self.query.close()
            raise InvalidDataException("User ID is required")
        user = self.query.execute(user_id)
        if not user:
            self.query.close()
            raise NotFoundException("User not found")
        return user