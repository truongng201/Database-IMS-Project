class CustomerQueries:
    GET_ALL_CUSTOMERS = """
        SELECT customer_id, name, email, phone, address
        FROM customers
        ORDER BY customer_id DESC;
    """

    GET_CUSTOMER_BY_ID = """
        SELECT customer_id, name, email, phone, address
        FROM customers
        WHERE customer_id = %s;
    """

    CREATE_CUSTOMER = """
        INSERT INTO customers (name, email, phone, address)
        VALUES (%s, %s, %s, %s);
    """

    GET_LAST_INSERTED_CUSTOMER = """
        SELECT customer_id, name, email, phone, address
        FROM customers
        ORDER BY customer_id DESC
        LIMIT 1;
    """

    UPDATE_CUSTOMER = """
        UPDATE customers
        SET name = %s, email = %s, phone = %s, address = %s, updated_time = CURRENT_TIMESTAMP
        WHERE customer_id = %s;
    """

    DELETE_CUSTOMER = """
        DELETE FROM customers
        WHERE customer_id = %s;
    """

    GET_CUSTOMER_BY_EMAIL = """
        SELECT customer_id, name, email, phone, address, created_time, updated_time
        FROM customers
        WHERE email = %s;
    """ 