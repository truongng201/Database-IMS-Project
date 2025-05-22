class SupplierQueries:
    GET_ALL_SUPPLIERS = """
        SELECT supplier_id, name, contact_name, contact_email, phone
        FROM suppliers
        ORDER BY supplier_id DESC;
    """

    GET_SUPPLIER_BY_ID = """
        SELECT supplier_id, name, contact_name, contact_email, phone
        FROM suppliers
        WHERE supplier_id = %s;
    """

    CREATE_SUPPLIER = """
        INSERT INTO suppliers (name, contact_name, contact_email, phone)
        VALUES (%s, %s, %s, %s);
    """
    
    GET_LAST_INSERTED_SUPPLIER = """
        SELECT supplier_id, name, contact_name, contact_email, phone
        FROM suppliers
        ORDER BY supplier_id DESC
        LIMIT 1;
    """
    
    UPDATE_SUPPLIER = """
        UPDATE suppliers
        SET name = %s, contact_name = %s, contact_email = %s, phone = %s, updated_time = CURRENT_TIMESTAMP
        WHERE supplier_id = %s;
    """
    
    DELETE_SUPPLIER = """
        DELETE FROM suppliers
        WHERE supplier_id = %s;
    """
    
    GET_SUPPLIER_BY_EMAIL = """
        SELECT supplier_id, name, contact_name, contact_email, phone, created_time, updated_time
        FROM suppliers
        WHERE contact_email = %s;
    """ 