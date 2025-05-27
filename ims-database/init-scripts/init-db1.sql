-- DELETE ALL TABLES BEFORE RECREATING
DROP TABLE IF EXISTS product_order_items;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS login_logs;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS warehouses;
DROP TABLE IF EXISTS customers;

-- CORE TABLES

CREATE TABLE warehouses (
    warehouse_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_name ENUM('admin', 'staff') NOT NULL DEFAULT 'staff',
    image_url TEXT,
    warehouse_id INT,
    is_active BOOLEAN DEFAULT FALSE,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouses(warehouse_id)
);

CREATE TABLE login_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    refresh_token VARCHAR(255),
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_loginlogs_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE suppliers (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    contact_email VARCHAR(255),
    phone VARCHAR(50),
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- PRODUCT SYSTEM

CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 0, -- Tracks total quantity at the warehouse
    supplier_id INT NOT NULL,
    warehouse_id INT NOT NULL,
    category_id INT NOT NULL,
    image_url TEXT,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id),
    CONSTRAINT fk_products_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouses(warehouse_id),
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- ORDER SYSTEM

CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_orderitems_order FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

CREATE TABLE product_order_items (
    product_id INT NOT NULL,
    order_item_id INT NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (product_id, order_item_id),
    CONSTRAINT fk_poi_product FOREIGN KEY (product_id) REFERENCES products(product_id),
    CONSTRAINT fk_poi_order_item FOREIGN KEY (order_item_id) REFERENCES order_items(order_item_id)
);