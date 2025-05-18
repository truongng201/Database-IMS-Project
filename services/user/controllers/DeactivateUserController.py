from queries import DeactivateUserQuery
from shared_config.custom_exception import UnauthorizedException, InvalidDataException, BadRequestException, NotFoundException

class DeactivateUserController:
    def __init__(self):
        self.query = DeactivateUserQuery()

    def execute(self, user_id: int, user_info: dict):
        """
        Deactivate a user in the system.

        :param user_id: The ID of the user to deactivate.
        :param user_info: The information of the user making the request.
        :return: None
        """
        # Logic to deactivate the user goes here

        if not user_info or user_info.get("role_name") != "admin":
            self.query.close()
            raise UnauthorizedException("You are not authorized to perform this action.")
        
        if not isinstance(user_id, int):
            self.query.close()
            raise InvalidDataException("User ID must be an integer.")
        
        if user_info.get("user_id") == user_id:
            self.query.close()
            raise InvalidDataException("You cannot deactivate an admin user.")
        if not self.query.check_if_user_exists(user_id):
            self.query.close()
            raise NotFoundException("User ID does not exist.")
        result = self.query.deactivate_user(user_id)
        self.query.close()
        if not result:
            raise BadRequestException("Failed to deactivate user.")
        return {}