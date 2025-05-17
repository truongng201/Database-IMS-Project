from queries import UpdateUserQuery
from models import UpdateUserModel
from shared_config.custom_exception import InvalidDataException, BadRequestException
from shared_utils import logger
import re

class UpdateUserController:
    def __init__(self):
        self.query = UpdateUserQuery()
        
    def execute(self, update_user: UpdateUserModel, user_info: dict):
        user_id = user_info.get("user_id")
        user_email = user_info.get("email")
        
        if not user_id or not isinstance(user_id, int) or user_id <= 0:
            self.query.close()
            raise InvalidDataException("Invalid user ID")
        
        if not update_user.username \
            or not isinstance(update_user.username, str) \
            or not re.match(r'^[a-zA-Z0-9_]+$', update_user.username):
            self.query.close()
            raise InvalidDataException("Invalid username")
        
        
        res = self.query.update_user_by_email(update_user, user_email)
        logger.info(f"Update user by email: {user_email} with data: {update_user}")
        self.query.close()
        if not res:
            raise BadRequestException("Failed to update user")
        return True
        
        