# Inventory Management System Database Schema

## 🧱 Database Schema

![Database Schema](./docs/ims-schema.png)

This document outlines the database schema for an Inventory Management System, designed to manage products, orders, users, and related entities. The schema is implemented in SQL and includes tables with their respective fields and purposes.

### Warehouse

**Purpose**: Represents physical places where products are stored (e.g., warehouses).

| Field           | Type                  | Description                                      |
|-----------------|-----------------------|--------------------------------------------------|
| `warehouse_id`  | INT (PK, AI)          | Unique identifier for the warehouse              |
| `name`          | VARCHAR(255)          | Name of the warehouse (e.g., "Main Warehouse")   |
| `address`       | TEXT                  | Physical address of the warehouse                |
| `created_time`  | TIMESTAMP             | Record creation timestamp (default: CURRENT_TIMESTAMP) |
| `updated_time`  | TIMESTAMP             | Record update timestamp (default: CURRENT_TIMESTAMP, updates on change) |

### User

**Purpose**: Represents authenticated system users with role information (e.g., admin, staff).

| Field           | Type                  | Description                                      |
|-----------------|-----------------------|--------------------------------------------------|
| `user_id`       | INT (PK, AI)          | Unique identifier for the user                   |
| `username`      | VARCHAR(50)           | User's username                                  |
| `email`         | VARCHAR(255), UNIQUE  | User's email address                             |
| `password_hash` | VARCHAR(255)          | Hashed password for authentication               |
| `role_name`     | ENUM('admin', 'staff')| User's role (admin or staff)                     |
| `image_url`     | TEXT                  | URL to the user's avatar image                   |
| `warehouse_id`  | INT (FK)              | References `warehouses(warehouse_id)`            |
| `is_active`     | BOOLEAN               | Indicates if the user account is active          |
| `created_time`  | TIMESTAMP             | Record creation timestamp (default: CURRENT_TIMESTAMP) |
| `updated_time`  | TIMESTAMP             | Record update timestamp (default: CURRENT_TIMESTAMP, updates on change) |

### LoginLog

**Purpose**: Tracks user login attempts for security and auditing.

| Field           | Type                  | Description                                      |
|-----------------|-----------------------|--------------------------------------------------|
| `log_id`        | INT (PK, AI)          | Unique identifier for the login log              |
| `user_id`       | INT (FK)              | References `users(user_id)`                      |
| `refresh_token` | VARCHAR(255)          | Token used for session management                |
| `login_time`    | TIMESTAMP             | Timestamp of the login attempt (default: CURRENT_TIMESTAMP) |
| `ip_address`    | VARCHAR(50)           | IP address of the login attempt                  |
| `user_agent`    | TEXT                  | User agent string of the client device           |
| `created_time`  | TIMESTAMP             | Record creation timestamp (default: CURRENT_TIMESTAMP) |
| `updated_time`  | TIMESTAMP             | Record update timestamp (default: CURRENT_TIMESTAMP, updates on change) |

### Supplier

**Purpose**: Represents sources of goods and stock for the inventory.

| Field           | Type                  | Description                                      |
|-----------------|-----------------------|--------------------------------------------------|
| `supplier_id`   | INT (PK, AI)          | Unique identifier for the supplier               |
| `name`          | VARCHAR(255)          | Name of the supplier                             |
| `contact_name`  | VARCHAR(255)          | Contact person’s name                            |
| `contact_email` | VARCHAR(255)          | Contact email address                            |
| `phone`         | VARCHAR(50)           | Contact phone number                             |
| `created_time`  | TIMESTAMP             | Record creation timestamp (default: CURRENT_TIMESTAMP) |
| `updated_time`  | TIMESTAMP             | Record update timestamp (default: CURRENT_TIMESTAMP, updates on change) |

### Category

**Purpose**: Provides logical groupings for products (e.g., Electronics, Clothing).

| Field           | Type                  | Description                                      |
|-----------------|-----------------------|--------------------------------------------------|
| `category_id`   | INT (PK, AI)          | Unique identifier for the category               |
| `name`          | VARCHAR(255)          | Name of the category                             |
| `description`   | TEXT                  | Description of the category                      |
| `created_time`  | TIMESTAMP             | Record creation timestamp (default: CURRENT_TIMESTAMP) |
| `updated_time`  | TIMESTAMP             | Record update timestamp (default: CURRENT_TIMESTAMP, updates on change) |

### Product

**Purpose**: Represents core inventory items, including stock quantities and image references.

