class SupplierQueries:
    GET_ALL_SUPPLIERS = """
        SELECT * FROM all_suppliers_by_warehouse_view
        ORDER BY supplier_updated_time DESC, supplier_id ASC;
    """
    
    GET_ALL_SUPPLIERS_BY_SEARCH = """
        SELECT * FROM all_suppliers_by_warehouse_view
        WHERE LOWER(supplier_name) LIKE LOWER(CONCAT('%%', %s, '%%'))
        OR LOWER(contact_name) LIKE LOWER(CONCAT('%%', %s, '%%'))
        OR LOWER(contact_email) LIKE LOWER(CONCAT('%%', %s, '%%'))
        OR LOWER(phone) LIKE LOWER(CONCAT('%%', %s, '%%'))
        ORDER BY supplier_updated_time DESC, supplier_id ASC;
    """
    
    GET_ALL_SUPPLIERS_BY_WAREHOUSE_ID = """
        SELECT * FROM all_suppliers_by_warehouse_view
        WHERE warehouse_id = %s OR warehouse_id IS NULL
        ORDER BY supplier_updated_time DESC, supplier_id ASC;
    """
    
    GET_ALL_SUPPLIERS_BY_WAREHOUSE_ID_WITH_SEARCH = """
        SELECT * FROM all_suppliers_by_warehouse_view
        WHERE (warehouse_id = %s OR warehouse_id IS NULL)
        AND (LOWER(supplier_name) LIKE LOWER(CONCAT('%%', %s, '%%'))
        OR LOWER(contact_name) LIKE LOWER(CONCAT('%%', %s, '%%'))
        OR LOWER(contact_email) LIKE LOWER(CONCAT('%%', %s, '%%'))
        OR LOWER(phone) LIKE LOWER(CONCAT('%%', %s, '%%'))
        ORDER BY supplier_updated_time DESC, supplier_id ASC;
    """
    
    GET_ALL_SUPPLIERS_WITH_PRODUCTS = """
        SELECT * FROM supplier_products_view
        WHERE supplier_id = %s
        ORDER BY product_created_time DESC, product_id ASC;
    """

    GET_SUPPLIER_WITH_PRODUCTS_BY_ID = """
        SELECT * FROM supplier_products_view
        WHERE supplier_id = %s AND (warehouse_id = %s OR warehouse_id IS NULL)
        ORDER BY product_updated_time DESC, product_id ASC;
    """
    
    CHECK_SUPPLIER_EXISTS = """
        SELECT * FROM suppliers
        WHERE supplier_id = %s;
    """

    CREATE_SUPPLIER = """
        INSERT INTO suppliers (name, contact_name, contact_email, phone)
        VALUES (%s, %s, %s, %s);
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
    