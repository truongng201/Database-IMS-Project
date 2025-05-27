from shared_utils.database import Database
from queries.customer_queries import CustomerQueries
from models.customer import CustomerResponse, CustomerData
from shared_utils.logger import logger
from shared_config.custom_exception import InvalidDataException, NotFoundException

class CustomerController:
    def __init__(self):
        self.db = Database()

    def get_all_customers(self, search: str = None):
        search = search.strip() if search else None
        if search and not isinstance(search, str):
            raise InvalidDataException("Search must be a string")
        if search:
            result = self.db.execute_query(CustomerQueries.GET_ALL_CUSTOMERS_BY_SEARCH, (search, search, search))
        else:
            result = self.db.execute_query(CustomerQueries.GET_ALL_CUSTOMERS)
        self.db.close_pool()
        customers = []
        for row in result:
            customer = {
                "customer_id": row[0],
                "name": row[1],
                "email": row[2],
                "phone": row[3],
                "address": row[4],
                "customer_updated_time": row[5],
                "total_number_orders": row[6],
                "total_spent": row[7],
                "last_purchase_time": row[8],
            }
            customers.append(customer)
        return customers

    def get_customer(self, customer_id: int):
        if not isinstance(customer_id, int) or customer_id <= 0:
            logger.error(f"Invalid customer ID: {customer_id}")
            raise InvalidDataException("Invalid customer ID")
        result = self.db.execute_query(CustomerQueries.GET_CUSTOMER_BY_ID, (customer_id,))
        self.db.close_pool()
        if not result:
            raise NotFoundException(f"Customer with ID {customer_id} not found")
        
        row = result[0]
        customer = {
            "customer_id": row[0],
            "name": row[1],
            "email": row[2],
            "phone": row[3],
            "address": row[4],
            "customer_updated_time": row[5],
            "total_number_orders": row[6],
            "total_spent": row[7],
            "last_purchase_time": row[8],
        }
        return customer
        

    def create_customer(self, customer: dict):
        
        if not isinstance(customer, dict):
            logger.error("Invalid customer data type")
            raise InvalidDataException("Customer data must be a dictionary")
        required_fields = ["name","phone"]
        for field in required_fields:
            if field not in customer or not customer[field]:
                raise InvalidDataException(f"{field.capitalize()} is required")
        if not isinstance(customer["name"], str) or not isinstance(customer["phone"], str):
            raise InvalidDataException("Name and phone must be strings")
        if len(customer["name"]) < 3 or len(customer["name"]) > 50:
            raise InvalidDataException("Name must be between 3 and 50 characters")
        if len(customer["phone"]) < 10 or len(customer["phone"]) > 15:
            raise InvalidDataException("Phone must be between 10 and 15 characters")

        # Create new customer
        self.db.execute_query(
            CustomerQueries.CREATE_CUSTOMER,
            (customer["name"], customer["email"], customer["phone"], customer.get("address", ""))
        )
        self.db.close_pool()
        
        return {}
        

    def update_customer(self, customer_id: int, customer: CustomerData):
        if not isinstance(customer_id, int) or customer_id <= 0:
            raise InvalidDataException("Invalid customer ID")
        existing = self.db.execute_query(CustomerQueries.GET_CUSTOMER_BY_ID, (customer_id,))
        if not existing:
            self.db.close_pool()
            raise NotFoundException(f"Customer with ID {customer_id} not found")

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
                self.db.close_pool()
                raise InvalidDataException("Email already registered")

        # Update customer
        self.db.execute_query(
            CustomerQueries.UPDATE_CUSTOMER,
            (name, email, phone, address, customer_id)
        )

        self.db.close_pool()
        return {}
        
    def delete_customer(self, customer_id: int):
        
        existing = self.db.execute_query(CustomerQueries.GET_CUSTOMER_BY_ID, (customer_id,))
        if not existing:
            self.db.close_pool()
            raise NotFoundException(f"Customer with ID {customer_id} not found")
        if existing[0][6] > 0:
            self.db.close_pool()
            raise InvalidDataException("Cannot delete customer with existing orders")
        # Delete customer
        self.db.execute_query(CustomerQueries.DELETE_CUSTOMER, (customer_id,))
        self.db.close_pool()
        return {}

    def count_customers(self):
        result = self.db.execute_query(CustomerQueries.COUNT_CUSTOMERS)
        self.db.close_pool()
        if not result:
            return 0
        return result[0][0]