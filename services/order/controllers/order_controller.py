from fastapi import HTTPException
from shared_utils.database import Database
from queries.order_queries import OrderQueries
from models.order import OrderResponse, OrderData, OrderItemData, Order, OrderItem
from typing import Dict, List
from datetime import datetime
from shared_utils.logger import logger

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

    def get_all_orders(self) -> OrderResponse:
        try:
            logger.info("Executing get_all_orders query")
            result = self.db.execute_query(OrderQueries.GET_ALL_ORDERS)
            logger.info(f"Got {len(result) if result else 0} order rows from database")
            
            if not result:
                return OrderResponse(
                    status="Success",
                    data=[],
                    message="Get all orders successfully"
                )
            
            # Group results by order_id
            orders_dict = {}
            for row in result:
                order_id = row[0]
                if order_id not in orders_dict:
                    orders_dict[order_id] = []
                orders_dict[order_id].append(row)
            
            logger.info(f"Found {len(orders_dict)} unique orders")

            # Format each order with its items
            orders = [self._format_order_with_items(rows) for rows in orders_dict.values()]
            
            return OrderResponse(
                status="Success",
                data=orders,
                message="Get all orders successfully"
            )
        except Exception as e:
            logger.error(f"Error in get_all_orders: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    def get_order(self, order_id: int) -> OrderResponse:
        try:
            logger.info(f"Executing get_order query for ID {order_id}")
            result = self.db.execute_query(OrderQueries.GET_ORDER_BY_ID, (order_id,))
            logger.info(f"Got result from database: {bool(result)}")
            if not result:
                logger.info(f"No order found with ID {order_id}")
                return OrderResponse(
                    status="Success",
                    data={},
                    message=f"Get order with ID {order_id} successfully"
                )
            
            order_data = self._format_order_with_items(result)
            logger.info(f"Found order with ID {order_id}")
            return OrderResponse(
                status="Success",
                data=order_data,
                message=f"Get order with ID {order_id} successfully"
            )
        except Exception as e:
            logger.error(f"Error in get_order: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    def create_order(self, order: dict) -> OrderResponse:
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

    def update_order(self, order_id: int, order: OrderData) -> OrderResponse:
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
            
    def delete_order(self, order_id: int) -> OrderResponse:
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