| Field           | Type                  | Description                                      |
|-----------------|-----------------------|--------------------------------------------------|
| `product_id`    | INT (PK, AI)          | Unique identifier for the product                |
| `name`          | VARCHAR(255)          | Name of the product                              |
| `description`   | TEXT                  | Description of the product                       |
| `price`         | DECIMAL(10,2)         | Price per unit of the product                    |
| `quantity`      | INT                   | Number of product units in stock at the warehouse|
| `supplier_id`   | INT (FK)              | References `suppliers(supplier_id)`              |
| `warehouse_id`  | INT (FK)              | References `warehouses(warehouse_id)`            |
| `category_id`   | INT (FK)              | References `categories(category_id)`             |
| `image_url`     | TEXT                  | URL to the product image                         |
| `created_time`  | TIMESTAMP             | Record creation timestamp (default: CURRENT_TIMESTAMP) |
| `updated_time`  | TIMESTAMP             | Record update timestamp (default: CURRENT_TIMESTAMP, updates on change) |

### Customer

**Purpose**: Represents end-users or clients for whom products are sold.

| Field           | Type                  | Description                                      |
|-----------------|-----------------------|--------------------------------------------------|
| `customer_id`   | INT (PK, AI)          | Unique identifier for the customer               |
| `name`          | VARCHAR(255)          | Customer’s full name                             |
| `email`         | VARCHAR(255)          | Customer’s email address                         |
| `phone`         | VARCHAR(50)           | Customer’s phone number                          |
| `address`       | TEXT                  | Customer’s address                               |
| `created_time`  | TIMESTAMP             | Record creation timestamp (default: CURRENT_TIMESTAMP) |
| `updated_time`  | TIMESTAMP             | Record update timestamp (default: CURRENT_TIMESTAMP, updates on change) |

### Order

**Purpose**: Represents inventory transactions, such as customer orders.

| Field           | Type                  | Description                                      |
|-----------------|-----------------------|--------------------------------------------------|
| `order_id`      | INT (PK, AI)          | Unique identifier for the order                  |
| `customer_id`   | INT (FK)              | References `customers(customer_id)`              |
| `order_date`    | TIMESTAMP             | Date and time the order was placed (default: CURRENT_TIMESTAMP) |
| `status`        | ENUM('pending', 'completed', 'cancelled') | Status of the order                   |
| `created_time`  | TIMESTAMP             | Record creation timestamp (default: CURRENT_TIMESTAMP) |
| `updated_time`  | TIMESTAMP             | Record update timestamp (default: CURRENT_TIMESTAMP, updates on change) |

### OrderItem

**Purpose**: Represents individual line items within an order, linking to products.

| Field           | Type                  | Description                                      |
|-----------------|-----------------------|--------------------------------------------------|
| `order_item_id` | INT (PK, AI)          | Unique identifier for the order item             |
| `order_id`      | INT (FK)              | References `orders(order_id)`                    |
| `created_time`  | TIMESTAMP             | Record creation timestamp (default: CURRENT_TIMESTAMP) |
| `updated_time`  | TIMESTAMP             | Record update timestamp (default: CURRENT_TIMESTAMP, updates on change) |

### ProductOrderItem

**Purpose**: Manages the relationship between order items and products, including quantities and pricing.

| Field           | Type                  | Description                                      |
|-----------------|-----------------------|--------------------------------------------------|
| `product_id`    | INT (FK)              | References `products(product_id)`                |
| `order_item_id` | INT (FK)              | References `order_items(order_item_id)`          |
| `quantity`      | INT                   | Number of product units in the order item        |
| `total_price`   | DECIMAL(10,2)         | Total price for this line item (quantity * price)|
| **Primary Key** | `(product_id, order_item_id)` | Composite key ensuring unique product-order item pairs |

## Notes

- **Primary Keys (PK)**: Most tables use an auto-incrementing `INT` as the primary key. `product_order_items` uses a composite primary key (`product_id`, `order_item_id`).
- **Foreign Keys (FK)**: Enforce referential integrity (e.g., `warehouse_id` in `users` references `warehouses`).
- **Timestamps**: `created_time` and `updated_time` are included in all tables for auditing.
- **ENUMs**: Used for fields with fixed values (e.g., `role_name` in `users`, `status` in `orders`).
- **Image URLs**: The `image_url` fields in `products` and `users` reference avatar or product images, typically hosted externally (e.g., DiceBear for avatars).
- **One-to-One Category Relationship**: Each product is assigned to one category via `category_id` in the `products` table.
- **Inventory Tracking**: The `products` table tracks stock levels directly via the `quantity` field, associated with a specific warehouse.
- **Order Structure**: The `order_items` table links orders to products through `product_order_items`, allowing multiple products per order item with specified quantities and prices.

This schema supports a robust inventory management system with user authentication, product categorization, stock tracking, and order processing.

---
