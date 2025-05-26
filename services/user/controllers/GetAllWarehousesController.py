from queries import GetAllWarehousesQuery

class GetAllWarehousesController:
    def __init__(self):
        self.query = GetAllWarehousesQuery()
        
        
    def execute(self, user_info: dict):
        """
        Execute the GetAllWarehousesQuery and return the result.
        """
        if user_info.get("role_name") != "admin":
            warehouse_id = user_info.get("warehouse_id")
            if not warehouse_id:
                self.query.close()
                raise ValueError("User must have a valid warehouse_id to access this resource.")
            
            result = self.query.get_warehouse_by_id(warehouse_id)
            return result

        result = self.query.get_all_warehouses()
        self.query.close()
        return result