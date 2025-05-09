from queries import DeleteProductQuery
from shared_utils import logger
from shared_config.custom_exception import InvalidDataException

class DeleteProductController:
    def __init__(self):
        self.query = DeleteProductQuery()
        
    def execute(self, product_id: int) -> bool:
        if not isinstance(product_id, int) or product_id <= 0:
            raise InvalidDataException("Invalid product ID")
        
        response = self.query.execute(product_id=product_id)
        
        if not response:
            raise Exception("Failed to delete product")
        
        logger.info(f"Product with ID {product_id} deleted")
        return True