from queries import ActivateUserQuery
from shared_config.custom_exception import UnauthorizedException, InvalidDataException, BadRequestException, NotFoundException

class ActivateUserController:
    def __init__(self):
        self.query = ActivateUserQuery()

    def execute(self, warehouse_id: int, user_id: int, user_info: dict):
        """
        Activate a user in the system.

        :param warehouse_id: The ID of the warehouse to activate.
        :param user_info: The information of the user making the request.
        :return: None
        """
        # Logic to activate the user goes here

        if not user_info or user_info.get("role_name") != "admin":
            self.query.close()
            raise UnauthorizedException("You are not authorized to perform this action.")
        
        if not warehouse_id:
            self.query.close()
            raise InvalidDataException("Warehouse ID is required.")    
        
        if not isinstance(warehouse_id, int):
            self.query.close()
            raise InvalidDataException("Warehouse ID must be an integer.")
        
        if not self.query.check_if_warehouse_exists(warehouse_id):
            self.query.close()
            raise NotFoundException("Warehouse ID does not exist.")
        
        if not isinstance(user_id, int):
            self.query.close()
            raise InvalidDataException("User ID must be an integer.")

        result = self.query.activate_user(user_id, warehouse_id)
        self.query.close()
        if not result:
            raise BadRequestException("Failed to activate user.")
        return {}