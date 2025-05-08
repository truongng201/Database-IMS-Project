from queries import CreateProductQuery
from models import ProductCreateModel
from shared_utils import logger



class CreateProductController:
    def __init__(self):
        self.query = CreateProductQuery()
    
    def execute(self, product: ProductCreateModel):
        response = self.query.execute(product)
        logger.debug(f"This line")
        if not response:
            return False
        return True
        
        
        