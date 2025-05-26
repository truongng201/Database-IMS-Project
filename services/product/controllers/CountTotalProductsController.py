from queries import CountTotalProductsQuery

class CountTotalProductsController:
    def __init__(self):
        self.query = CountTotalProductsQuery()

    def execute(self, user_info):
        # Validate user_info is a dict
        if not isinstance(user_info, dict):
            self.query.close()
            raise ValueError("user_info must be a dictionary")
        # Validate role_name
        role = user_info.get('role_name')
        if not role:
            self.query.close()
            raise ValueError("Missing 'role_name' in user_info")
        try:
            if role == 'admin':
                result = self.query.count_all_products()
                self.query.close()
                return {'total_products': result}
            warehouse_id = user_info.get('warehouse_id')
            if warehouse_id is None:
                raise ValueError("Missing 'warehouse_id' for non-admin user")
            result = self.query.count_all_products_warehouse(warehouse_id)
            self.query.close()
            return {'total_products': result}
        finally:
            self.query.close()
