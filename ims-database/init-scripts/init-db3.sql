-- VIEWS AND PROCEDURES FOR PRODUCTS SERVICES

-- VIEWS FOR PRODUCTS SERVICES
DROP VIEW IF EXISTS products_all;
DROP VIEW IF EXISTS product_inventory;
DROP VIEW IF EXISTS categories_with_products;
DROP VIEW IF EXISTS products_by_category;

CREATE VIEW products_all AS
SELECT p.product_id, p.name AS product_name, p.description, p.price, c.name AS category_name, s.name AS supplier_name, l.name AS location_name, image_url
FROM products p
JOIN categories c ON p.category_id = c.category_id
JOIN suppliers s ON p.supplier_id = s.supplier_id
JOIN locations l ON p.location_id = l.location_id
ORDER BY p.product_id;

CREATE VIEW product_inventory AS
SELECT p.product_id, p.name AS product_name, i.quantity, i.last_updated
FROM products p
JOIN inventory i ON p.product_id = i.product_id;

CREATE VIEW categories_with_products AS
SELECT c.category_id, c.name AS category_name, COUNT(p.product_id) AS product_count
FROM categories c
LEFT JOIN products p ON c.category_id = p.category_id
GROUP BY c.category_id, c.name
ORDER BY c.category_id;

CREATE VIEW products_by_category AS
SELECT p.product_id, p.name AS product_name, c.name AS category_name
FROM products p
JOIN categories c ON p.category_id = c.category_id
ORDER BY c.category_id, p.product_id
LIMIT 100 OFFSET 0;


-- PROCEDURES FOR PRODUCTS SERVICES
DROP PROCEDURE IF EXISTS create_product;
DROP PROCEDURE IF EXISTS update_product;
DROP PROCEDURE IF EXISTS delete_product;
