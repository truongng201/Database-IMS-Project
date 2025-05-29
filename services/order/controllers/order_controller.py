from fastapi import HTTPException
from shared_utils.database import Database
from queries.order_queries import OrderQueries
from models.order import OrderResponse, OrderData, OrderItemData, Order, OrderItem
from typing import Dict, List
from shared_utils.logger import logger
from shared_config.custom_exception import BadRequestException, NotFoundException

class OrderController:
    def __init__(self):
        self.db = Database()

    def _format_order_with_items(self, rows: List[tuple]) -> Dict:
        if not rows:
            logger.info("No rows to format")
            return {}
        
        # First row contains order data
        order_data = {
            "order_id": rows[0][0],
            "customer_id": rows[0][1],
            "status": rows[0][2],
            "order_date": rows[0][3],
            "created_time": rows[0][4],
            "updated_time": rows[0][5],
            "items": []
        }

        # Process all rows for order items
        for row in rows:
            if row[6] is not None:  # Check if there's an order item
                # Check if we already have this item
                item_id = row[6]
                existing_item = next((item for item in order_data["items"] if item["order_item_id"] == item_id), None)
                
                if existing_item:
                    continue  # Skip duplicate items
                
                item = {
                    "order_item_id": row[6],
                    "order_id": row[0],
                    "product_id": row[7],
                    "quantity": row[8],
                    "total_price": row[9]
                }
                order_data["items"].append(item)

        logger.info(f"Formatted order {order_data['order_id']} with {len(order_data['items'])} items")
        return order_data

    def get_all_orders(self, user_info, search=None):
        warehouse_id = user_info.get("warehouse_id")
        role_name = user_info.get("role_name")
        if not warehouse_id:
            raise BadRequestException("Warehouse ID is required to retrieve orders")
        if role_name not in ["admin", "staff"]:
            raise BadRequestException("Only admin and staff can retrieve orders")
        
        # Handle search parameter - extract number from ORD-1000 format
        search_param = None
        if search:
            if search.startswith("ORD-"):
                search_param = f"%{search[4:]}%"  # Extract number part
            else:
                search_param = f"%{search}%"
        
        if role_name == "admin":
            if search_param:
                result = self.db.execute_query(OrderQueries.GET_ALL_ORDERS_WITH_SEARCH, (search_param, search_param))
            else:
                result = self.db.execute_query(OrderQueries.GET_ALL_ORDERS)
            print(result)
            self.db.close_pool()
            if result is None:
                raise Exception("Failed to retrieve orders from the database")
            
            orders = []
            for row in result:
                order_data = {
                    "order_id": row[0],
                    "order_date": row[1],
                    "order_status": row[2],
                    "customer_id": row[3],
                    "customer_name": row[4],
                    "customer_email": row[5],
                    "customer_phone": row[6],
                    "warehouse_id": row[7],
                    "warehouse_name": row[8],
                    "total_items": row[9],
                    "total_order_value": row[10],
                    "unique_products_ordered": row[11],
                }
                if orders and orders[-1].get("order_id") == order_data.get("order_id"):
                    continue
                orders.append(order_data)
            return orders
            
        
        if role_name == "staff":
            if search_param:
                result = self.db.execute_query(OrderQueries.GET_ALL_ORDERS_BY_WAREHOUSE_WITH_SEARCH, (warehouse_id, search_param, search_param))
            else:
                result = self.db.execute_query(OrderQueries.GET_ALL_ORDERS_BY_WAREHOUSE, (warehouse_id,))
            self.db.close_pool()
            if result is None:
                raise Exception("Failed to retrieve orders from the database")
            
            orders = []
            for row in result:
                order_data = {
                    "order_id": row[0],
                    "order_date": row[1],
                    "order_status": row[2],
                    "customer_id": row[3],
                    "customer_name": row[4],
                    "customer_email": row[5],
                    "customer_phone": row[6],
                    "warehouse_id": row[7],
                    "warehouse_name": row[8],
                    "total_items": row[9],
                    "total_order_value": row[10],
                    "unique_products_ordered": row[11],
                }
                if orders and orders[-1].get("order_id") == order_data.get("order_id"):
                    continue
                orders.append(order_data)
            return orders
    
        return []

    def get_order(self, order_id: int, user_info: dict):
        warehouse_id = user_info.get("warehouse_id")
        role_name = user_info.get("role_name")
        
        if not warehouse_id or not role_name:
            raise BadRequestException("Warehouse ID and Role Name are required")

        if role_name not in ["admin", "staff"]:
            raise BadRequestException("Only admin and staff can retrieve orders")
        
        order_date = {}
        if role_name == "staff":
            result = self.db.execute_query(OrderQueries.GET_ORDER_DETAIL_BY_WAREHOUSE, (order_id, warehouse_id))
            logger.info(f"Got result from database: {bool(result)}")
            if not result:
                raise NotFoundException(f"Cannot found order with ID {order_id}")
            order_data = {
                "order_id": result[0][0],
                "order_date": result[0][1],
                "order_status": result[0][2],
                "customer_id": result[0][3],
                "customer_name": result[0][4],
                "customer_email": result[0][5],
                "customer_phone": result[0][6],
                "items": [],
                "total_items": 0,
                "total_price": 0
            }
            for row in result:
                item = {
                    "order_item_id": row[7],
                    "product_id": row[8],
                    "product_name": row[9],
                    "product_price": row[10],
                    "quantity_ordered": row[11],
                    "price": row[12]
                }
                order_data["items"].append(item)
                order_data["total_items"] += 1
                order_data["total_price"] += item["price"]

        if role_name == "admin":
            result = self.db.execute_query(OrderQueries.GET_ORDER_DETAIL, (order_id,))
            logger.info(f"Got result from database: {bool(result)}")
            if not result:
                raise NotFoundException(f"Cannot found order with ID {order_id}")
            order_data = {
                "order_id": result[0][0],
                "order_date": result[0][1],
                "order_status": result[0][2],
                "customer_id": result[0][3],
                "customer_name": result[0][4],
                "customer_email": result[0][5],
                "customer_phone": result[0][6],
                "items": [],
                "total_items": 0,
                "total_price": 0
            }
            for row in result:
                item = {
                    "order_item_id": row[7],
                    "product_id": row[8],
                    "product_name": row[9],
                    "product_price": row[10],
                    "quantity_ordered": row[11],
                    "price": row[12]
                }
                order_data["items"].append(item)
                order_data["total_items"] += 1
                order_data["total_price"] += item["price"]
        if order_data and order_data.get("order_id") is None:
            return {}
        return order_data

    def create_order(self, order: dict):
        product_ids = []
        quantities = []
        prices = []
        
        for item in order["items"]:
            product_ids.append(str(item["product_id"]))
            quantities.append(str(item["quantity"]))
            prices.append(str(item["price"]))
        
        # Convert lists to comma-separated strings
        product_ids_str = ','.join(product_ids)
        quantities_str = ','.join(quantities)
        prices_str = ','.join(prices)
        
        logger.info(f"Calling CreateOrder procedure with: customer_id={order['customer_id']}, "
                    f"product_ids={product_ids_str}, quantities={quantities_str}, prices={prices_str}")
        
        # Call the CreateOrder stored procedure
        res = self.db.execute_query(OrderQueries.CREATE_ORDER_PROCEDURE, (
            order["customer_id"],
            product_ids_str,
            quantities_str,
            prices_str
        ))
        self.db.close_pool()
        if res is None:
            logger.error("Failed to create order in the database")
            raise Exception("Failed to create order in the database")
        
        return {}
      

    def update_order(self, order_id: int, order: OrderData):
        result = self.db.execute_query(OrderQueries.GET_ORDER_BY_ID, (order_id,))
        if not result:
            raise NotFoundException(f"Order with ID {order_id} not found")
        
        # We'll just update the order status for simplicity
        # In a real application, you might want to update items as well
        
        # Start transaction
        self.db.execute_query("START TRANSACTION;")
        logger.info(f"Updating order with ID {order_id}")
        
        # Update order status
        update_query = """
            UPDATE orders SET status = %s WHERE order_id = %s
        """
        res = self.db.execute_query(update_query, (order.status, order_id))
        
        logger.info(f"Updated order {order_id} status to {order.status}")
        if res is None:
            raise Exception("Failed to update order status in the database")
        return {}
        
            
    def delete_order(self, order_id: int):
        result = self.db.execute_query(OrderQueries.GET_ORDER_BY_ID, (order_id,))
        if not result:
            raise NotFoundException(f"Order with ID {order_id} not found")
        
        # We need to delete in the correct order due to foreign key constraints
        # First, find all order items
        order_items_result = self.db.execute_query("""
            SELECT order_item_id FROM order_items WHERE order_id = %s
        """, (order_id,))
        
        # Delete from product_order_items first (for each order item)
        for row in order_items_result:
            order_item_id = row[0]
            self.db.execute_query("""
                DELETE FROM product_order_items WHERE order_item_id = %s
            """, (order_item_id,))
            logger.info(f"Deleted product links for order item {order_item_id}")
        
        # Then delete from order_items
        res = self.db.execute_query(OrderQueries.DELETE_ORDER_ITEMS, (order_id,))
        logger.info(f"Deleted all items for order {order_id}")
        if res is None:
            self.db.close_pool()
            raise Exception("Failed to delete order items from the database")
        # Finally delete the order
        res = self.db.execute_query(OrderQueries.DELETE_ORDER, (order_id,))
        logger.info(f"Deleted order {order_id}")
        self.db.close_pool()
        if res is None:
            raise Exception("Failed to delete order from the database")

        return {}


    def update_order_status(self, order_id: int, status: str):
        # Validate input
        if order_id <= 0:
            raise BadRequestException("Invalid order ID")
        if not status:
            raise BadRequestException("Status cannot be empty")
        
        # Check if order exists and get current status
        check_result = self.db.execute_query("SELECT status FROM orders WHERE order_id = %s", (order_id,))
        if not check_result:
            self.db.close_pool()
            raise NotFoundException("Order does not exist")
        
        current_status = check_result[0][0]
        
        # If cancelling an order that was previously active, restore stock quantities
        if status.lower() == "cancelled" and current_status.lower() != "cancelled":
            logger.info(f"Cancelling order {order_id}, restoring stock quantities")
            
            # Get all order items with their quantities
            order_items_result = self.db.execute_query(OrderQueries.GET_ORDER_ITEMS_FOR_CANCELLATION, (order_id,))
            
            if order_items_result:
                # For each product in the order, restore the quantity
                for row in order_items_result:
                    product_id = row[0]
                    quantity = row[1]
                    
                    # Call UpdateProductQuantity procedure to add back the quantity
                    logger.info(f"Restoring {quantity} units for product {product_id}")
                    restore_result = self.db.execute_query(OrderQueries.UPDATE_PRODUCT_QUANTITY_PROCEDURE, (product_id, quantity))
                    
                    if restore_result is None:
                        logger.error(f"Failed to restore quantity for product {product_id}")
                        self.db.close_pool()
                        raise Exception(f"Failed to restore stock quantity for product {product_id}")
        
        # Update the order status
        result = self.db.execute_query(OrderQueries.UPDATE_ORDER_STATUS, (status, order_id))
        self.db.close_pool()
        
        if result is None:
            raise Exception("Failed to update order status")
        
        return f"Order {order_id} status updated to {status}"