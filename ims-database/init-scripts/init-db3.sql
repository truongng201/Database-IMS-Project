-- Supplier view
CREATE VIEW supplier_products_view AS
SELECT 
    w.warehouse_id,
    w.name AS warehouse_name,
    s.supplier_id,
    s.name AS supplier_name,
    s.contact_name,
    s.contact_email,
    s.phone AS contact_phone,
    p.product_id,
    p.name AS product_name,
    p.description,
    p.price,
    p.quantity,
    c.category_id,
    c.name AS category_name,
    p.created_time AS product_created_time,
    p.updated_time AS product_updated_time
FROM 
    suppliers s
    LEFT JOIN products p ON s.supplier_id = p.supplier_id
    LEFT JOIN warehouses w ON p.warehouse_id = w.warehouse_id
    LEFT JOIN categories c ON p.category_id = c.category_id;

CREATE VIEW all_suppliers_by_warehouse_view AS
SELECT 
    w.warehouse_id,
    w.name AS warehouse_name,
    s.supplier_id,
    s.name AS supplier_name,
    s.contact_name,
    s.contact_email,
    s.phone,
    COALESCE(COUNT(p.product_id), 0) AS total_products,
    COALESCE(SUM(p.quantity), 0) AS total_product_quantity,
    COALESCE(AVG(p.price), 0) AS avg_product_price,
    MIN(p.created_time) AS earliest_product_created,
    MAX(p.updated_time) AS latest_product_updated,
    s.created_time AS supplier_created_time,
    s.updated_time AS supplier_updated_time
FROM 
    suppliers s
    LEFT JOIN products p ON s.supplier_id = p.supplier_id
    LEFT JOIN warehouses w ON p.warehouse_id = w.warehouse_id
GROUP BY 
    w.warehouse_id,
    w.name,
    s.supplier_id,
    s.name,
    s.contact_name,
    s.contact_email,
    s.phone,
    s.created_time,
    s.updated_time;

-- Customer view
CREATE VIEW customer_summary_view AS
SELECT 
    c.customer_id AS customer_id,
    c.name AS name,
    c.email AS email,
    c.phone AS phone,
    c.address AS address,
    c.updated_time AS customer_updated_time,
    COUNT(DISTINCT o.order_id) AS total_number_orders,
    COALESCE(SUM(poi.total_price), 0) AS total_spent,
    MAX(o.order_date) AS last_purchase
FROM 
    customers c
    LEFT JOIN orders o ON c.customer_id = o.customer_id
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
    LEFT JOIN product_order_items poi ON oi.order_item_id = poi.order_item_id
GROUP BY 
    c.customer_id, c.name, c.email, c.phone, c.updated_time;