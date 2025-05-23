from faker import Faker
import random

faker = Faker()

# Constants
NUM_SUPPLIERS = 100
NUM_WAREHOUSES = 5
NUM_PRODUCTS = 1000
NUM_CUSTOMERS = 100
NUM_ORDERS = 100
NUM_ORDER_ITEMS = 100

categories = [
    ["Electronics", "Devices, gadgets, and accessories."],
    ["Books", "Printed and digital reading materials."],
    ["Clothing", "Men's and women's apparel."],
    ["Toys", "Children's play items."],
    ["Furniture", "Home and office furnishings."],
    ["Sports", "Equipment and apparel for sports activities."],
    ["Beauty", "Cosmetics and personal care products."],
    ["Automotive", "Car parts and accessories."],
    ["Food", "Groceries and gourmet items."],
    ["Health", "Wellness and medical supplies."],
]

sql_statements = []

# Categories
for item in categories:
    name = item[0].replace("'", "''")
    description = item[1].replace("'", "''")
    sql_statements.append(f"INSERT INTO categories (name, description) VALUES ('{name}', '{description}');")

# Suppliers
for _ in range(NUM_SUPPLIERS):
    name = faker.company().replace("'", "''")
    contact_name = faker.name().replace("'", "''")
    contact_email = faker.company_email()
    phone = faker.phone_number()
    sql_statements.append(f"INSERT INTO suppliers (name, contact_name, contact_email, phone) "
                          f"VALUES ('{name}', '{contact_name}', '{contact_email}', '{phone}');")

# Warehouses
for _ in range(NUM_WAREHOUSES):
    name = faker.city().replace("'", "''")
    address = faker.street_address().replace("'", "''")
    sql_statements.append(f"INSERT INTO warehouses (name, address) "
                          f"VALUES ('{name}', '{address}');")

# Users
sql_statements.append(f"INSERT INTO users (username, email, password_hash, role_name, warehouse_id, is_active, image_url) "
                      f"VALUES ('admin', 'admin@admin.com', '21232f297a57a5a743894a0e4a801fc3', 'admin', 1, TRUE, 'https://api.dicebear.com/9.x/identicon/svg?seed=admin');")
sql_statements.append(f"INSERT INTO users (username, email, password_hash, role_name, warehouse_id, is_active, image_url) "
                      f"VALUES ('user1', 'user1@user.com', 'e6b84c1a1799a801a69781ed37986eb1', 'staff', 1, FALSE, 'https://api.dicebear.com/9.x/identicon/svg?seed=user1');")

# Customers
for _ in range(NUM_CUSTOMERS):
    name = faker.name().replace("'", "''")
    email = faker.email()
    phone = faker.phone_number()
    address = faker.address().replace('\n', ', ').replace("'", "''")
    sql_statements.append(f"INSERT INTO customers (name, email, phone, address) "
                          f"VALUES ('{name}', '{email}', '{phone}', '{address}');")

# Products
for _ in range(NUM_PRODUCTS):
    name = faker.word().capitalize().replace("'", "''")
    description = faker.sentence().replace("'", "''")
    price = round(random.uniform(5.0, 1000.0), 2)
    quantity = random.randint(0, 500)
    supplier_id = random.randint(1, NUM_SUPPLIERS)
    warehouse_id = random.randint(1, NUM_WAREHOUSES)
    category_id = random.randint(1, len(categories))
    image_url = f"https://api.dicebear.com/9.x/identicon/svg?seed={name}"
    sql_statements.append(f"INSERT INTO products (name, description, price, quantity, supplier_id, warehouse_id, category_id, image_url) "
                          f"VALUES ('{name}', '{description}', {price}, {quantity}, {supplier_id}, {warehouse_id}, {category_id}, '{image_url}');")

# Orders
for _ in range(NUM_ORDERS):
    customer_id = random.randint(1, NUM_CUSTOMERS)
    status = random.choice(['pending', 'completed', 'cancelled'])
    sql_statements.append(f"INSERT INTO orders (customer_id, status) VALUES ({customer_id}, '{status}');")

# Order Items
order_item_ids = []
for i in range(NUM_ORDER_ITEMS):
    order_id = random.randint(1, NUM_ORDERS)
    sql_statements.append(f"INSERT INTO order_items (order_id) VALUES ({order_id});")
    order_item_ids.append(i + 1)

# Product Order Items
used_combinations = set()
for _ in range(NUM_ORDER_ITEMS):
    while True:
        product_id = random.randint(1, NUM_PRODUCTS)
        order_item_id = random.choice(order_item_ids)
        combination = (product_id, order_item_id)
        if combination not in used_combinations:
            used_combinations.add(combination)
            break
    quantity = random.randint(1, 10)
    total_price = round(random.uniform(5.0, 1000.0), 2)
    sql_statements.append(f"INSERT INTO product_order_items (product_id, order_item_id, quantity, total_price) "
                          f"VALUES ({product_id}, {order_item_id}, {quantity}, {total_price});")


# Write to SQL file
with open("./ims-database/init-scripts/init-db2.sql", "w", encoding="utf-8") as f:
    f.write("\n".join(sql_statements))

print("Fake data generated and written to init-db2.sql")