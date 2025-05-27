-- Drop existing views if they exist
DROP VIEW IF EXISTS product_summary;
DROP VIEW IF EXISTS order_details;
DROP VIEW IF EXISTS user_activity;
DROP VIEW IF EXISTS low_stock_alert;

-- Views

-- Product Summary View
-- Purpose: Aggregates product details with related supplier, category, and warehouse names for inventory reporting
CREATE VIEW product_summary AS
SELECT
    p.product_id,
    p.name AS product_name,
    p.price,
    p.quantity,
    c.name AS category_name,
    s.name AS supplier_name,
    w.name AS warehouse_name
FROM products p
JOIN categories c ON p.category_id = c.category_id
JOIN suppliers s ON p.supplier_id = s.supplier_id
JOIN warehouses w ON p.warehouse_id = w.warehouse_id;

-- Order Details View
-- Purpose: Combines order, customer, and product information for tracking and reporting
CREATE VIEW order_details AS
SELECT
    o.order_id,
    o.order_date,
    o.status,
    c.name AS customer_name,
    p.name AS product_name,
    poi.quantity,
    poi.total_price
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN product_order_items poi ON oi.order_item_id = poi.order_item_id
JOIN products p ON poi.product_id = p.product_id;

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

-- Indexes

-- Users Email Index
-- Rationale: Speeds up login queries and email-based lookups
CREATE INDEX idx_users_email ON users(email);

-- Products Name Index
-- Rationale: Accelerates product searches by name
CREATE INDEX idx_products_name ON products(name);

-- Orders Date Index
-- Rationale: Optimizes queries filtering orders by date
CREATE INDEX idx_orders_date ON orders(order_date);

-- Product Order Items Composite Index
-- Rationale: Enhances performance of joins involving product order items
CREATE INDEX idx_poi_product_order ON product_order_items(product_id, order_item_id);

-- Customers Email Index
-- Rationale: Speeds up customer lookups by email
CREATE INDEX idx_customers_email ON customers(email);

-- Partitioning Strategy

-- Orders Table Strategy: Range partitioning by order date year
-- Rationale: Orders grow over time, and queries often filter by date
ALTER TABLE orders
PARTITION BY RANGE (YEAR(order_date)) (
    PARTITION p0 VALUES LESS THAN (2023),
    PARTITION p1 VALUES LESS THAN (2024),
    PARTITION p2 VALUES LESS THAN (2025),
    PARTITION p3 VALUES LESS THAN (2026),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);

-- Products Table Strategy: Hash partitioning by warehouse_id
-- Rationale: Distributes products evenly across partitions for warehouse-specific queries
ALTER TABLE products
PARTITION BY HASH (warehouse_id)
PARTITIONS 4;

-- Triggers
-- Trigger to update product quantity after inserting into product_order_items
-- This trigger ensures that the product quantity is decremented when a new order item is added.
DELIMITER $$

CREATE TRIGGER trg_after_insert_product_order_items
AFTER INSERT ON product_order_items
FOR EACH ROW
BEGIN
    UPDATE products
    SET quantity = quantity - NEW.quantity,
        updated_time = CURRENT_TIMESTAMP
    WHERE product_id = NEW.product_id;
END$$

DELIMITER ;