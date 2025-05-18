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
            "id": rows[0][0],
            "customer_id": rows[0][1],
            "total_amount": rows[0][2],
            "status": rows[0][3],
            "notes": rows[0][4],
            "created_at": rows[0][5],
            "updated_at": rows[0][6],
            "items": []
        }

        # Process all rows for order items
        for row in rows:
            if row[7] is not None:  # Check if there's an order item
                item = {
                    "id": row[7],
                    "order_id": row[0],
                    "product_id": row[8],
                    "quantity": row[9],
                    "price": row[10],
                    "created_at": row[11],
                    "updated_at": row[12]
                }
                order_data["items"].append(item)

        logger.info(f"Formatted order {order_data['id']} with {len(order_data['items'])} items")
        return order_data

    def get_all_orders(self) -> OrderResponse:
        try:
            logger.info("Executing get_all_orders query")
            result = self.db.execute_query(OrderQueries.GET_ALL_ORDERS)
            logger.info(f"Got {len(result) if result else 0} order rows from database")
            
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
                    message=f"No order found with ID {order_id}"
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
        try:
            # Start transaction
            self.db.execute_query("START TRANSACTION;")

            # Create order
            order_result = self.db.execute_query(
                OrderQueries.CREATE_ORDER,
                (
                    order["customer_id"],
                    order["total_amount"],
                    order.get("status", "pending"),
                    order.get("notes")
                )
            )

            if not order_result:
                self.db.execute_query("ROLLBACK;")
                raise HTTPException(status_code=500, detail="Failed to create order")

            order_id = order_result[0][0]

            # Create order items
            for item in order["items"]:
                item_result = self.db.execute_query(
                    OrderQueries.CREATE_ORDER_ITEM,
                    (
                        order_id,
                        item["product_id"],
                        item["quantity"],
                        item["price"]
                    )
                )
                if not item_result:
                    self.db.execute_query("ROLLBACK;")
                    raise HTTPException(status_code=500, detail="Failed to create order items")

            # Commit transaction
            self.db.execute_query("COMMIT;")

            # Get the created order with items
            created_order = self.get_order(order_id)
            return OrderResponse(
                status="Success",
                data=created_order.data,
                message="Order created successfully !"
            )
        except HTTPException:
            self.db.execute_query("ROLLBACK;")
            raise
        except Exception as e:
            self.db.execute_query("ROLLBACK;")
            raise HTTPException(status_code=500, detail=str(e)) 