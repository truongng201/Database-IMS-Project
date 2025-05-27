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


-- Procedure to Create a New Order with Items
DELIMITER $$

CREATE PROCEDURE CreateOrder(
    IN p_customer_id INT,
    IN p_product_ids TEXT,    -- comma-separated product_ids, e.g. '1,2,3'
    IN p_quantities TEXT,     -- comma-separated quantities, e.g. '2,1,5'
    IN p_prices TEXT          -- comma-separated prices, e.g. '10.00,20.00,5.50'
)
BEGIN
    DECLARE v_order_id INT;
    DECLARE i INT DEFAULT 1;
    DECLARE n INT;
    DECLARE product_id INT;
    DECLARE qty INT;
    DECLARE price DECIMAL(10,2);

    -- Insert new order
    INSERT INTO orders (customer_id, status) VALUES (p_customer_id, 'pending');
    SET v_order_id = LAST_INSERT_ID();

    SET n = (LENGTH(p_product_ids) - LENGTH(REPLACE(p_product_ids, ',', '')) + 1);

    WHILE i <= n DO
        SET product_id = CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(p_product_ids, ',', i), ',', -1) AS UNSIGNED);
        SET qty = CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(p_quantities, ',', i), ',', -1) AS UNSIGNED);
        SET price = CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(p_prices, ',', i), ',', -1) AS DECIMAL(10,2));

        -- Insert order item
        INSERT INTO order_items (order_id) VALUES (v_order_id);
        SET @order_item_id = LAST_INSERT_ID();

        -- Insert product_order_item
        INSERT INTO product_order_items (product_id, order_item_id, quantity, total_price)
        VALUES (product_id, @order_item_id, qty, qty * price);

        SET i = i + 1;
    END WHILE;
END$$

DELIMITER ;

-- Procedure to Update Product Quantity Stock
DELIMITER $$

CREATE PROCEDURE UpdateProductQuantity(
    IN p_product_id INT,
    IN p_quantity_change INT  -- positive to add stock, negative to reduce
)
BEGIN
    UPDATE products
    SET quantity = quantity + p_quantity_change,
        updated_time = CURRENT_TIMESTAMP
    WHERE product_id = p_product_id;

    -- Optional: you may want to add validation to prevent negative stock here
END$$

DELIMITER ;

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