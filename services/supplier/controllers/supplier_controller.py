from fastapi import HTTPException
from shared_utils.database import Database
from queries.supplier_queries import SupplierQueries
from models.supplier import SupplierResponse, SupplierData
from shared_utils.logger import logger

class SupplierController:
    def __init__(self):
        self.db = Database()

    def get_all_suppliers(self) -> SupplierResponse:
        try:
            logger.info("Executing get_all_suppliers query")
            result = self.db.execute_query(SupplierQueries.GET_ALL_SUPPLIERS)
            logger.info(f"Got {len(result) if result else 0} suppliers from database")
            suppliers = []
            for row in result:
                supplier = {
                    "supplier_id": row[0],
                    "name": row[1],
                    "contact_name": row[2],
                    "contact_email": row[3],
                    "phone": row[4]
                }
                suppliers.append(supplier)
            logger.info(f"Formatted {len(suppliers)} suppliers")
            return SupplierResponse(
                status="Success",
                data=suppliers,
                message="Get all suppliers successfully"
            )
        except Exception as e:
            logger.error(f"Error in get_all_suppliers: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    def get_supplier(self, supplier_id: int) -> SupplierResponse:
        try:
            logger.info(f"Executing get_supplier query for ID {supplier_id}")
            result = self.db.execute_query(SupplierQueries.GET_SUPPLIER_BY_ID, (supplier_id,))
            logger.info(f"Got result from database: {bool(result)}")
            if not result:
                logger.info(f"No supplier found with ID {supplier_id}")
                return SupplierResponse(
                    status="Success",
                    data={},
                    message=f"No supplier found with ID {supplier_id}"
                )
            
            row = result[0]
            supplier = {
                "supplier_id": row[0],
                "name": row[1],
                "contact_name": row[2],
                "contact_email": row[3],
                "phone": row[4]
            }
            logger.info(f"Found supplier with ID {supplier_id}")
            return SupplierResponse(
                status="Success",
                data=supplier,
                message=f"Get supplier with ID {supplier_id} successfully"
            )
        except Exception as e:
            logger.error(f"Error in get_supplier: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    def create_supplier(self, supplier: dict) -> SupplierResponse:
        try:
            # Handle backward compatibility
            contact_email = supplier.get("contact_email")
            if contact_email is None:
                contact_email = supplier.get("email")
            
            contact_name = supplier.get("contact_name", "")
            
            # Create new supplier
            self.db.execute_query(
                SupplierQueries.CREATE_SUPPLIER,
                (supplier["name"], contact_name, contact_email, supplier["phone"])
            )
            
            # Get the newly created supplier
            result = self.db.execute_query(SupplierQueries.GET_LAST_INSERTED_SUPPLIER)
            
            if not result:
                raise HTTPException(status_code=500, detail="Failed to create supplier")

            row = result[0]
            created_supplier = {
                "supplier_id": row[0],
                "name": row[1],
                "contact_name": row[2],
                "contact_email": row[3],
                "phone": row[4]
            }
            return SupplierResponse(
                status="Success",
                data=created_supplier,
                message="Supplier created successfully !"
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
            
    def update_supplier(self, supplier_id: int, supplier: SupplierData) -> SupplierResponse:
        try:
            # Check if supplier exists
            existing = self.db.execute_query(SupplierQueries.GET_SUPPLIER_BY_ID, (supplier_id,))
            if not existing:
                raise HTTPException(status_code=404, detail="Supplier not found")

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

            # Check if new email already exists
            if contact_email != current[3]:
                email_check = self.db.execute_query(SupplierQueries.GET_SUPPLIER_BY_EMAIL, (contact_email,))
                if email_check:
                    raise HTTPException(status_code=400, detail="Email already registered")

            # Update supplier
            self.db.execute_query(
                SupplierQueries.UPDATE_SUPPLIER,
                (name, contact_name, contact_email, phone, supplier_id)
            )

            # Get updated supplier
            updated = self.db.execute_query(SupplierQueries.GET_SUPPLIER_BY_ID, (supplier_id,))
            row = updated[0]
            updated_supplier = {
                "supplier_id": row[0],
                "name": row[1],
                "contact_name": row[2],
                "contact_email": row[3],
                "phone": row[4]
            }
            return SupplierResponse(
                status="Success",
                data=updated_supplier,
                message="Supplier updated successfully"
            )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def delete_supplier(self, supplier_id: int) -> SupplierResponse:
        try:
            # Check if supplier exists
            existing = self.db.execute_query(SupplierQueries.GET_SUPPLIER_BY_ID, (supplier_id,))
            if not existing:
                raise HTTPException(status_code=404, detail="Supplier not found")

            # Delete supplier
            self.db.execute_query(SupplierQueries.DELETE_SUPPLIER, (supplier_id,))
            return SupplierResponse(
                status="Success",
                data={},
                message="Supplier deleted successfully"
            )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e)) 