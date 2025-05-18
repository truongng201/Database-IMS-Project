from fastapi import HTTPException
from shared_utils.database import Database
from queries.customer_queries import CustomerQueries
from models.customer import CustomerResponse, CustomerData
from shared_utils.logger import logger

class CustomerController:
    def __init__(self):
        self.db = Database()

    def get_all_customers(self) -> CustomerResponse:
        try:
            logger.info("Executing get_all_customers query")
            result = self.db.execute_query(CustomerQueries.GET_ALL_CUSTOMERS)
            logger.info(f"Got {len(result) if result else 0} customers from database")
            customers = []
            for row in result:
                customer = {
                    "customer_id": row[0],
                    "name": row[1],
                    "email": row[2],
                    "phone": row[3],
                    "address": row[4]
                }
                customers.append(customer)
            logger.info(f"Formatted {len(customers)} customers")
            return CustomerResponse(
                status="Success",
                data=customers,
                message="Get all customers successfully"
            )
        except Exception as e:
            logger.error(f"Error in get_all_customers: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    def get_customer(self, customer_id: int) -> CustomerResponse:
        try:
            logger.info(f"Executing get_customer query for ID {customer_id}")
            result = self.db.execute_query(CustomerQueries.GET_CUSTOMER_BY_ID, (customer_id,))
            logger.info(f"Got result from database: {bool(result)}")
            if not result:
                logger.info(f"No customer found with ID {customer_id}")
                return CustomerResponse(
                    status="Success",
                    data={},
                    message=f"No customer found with ID {customer_id}"
                )
            
            row = result[0]
            customer = {
                "customer_id": row[0],
                "name": row[1],
                "email": row[2],
                "phone": row[3],
                "address": row[4]
            }
            logger.info(f"Found customer with ID {customer_id}")
            return CustomerResponse(
                status="Success",
                data=customer,
                message=f"Get customer with ID {customer_id} successfully"
            )
        except Exception as e:
            logger.error(f"Error in get_customer: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    def create_customer(self, customer: dict) -> CustomerResponse:
        try:
            # Create new customer
            self.db.execute_query(
                CustomerQueries.CREATE_CUSTOMER,
                (customer["name"], customer["email"], customer["phone"], customer["address"])
            )
            
            # Get the newly created customer
            result = self.db.execute_query(CustomerQueries.GET_LAST_INSERTED_CUSTOMER)
            
            if not result:
                raise HTTPException(status_code=500, detail="Failed to create customer")

            row = result[0]
            created_customer = {
                "customer_id": row[0],
                "name": row[1],
                "email": row[2],
                "phone": row[3],
                "address": row[4]
            }
            return CustomerResponse(
                status="Success",
                data=created_customer,
                message="Customer created successfully !"
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def update_customer(self, customer_id: int, customer: CustomerData) -> CustomerResponse:
        try:
            # Check if customer exists
            existing = self.db.execute_query(CustomerQueries.GET_CUSTOMER_BY_ID, (customer_id,))
            if not existing:
                raise HTTPException(status_code=404, detail="Customer not found")

            current = existing[0]
            
            # Update only provided fields
            name = customer.name if customer.name is not None else current[1]
            email = customer.email if customer.email is not None else current[2]
            phone = customer.phone if customer.phone is not None else current[3]
            address = customer.address if customer.address is not None else current[4]

            # Check if new email already exists
            if email != current[2]:
                email_check = self.db.execute_query(CustomerQueries.GET_CUSTOMER_BY_EMAIL, (email,))
                if email_check:
                    raise HTTPException(status_code=400, detail="Email already registered")

            # Update customer
            self.db.execute_query(
                CustomerQueries.UPDATE_CUSTOMER,
                (name, email, phone, address, customer_id)
            )

            # Get updated customer
            updated = self.db.execute_query(CustomerQueries.GET_CUSTOMER_BY_ID, (customer_id,))
            row = updated[0]
            updated_customer = {
                "customer_id": row[0],
                "name": row[1],
                "email": row[2],
                "phone": row[3],
                "address": row[4]
            }
            return CustomerResponse(
                status="Success",
                data=updated_customer,
                message="Customer updated successfully"
            )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def delete_customer(self, customer_id: int) -> CustomerResponse:
        try:
            # Check if customer exists
            existing = self.db.execute_query(CustomerQueries.GET_CUSTOMER_BY_ID, (customer_id,))
            if not existing:
                raise HTTPException(status_code=404, detail="Customer not found")

            # Delete customer
            self.db.execute_query(CustomerQueries.DELETE_CUSTOMER, (customer_id,))
            return CustomerResponse(
                status="Success",
                data={},
                message="Customer deleted successfully"
            )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e)) 