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
        connection = None
        cursor = None
        
        try:
            # Get a direct connection instead of using the pool
            connection = self.db.pool.get_connection()
            cursor = connection.cursor()
            
            # Start transaction
            cursor.execute("START TRANSACTION")
            logger.info(f"Creating order for customer ID {order['customer_id']}")

            # Create order
            insert_order_query = "INSERT INTO orders (customer_id, status) VALUES (%s, %s)"
            cursor.execute(insert_order_query, (
                order["customer_id"],
                order.get("status", "pending")
            ))
            
            # Get the last inserted order ID immediately
            order_id = cursor.lastrowid
            if not order_id:
                connection.rollback()
                raise HTTPException(status_code=500, detail="Failed to retrieve created order ID")
                
            logger.info(f"Created order with ID {order_id}")

            # Create order items
            for item in order["items"]:
                # Create order item first
                insert_order_item_query = "INSERT INTO order_items (order_id) VALUES (%s)"
                cursor.execute(insert_order_item_query, (order_id,))
                
                # Get the last inserted order item ID immediately
                order_item_id = cursor.lastrowid
                if not order_item_id:
                    connection.rollback()
                    raise HTTPException(status_code=500, detail="Failed to retrieve created order item ID")
                    
                logger.info(f"Created order item with ID {order_item_id}")
                
                # Then link product to the order item
                insert_product_query = """
                    INSERT INTO product_order_items 
                    (product_id, order_item_id, quantity, total_price) 
                    VALUES (%s, %s, %s, %s)
                """
                cursor.execute(insert_product_query, (
                    item["product_id"],
                    order_item_id,
                    item["quantity"],
                    float(item["price"]) * float(item["quantity"])  # Calculate total price
                ))

            # Commit transaction
            connection.commit()
            logger.info(f"Order {order_id} created successfully")

            # Get the created order with items
            created_order = self.get_order(order_id)
            return OrderResponse(
                status="Success",
                data=created_order.data,
                message="Order created successfully !"
            )
        except HTTPException as e:
            logger.error(f"HTTP Exception: {str(e)}")
            if connection:
                connection.rollback()
            raise
        except Exception as e:
            logger.error(f"Error creating order: {str(e)}")
            if connection:
                connection.rollback()
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()

    def update_order(self, order_id: int, order: OrderData):
        try:
            # Check if order exists
            result = self.db.execute_query(OrderQueries.GET_ORDER_BY_ID, (order_id,))
            if not result:
                return OrderResponse(
                    status="Success",
                    data={},
                    message=f"Order with ID {order_id} not found"
                )
            
            # We'll just update the order status for simplicity
            # In a real application, you might want to update items as well
            
            # Start transaction
            self.db.execute_query("START TRANSACTION;")
            logger.info(f"Updating order with ID {order_id}")
            
            # Update order status
            update_query = """
                UPDATE orders SET status = %s WHERE order_id = %s
            """
            self.db.execute_query(update_query, (order.status, order_id))
            
            # Commit transaction
            self.db.execute_query("COMMIT;")
            logger.info(f"Order {order_id} updated successfully")
            
            # Get updated order
            updated_order = self.get_order(order_id)
            return OrderResponse(
                status="Success",
                data=updated_order.data,
                message=f"Order with ID {order_id} updated successfully"
            )
        except Exception as e:
            self.db.execute_query("ROLLBACK;")
            logger.error(f"Error updating order: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))
            
    def delete_order(self, order_id: int):
        try:
            # Check if order exists
            result = self.db.execute_query(OrderQueries.GET_ORDER_BY_ID, (order_id,))
            if not result:
                return OrderResponse(
                    status="Success",
                    data={},
                    message=f"Order with ID {order_id} not found or already deleted"
                )
            
            # Start transaction
            self.db.execute_query("START TRANSACTION;")
            logger.info(f"Deleting order with ID {order_id}")
            
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
            self.db.execute_query(OrderQueries.DELETE_ORDER_ITEMS, (order_id,))
            logger.info(f"Deleted all items for order {order_id}")
            
            # Finally delete the order
            self.db.execute_query(OrderQueries.DELETE_ORDER, (order_id,))
            logger.info(f"Deleted order {order_id}")
            
            # Commit the transaction
            self.db.execute_query("COMMIT;")
            
            return OrderResponse(
                status="Success",
                data={},
                message=f"Order with ID {order_id} deleted successfully"
            )
        except Exception as e:
            self.db.execute_query("ROLLBACK;")
            logger.error(f"Error deleting order: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    def update_order_status(self, order_id: int, status: str):
        
        # Validate input
        if order_id <= 0:
            raise BadRequestException("Invalid order ID")
        if not status:
            raise BadRequestException("Status cannot be empty")
        
        # Check if order exists
        check_result = self.db.execute_query("SELECT COUNT(*) FROM orders WHERE order_id = %s", (order_id,))
        if not check_result or check_result[0][0] == 0:
            self.db.close_pool()
            raise NotFoundException("Order does not exist")
        
        # Update the order status
        result = self.db.execute_query(OrderQueries.UPDATE_ORDER_STATUS, (status, order_id))
        self.db.close_pool()
        
        if result is None:
            raise Exception("Failed to update order status")
        
        return f"Order {order_id} status updated to {status}"
        