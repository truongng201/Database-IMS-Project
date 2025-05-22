class OrderQueries:
    GET_ALL_ORDERS = """
        SELECT o.order_id, o.customer_id, o.status, o.order_date, o.created_time, o.updated_time,
               oi.order_item_id, poi.product_id, poi.quantity, poi.total_price
        FROM orders o
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        LEFT JOIN product_order_items poi ON oi.order_item_id = poi.order_item_id
        ORDER BY o.order_id DESC;
    """

    GET_ORDER_BY_ID = """
        SELECT o.order_id, o.customer_id, o.status, o.order_date, o.created_time, o.updated_time,
               oi.order_item_id, poi.product_id, poi.quantity, poi.total_price
        FROM orders o
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        LEFT JOIN product_order_items poi ON oi.order_item_id = poi.order_item_id
        WHERE o.order_id = %s;
    """

    CREATE_ORDER = """
        INSERT INTO orders (customer_id, status)
        VALUES (%s, %s);
    """

    GET_LAST_INSERTED_ID = """
        SELECT LAST_INSERT_ID();
    """

    GET_ORDER = """
        SELECT order_id, customer_id, status, order_date, created_time, updated_time
        FROM orders
        WHERE order_id = %s;
    """

    CREATE_ORDER_ITEM = """
        INSERT INTO order_items (order_id)
        VALUES (%s);
    """
    
    CREATE_PRODUCT_ORDER_ITEM = """
        INSERT INTO product_order_items (product_id, order_item_id, quantity, total_price)
        VALUES (%s, %s, %s, %s);
    """

    DELETE_ORDER = """
        DELETE FROM orders
        WHERE order_id = %s;
    """
    
    DELETE_ORDER_ITEMS = """
        DELETE FROM order_items
        WHERE order_id = %s;
    """ 