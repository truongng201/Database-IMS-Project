from queries import GetAllProductQuery
from models import ProductListModel

class GetAllProductController:
    def __init__(self):
        self.query = GetAllProductQuery()
    
    def execute(self) -> ProductListModel:
        response = self.query.execute()
        if not response:
            return ProductListModel(products=[])
        
        return ProductListModel(products=response)
        
        