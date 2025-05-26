from shared_utils.database import Database
from queries.supplier_queries import SupplierQueries
from models.supplier import SupplierResponse, SupplierData
from shared_utils.logger import logger
from shared_config.custom_exception import InvalidDataException, NotFoundException

class SupplierController:
    def __init__(self):
        self.db = Database()

    def get_all_suppliers(self, user_info: dict) -> list:
        # Validate user_info is a dict
        if not isinstance(user_info, dict):
            self.db.close_pool()
            raise InvalidDataException("User info must be a dictionary")
        warehouse_id = user_info.get("warehouse_id")
        role_name = user_info.get("role_name")
        if not warehouse_id or not role_name:
            self.db.close_pool()
            raise InvalidDataException("Warehouse ID and role name must be provided in user info")
        if role_name not in ("admin", "staff"):
            self.db.close_pool()
            raise InvalidDataException("User role must be either 'admin' or 'staff'")
        
        
        if role_name == "admin":
            result = self.db.execute_query(SupplierQueries.GET_ALL_SUPPLIERS)
            self.db.close_pool()
            suppliers = []
            for row in result:
                supplier = {
                    "supplier_id": row[2],
                    "supplier_name": row[3],
                    "contact_name": row[4],
                    "contact_email": row[5],
                    "phone": row[6],
                    "total_products": row[7],
                    "total_product_quantity": row[8],
                    "avg_product_price": row[9],
                    "earliest_product_created": row[10],
                    "latest_product_updated": row[11],
                    "supplier_created_time": row[12],
                    "supplier_updated_time": row[13]
                }
                if suppliers and suppliers[-1]["supplier_id"] == supplier["supplier_id"]:
                    # If the supplier already exists in the list, skip adding it again
                    continue
                suppliers.append(supplier)
            return suppliers
        
        elif role_name == "staff":
            result = self.db.execute_query(SupplierQueries.GET_ALL_SUPPLIERS_BY_WAREHOUSE_ID, (warehouse_id,))
            self.db.close_pool()
            suppliers = []
            for row in result:
                supplier = {
                    "supplier_id": row[2],
                    "supplier_name": row[3],
                    "contact_name": row[4],
                    "contact_email": row[5],
                    "phone": row[6],
                    "total_products": row[7],
                    "total_product_quantity": row[8],
                    "avg_product_price": row[9],
                    "earliest_product_created": row[10],
                    "latest_product_updated": row[11],
                    "supplier_created_time": row[12],
                    "supplier_updated_time": row[13]
                }
                suppliers.append(supplier)
            return suppliers
        return []

    def get_supplier(self, supplier_id: int, user_info: dict) -> dict:
        # Validate user_info is a dict
        if not isinstance(user_info, dict):
            self.db.close_pool()
            raise InvalidDataException("User info must be a dictionary")
        user_id = user_info.get("user_id")
        role_name = user_info.get("role_name")
        if not user_id or not role_name:
            self.db.close_pool()
            raise InvalidDataException("User ID and role name must be provided in user info")
        if role_name not in ("admin", "staff"):
            self.db.close_pool()
            raise InvalidDataException("User role must be either 'admin' or 'staff'")
        # Check if supplier_id is valid
        if not isinstance(supplier_id, int) or supplier_id <= 0:
            self.db.close_pool()
            raise InvalidDataException("Invalid supplier ID")
        # Fetch supplier by ID
        if role_name == "admin":
            result = self.db.execute_query(SupplierQueries.GET_ALL_SUPPLIERS_WITH_PRODUCTS, (supplier_id,))
            self.db.close_pool()
            if not result:
                raise NotFoundException(f"Supplier with ID {supplier_id} not found")
            supplier = {
                "supplier_id": result[0][3],
                "supplier_name": result[0][4],
                "contact_name": result[0][5],
                "contact_email": result[0][6],
                "phone": result[0][7],
                "products": []
            }
            for row in result:
                product = {
                    "product_id": row[8],
                    "product_name": row[9],
                    "description": row[10],
                    "price": row[11],
                    "quantity": row[12],
                    "category_id": row[13],
                    "category_name": row[14],
                    "product_created_time": row[15],
                    "product_updated_time": row[16]
                }
                supplier["products"].append(product)
            return supplier
        elif role_name == "staff":
            result = self.db.execute_query(SupplierQueries.GET_SUPPLIER_WITH_PRODUCTS_BY_ID, (supplier_id, user_id))
            self.db.close_pool()
            if not result:
                raise NotFoundException(f"Supplier with ID {supplier_id} not found")
            supplier = {
                "supplier_id": result[0][3],
                "supplier_name": result[0][4],
                "contact_name": result[0][5],
                "contact_email": result[0][6],
                "phone": result[0][7],
                "products": []
            }
            for row in result:
                product = {
                    "product_id": row[8],
                    "product_name": row[9],
                    "description": row[10],
                    "price": row[11],
                    "quantity": row[12],
                    "category_id": row[13],
                    "category_name": row[14],
                    "product_created_time": row[15],
                    "product_updated_time": row[16]
                }
                supplier["products"].append(product)
            return supplier
        return {}

    def create_supplier(self, supplier: dict):
        # Handle backward compatibility
        name = supplier.get("name")
        contact_email = supplier.get("contact_email")
        contact_name = supplier.get("contact_name")
        phone = supplier.get("phone")
        
        # at least one of contact_email or phone must be provided
        if not contact_email and not phone:
            raise InvalidDataException("At least one of contact_email or phone must be provided")
        if not contact_name:
            raise InvalidDataException("Contact name must be provided")
        
        # Create new supplier
        res = self.db.execute_query(
            SupplierQueries.CREATE_SUPPLIER,
            (name, contact_name, contact_email, phone)
        )
        self.db.close_pool()
        if  res:
            raise Exception("Failed to create supplier")
        return {}
        
        
    def update_supplier(self, supplier_id: int, supplier: SupplierData):
        # Check if supplier exists
        existing = self.db.execute_query(SupplierQueries.CHECK_SUPPLIER_EXISTS, (supplier_id,))
        if not existing:
            self.db.close_pool()
            raise NotFoundException(f"Supplier with ID {supplier_id} not found")

        current = existing[0]
        
        # Update only provided fields
        name = supplier.name if supplier.name is not None else current[1]
        contact_name = supplier.contact_name if supplier.contact_name is not None else current[2]
        
        # Handle backward compatibility for email
        contact_email = supplier.contact_email
        if contact_email is None and supplier.email is not None:
            contact_email = supplier.email
        if contact_email is None:
            contact_email = current[3]
            
        phone = supplier.phone if supplier.phone is not None else current[4]

        # Update supplier
        res = self.db.execute_query(
            SupplierQueries.UPDATE_SUPPLIER,
            (name, contact_name, contact_email, phone, supplier_id)
        )

        self.db.close_pool() 
        if not res:
            raise Exception("Failed to update supplier")       
        return {}
        

    def delete_supplier(self, supplier_id: int):
        # Check if supplier exists
        existing = self.db.execute_query(SupplierQueries.CHECK_SUPPLIER_EXISTS, (supplier_id,))
        if not existing:
            self.db.close_pool()
            raise NotFoundException(f"Supplier with ID {supplier_id} not found")
       
        # Delete supplier
        res = self.db.execute_query(SupplierQueries.DELETE_SUPPLIER, (supplier_id,))
        self.db.close_pool()
        if not res:
            raise Exception("Failed to delete supplier")
        return {}
    
    def count_suppliers(self, user_info: dict) -> int:
        # Validate user_info is a dict
        if not isinstance(user_info, dict):
            self.db.close_pool()
            raise InvalidDataException("User info must be a dictionary")
        warehouse_id = user_info.get("warehouse_id")
        role_name = user_info.get("role_name")
        if not warehouse_id or not role_name:
            self.db.close_pool()
            raise InvalidDataException("Warehouse ID and role name must be provided in user info")
        if role_name not in ("admin", "staff"):
            self.db.close_pool()
            raise InvalidDataException("User role must be either 'admin' or 'staff'")
        
        if role_name == "admin":
            result = self.db.execute_query(SupplierQueries.GET_ALL_SUPPLIERS)
            suppliers = []
            if not result:
                self.db.close_pool()
                return 0
            # Count unique suppliers
            unique_supplier_ids = set(row[2] for row in result)
            self.db.close_pool()
            return len(unique_supplier_ids)
                
        else:
            result = self.db.execute_query(SupplierQueries.GET_ALL_SUPPLIERS_BY_WAREHOUSE_ID, (warehouse_id,))
            if not result:
                self.db.close_pool()
                return 0
            unique_supplier_ids = set(row[2] for row in result)
            self.db.close_pool()
            return len(unique_supplier_ids)
        return 0