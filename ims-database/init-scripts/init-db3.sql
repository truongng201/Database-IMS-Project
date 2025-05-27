-- Supplier view
CREATE OR REPLACE VIEW supplier_products_view AS
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

CREATE OR REPLACE VIEW all_suppliers_by_warehouse_view AS
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
CREATE OR REPLACE VIEW customer_summary_view AS
SELECT 
    c.customer_id AS customer_id,
    c.name AS name,
    c.email AS email,
    c.phone AS phone,
    c.address AS address,
    c.updated_time AS customer_updated_time,
    COUNT(DISTINCT CASE WHEN poi.product_id IS NOT NULL THEN o.order_id END) AS total_number_orders,
    COALESCE(SUM(poi.total_price), 0) AS total_spent,
    MAX(CASE WHEN poi.product_id IS NOT NULL THEN o.order_date END) AS last_purchase
FROM 
    customers c
    LEFT JOIN orders o ON c.customer_id = o.customer_id
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
    LEFT JOIN product_order_items poi ON oi.order_item_id = poi.order_item_id
GROUP BY 
    c.customer_id, c.name, c.email, c.phone, c.updated_time;

-- Order view
CREATE OR REPLACE VIEW order_summary_view AS
SELECT 
    o.order_id,
    o.order_date,
    o.status,
    c.customer_id,
    c.name AS customer_name,
    c.email AS customer_email,
    c.phone AS customer_phone,
    p.warehouse_id,
    w.name AS warehouse_name,
    SUM(poi.quantity) AS total_items,
    SUM(poi.total_price) AS total_order_value,
    COUNT(DISTINCT poi.product_id) AS unique_products_ordered,
FROM
    orders o
    LEFT JOIN customers c ON o.customer_id = c.customer_id
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
    LEFT JOIN product_order_items poi ON oi.order_item_id = poi.order_item_id
    LEFT JOIN products p ON poi.product_id = p.product_id
    LEFT JOIN warehouses w ON p.warehouse_id = w.warehouse_id
WHERE
    p.product_id IS NOT NULL
GROUP BY
    o.order_id,
    o.order_date,
    o.status,
    c.customer_id,
    c.name,
    c.email,
    c.phone,
    p.warehouse_id,
    w.name;

CREATE OR REPLACE VIEW order_detail_summary AS
SELECT
    o.order_id,
    o.order_date,
    o.status AS order_status,

    c.customer_id,
    c.name AS customer_name,
    c.email AS customer_email,
    c.phone AS customer_phone,

    oi.order_item_id,

    p.product_id,
    p.name AS product_name,
    p.price AS product_price,
    poi.quantity AS quantity_ordered,
    poi.total_price AS total_price,
    
    w.warehouse_id,
    w.name AS warehouse_name,

    o.created_time AS order_created_time,
    o.updated_time AS order_updated_time
FROM
    orders o
    JOIN customers c ON o.customer_id = c.customer_id
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN product_order_items poi ON oi.order_item_id = poi.order_item_id
    JOIN products p ON poi.product_id = p.product_id
    JOIN warehouses w ON p.warehouse_id = w.warehouse_id;

-- Product view
CREATE OR REPLACE VIEW product_summary AS
SELECT 
    p.product_id, 
    p.name, 
    p.description, 
    p.price, 
    p.image_url,
    p.quantity,
    c.category_id AS category_id,
    c.name AS category_name,
    s.supplier_id AS supplier_id,
    s.name AS supplier_name,
    w.warehouse_id AS warehouse_id,
    w.name AS warehouse_name
FROM products p
JOIN categories c ON p.category_id = c.category_id
JOIN suppliers s ON p.supplier_id = s.supplier_id
JOIN warehouses w ON p.warehouse_id = w.warehouse_id
ORDER BY p.updated_time DESC, product_id ASC;

-- User Activity View
-- Purpose: Tracks user login activity by combining users and login logs data
CREATE VIEW user_activity AS
SELECT
    u.user_id,
    u.username,
    u.email,
    u.role_name,
    w.name AS warehouse_name,
    ll.login_time,
    ll.ip_address,
    ll.user_agent
FROM users u
LEFT JOIN login_logs ll ON u.user_id = ll.user_id
LEFT JOIN warehouses w ON u.warehouse_id = w.warehouse_id;

-- Low Stock Alert View
-- Purpose: Identifies products with low inventory for restocking decisions
CREATE VIEW low_stock_alert AS
SELECT
    p.product_id,
    p.name AS product_name,
    p.quantity,
    w.name AS warehouse_name,
    s.name AS supplier_name
FROM products p
JOIN warehouses w ON p.warehouse_id = w.warehouse_id
JOIN suppliers s ON p.supplier_id = s.supplier_id
WHERE p.quantity < 10;