from queries import GetAllProductQuery
from models import ProductListResponseModel

class GetAllProductController:
    def __init__(self):
        self.query = GetAllProductQuery()
    
    def execute(self) -> ProductListResponseModel:
        response = self.query.execute()
        if not response:
            return ProductListResponseModel(products=[])
        
        return ProductListResponseModel(products=response)
        
        