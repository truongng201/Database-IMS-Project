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
                    "id": row[0],
                    "name": row[1],
                    "email": row[2],
                    "phone": row[3],
                    "address": row[4]
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
                "id": row[0],
                "name": row[1],
                "email": row[2],
                "phone": row[3],
                "address": row[4]
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
            # Create new supplier
            result = self.db.execute_query(
                SupplierQueries.CREATE_SUPPLIER,
                (supplier["name"], supplier["email"], supplier["phone"], supplier["address"])
            )
            
            if not result:
                raise HTTPException(status_code=500, detail="Failed to create supplier")

            row = result[0]
            created_supplier = {
                "id": row[0],
                "name": row[1],
                "email": row[2],
                "phone": row[3],
                "address": row[4]
            }
            return SupplierResponse(
                status="Success",
                data=created_supplier,
                message="Supplier created successfully !"
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e)) 