class OrderQueries:
    GET_ALL_ORDERS = """
        SELECT o.id, o.customer_id, o.total_amount, o.status, o.notes, o.created_at, o.updated_at,
               oi.id as item_id, oi.product_id, oi.quantity, oi.price, oi.created_at as item_created_at, oi.updated_at as item_updated_at
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        ORDER BY o.id DESC;
    """

    GET_ORDER_BY_ID = """
        SELECT o.id, o.customer_id, o.total_amount, o.status, o.notes, o.created_at, o.updated_at,
               oi.id as item_id, oi.product_id, oi.quantity, oi.price, oi.created_at as item_created_at, oi.updated_at as item_updated_at
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.id = %s;
    """

    CREATE_ORDER = """
        INSERT INTO orders (customer_id, total_amount, status, notes)
        VALUES (%s, %s, %s, %s)
        RETURNING id, customer_id, total_amount, status, notes, created_at, updated_at;
    """

    CREATE_ORDER_ITEM = """
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (%s, %s, %s, %s)
        RETURNING id, order_id, product_id, quantity, price, created_at, updated_at;
    """ 