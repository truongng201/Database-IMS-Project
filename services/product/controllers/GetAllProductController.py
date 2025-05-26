from queries import GetAllProductQuery
from models import ProductListModel
from shared_config.custom_exception import InvalidDataException

class GetAllProductController:
    def __init__(self):
        self.query = GetAllProductQuery()

    def execute(self, limit: int, offset: int, user_info) -> ProductListModel:
        if not isinstance(limit, int) or not isinstance(offset, int):
            self.query.close()
            raise InvalidDataException("Limit and offset must be integers.")
        
        if limit > 100:
            raise InvalidDataException("Limit 100 product max per request")
        
        role_name = user_info.get("role_name")
        user_id = user_info.get("user_id")
        
        if role_name not in ("admin", "staff"):
            raise InvalidDataException("User role invalid")

        if role_name == "admin":
            response = self.query.get_all_products_by_admin(params=(limit, offset))
            self.query.close()
        elif role_name == "staff":
            response = self.query.get_all_product_by_user(user_id, params=(limit, offset))
            self.query.close()

        if not response:
            return ProductListModel(products=[])
        return ProductListModel(products=response)

