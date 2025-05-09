from queries import GetProductsByCategoryQuery
from shared_config.custom_exception import NotFoundException

class GetProductsByCategoryController:
    def __init__(self):
        self.query = GetProductsByCategoryQuery()
        
    def execute(self, category_id: int):
        products = self.query.execute(category_id)
        if not products:
            raise NotFoundException("No products found for this category")
        return products