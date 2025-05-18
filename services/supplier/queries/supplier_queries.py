class SupplierQueries:
    GET_ALL_SUPPLIERS = """
        SELECT id, name, email, phone, address
        FROM suppliers
        ORDER BY id DESC;
    """

    GET_SUPPLIER_BY_ID = """
        SELECT id, name, email, phone, address
        FROM suppliers
        WHERE id = %s;
    """

    CREATE_SUPPLIER = """
        INSERT INTO suppliers (name, email, phone, address)
        VALUES (%s, %s, %s, %s)
        RETURNING id, name, email, phone, address;
    """ 