from queries import GetAllWarehousesQuery

class GetAllWarehousesController:
    def __init__(self):
        self.query = GetAllWarehousesQuery()
        
        
    def execute(self, user_info: dict):
        """
        Execute the GetAllWarehousesQuery and return the result.
        """
        if user_info.get("role_name") != "admin":
            return []
        result = self.query.get_all_warehouses()
        self.query.close()
        return result