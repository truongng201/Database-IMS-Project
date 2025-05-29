class OrderQueries:
    GET_ALL_ORDERS = """
        SELECT * FROM order_summary_view
        ORDER BY order_date DESC, order_id ASC;
    """
    
    GET_ALL_ORDERS_BY_WAREHOUSE = """
        SELECT * FROM order_summary_view
        WHERE warehouse_id = %s
        ORDER BY order_date DESC, order_id ASC;
    """

    GET_ORDER_DETAIL = """
        SELECT * FROM order_detail_summary
        WHERE order_id = %s
        ORDER BY order_updated_time DESC, order_id ASC;
    """
    
    GET_ORDER_DETAIL_BY_WAREHOUSE = """
        SELECT * FROM order_detail_summary
        WHERE order_id = %s AND warehouse_id = %s
        ORDER BY order_updated_time DESC, order_id ASC;
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

    UPDATE_ORDER_STATUS = """
        UPDATE orders
        SET status = %s
        WHERE order_id = %s;
    """

    SEARCH_ORDERS = """
        SELECT * FROM orders
        WHERE CAST(order_id AS CHAR) LIKE %s OR customer_name LIKE %s
        ORDER BY order_date DESC;
    """
    
    GET_ALL_ORDERS_WITH_SEARCH = """
        SELECT * FROM order_summary_view
        WHERE CAST(order_id AS CHAR) LIKE %s OR customer_name LIKE %s
        ORDER BY order_date DESC, order_id ASC;
    """
    
    GET_ALL_ORDERS_BY_WAREHOUSE_WITH_SEARCH = """
        SELECT * FROM order_summary_view
        WHERE warehouse_id = %s AND (CAST(order_id AS CHAR) LIKE %s OR customer_name LIKE %s)
        ORDER BY order_date DESC, order_id ASC;
    """