from queries import GetAllUsersQuery

class GetAllUsersController:
    def __init__(self):
        self.query = GetAllUsersQuery()
        
    def execute(self, user_info: dict):
        """
        Execute the GetAllUsersQuery and return the result.
        """
        if user_info.get("role_name") != "admin":
            return []
        result = self.query.get_all_users()
        self.query.close()
        return result