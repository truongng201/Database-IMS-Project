from shared_utils import Database
from models import ProductUpdateModel

class UpdateProductQuery:
    def __init__(self):
        self.db = Database()
        
    def check_product_exists(self, product_id: int):
        query = """
        SELECT p.product_id FROM products p
        WHERE p.product_id = %s;     
        """
        res = self.db.execute_query(query, (product_id,))
        if not res:
            return False
        return True
    
    def update_product(self, updated_product: ProductUpdateModel):
        # Build dynamic update query based on provided fields
        fields = []
        params = []
        if updated_product.name is not None:
            fields.append("name = %s")
            params.append(updated_product.name)
        if updated_product.description is not None:
            fields.append("description = %s")
            params.append(updated_product.description)
        if updated_product.price is not None:
            fields.append("price = %s")
            params.append(updated_product.price)
        if updated_product.quantity is not None:
            fields.append("quantity = %s")
            params.append(updated_product.quantity)
        if updated_product.image_url is not None:
            fields.append("image_url = %s")
            params.append(updated_product.image_url)
        if updated_product.category_id is not None:
            fields.append("category_id = %s")
            params.append(updated_product.category_id)
        if updated_product.supplier_id is not None:
            fields.append("supplier_id = %s")
            params.append(updated_product.supplier_id)
        if updated_product.warehouse_id is not None:
            fields.append("warehouse_id = %s")
            params.append(updated_product.warehouse_id)
        
        if not fields:
            return False  # Nothing to update
        
        query = f"""
        UPDATE products
        SET {', '.join(fields)}
        WHERE product_id = %s;
        """
        params.append(updated_product.product_id)
        res = self.db.execute_query(query, tuple(params))
        self.db.close_pool()
        return True if res is not None else False
    
    def close(self):
        self.db.close_pool()