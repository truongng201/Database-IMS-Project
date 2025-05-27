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