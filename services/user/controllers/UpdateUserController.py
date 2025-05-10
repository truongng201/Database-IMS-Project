from queries import UpdateUserQuery
from models import UpdateUserModel
from shared_config.custom_exception import InvalidDataException, BadRequestException
import re

class UpdateUserController:
    def __init__(self):
        self.query = UpdateUserQuery()
        
    def execute(self, update_user: UpdateUserModel, user_id: int):
        if not update_user or not isinstance(update_user, UpdateUserModel):
            raise InvalidDataException("Invalid user data")
        
        if not user_id or not isinstance(user_id, int) or user_id <= 0:
            raise InvalidDataException("Invalid user ID")
        
        if not update_user.username \
            or not isinstance(update_user.username, str) \
            or not re.match(r'^[a-zA-Z0-9_]+$', update_user.username):
            raise InvalidDataException("Invalid username")
        
        if not update_user.full_name \
            or not isinstance(update_user.full_name, str) \
            or not re.match(r'^[a-zA-Z\s]+$', update_user.full_name):
            raise InvalidDataException("Invalid full name")
        if not update_user.role_id \
            or not isinstance(update_user.role_id, int) \
            or update_user.role_id <= 0:
            raise InvalidDataException("Invalid role ID")
        if not isinstance(update_user.is_active, bool):
            raise InvalidDataException("Invalid is_active value")
        
        res = self.query.execute(update_user, user_id)
        if not res:
            raise BadRequestException("Failed to update user")
        
        return True
        
        