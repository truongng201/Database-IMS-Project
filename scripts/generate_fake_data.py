from faker import Faker
import random
from datetime import datetime, timedelta

faker = Faker()

def generate_realistic_date(months_back=6, growth_pattern=True):
    """Generate a realistic date within the specified time range with optional growth pattern"""
    now = datetime.now()
    
    # Define time range
    days_back = months_back * 30  # Approximate days per month
    earliest_date = now - timedelta(days=days_back)
    
    if growth_pattern:
        # Create more realistic business pattern with some variability
        # Not pure growth - some periods may have declines or flat periods
        days_ago = random.choices(
            range(0, days_back + 1),
            weights=[
                # Create a more realistic business pattern
                # Recent months get higher weight, but with some randomness
                max(1, int(8 + (days_back - day) / 8 + random.uniform(-2, 3))) 
                for day in range(0, days_back + 1)
            ]
        )[0]
    else:
        # Uniform distribution
        days_ago = random.randint(0, days_back)
    
    generated_date = now - timedelta(days=days_ago)
    
    # Add some random hours/minutes to make it more realistic
    generated_date = generated_date.replace(
        hour=random.randint(8, 22),
        minute=random.randint(0, 59),
        second=random.randint(0, 59),
        microsecond=0
    )
    
    return generated_date.strftime('%Y-%m-%d %H:%M:%S')

def generate_order_date():
    """Generate a realistic order date within the last 6 months with growth pattern"""
    return generate_realistic_date(months_back=6, growth_pattern=True)

# Constants
NUM_SUPPLIERS = 100
NUM_WAREHOUSES = 5
NUM_PRODUCTS = 1000
NUM_CUSTOMERS = 100
NUM_ORDERS = 1000
NUM_ORDER_ITEMS = 1000

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
    created_time = generate_realistic_date(months_back=12, growth_pattern=False)  # Categories created over 12 months, uniform distribution
    updated_time = created_time  # Initially same as created_time
    sql_statements.append(f"INSERT INTO categories (name, description, created_time, updated_time) VALUES ('{name}', '{description}', '{created_time}', '{updated_time}');")

# Suppliers
for _ in range(NUM_SUPPLIERS):
    name = faker.company().replace("'", "''")
    contact_name = faker.name().replace("'", "''")
    contact_email = faker.company_email()
    phone = faker.phone_number()
    created_time = generate_realistic_date(months_back=18, growth_pattern=True)  # Suppliers added over 18 months with growth
    updated_time = created_time  # Initially same as created_time
    sql_statements.append(f"INSERT INTO suppliers (name, contact_name, contact_email, phone, created_time, updated_time) "
                          f"VALUES ('{name}', '{contact_name}', '{contact_email}', '{phone}', '{created_time}', '{updated_time}');")

# Warehouses
for _ in range(NUM_WAREHOUSES):
    name = faker.city().replace("'", "''")
    address = faker.street_address().replace("'", "''")
    created_time = generate_realistic_date(months_back=24, growth_pattern=False)  # Warehouses established over 24 months, uniform
    updated_time = created_time  # Initially same as created_time
    sql_statements.append(f"INSERT INTO warehouses (name, address, created_time, updated_time) "
                          f"VALUES ('{name}', '{address}', '{created_time}', '{updated_time}');")

# Users
admin_created_time = generate_realistic_date(months_back=24, growth_pattern=False)  # Admin user created early
sql_statements.append(f"INSERT INTO users (username, email, password_hash, role_name, warehouse_id, is_active, image_url, created_time, updated_time) "
                      f"VALUES ('admin', 'admin@admin.com', '$2b$12$MhPoat8o/LgpoL2spnBagetd5YPqa1HwP6dzRpGg4O1PQ8mwMLQSy', 'admin', 1, TRUE, 'https://api.dicebear.com/9.x/identicon/svg?seed=admin', '{admin_created_time}', '{admin_created_time}');")

# Customers
for _ in range(NUM_CUSTOMERS):
    name = faker.name().replace("'", "''")
    email = faker.email()
    phone = faker.phone_number()
    address = faker.address().replace('\n', ', ').replace("'", "''")
    created_time = generate_realistic_date(months_back=8, growth_pattern=True)  # Customer acquisition over 8 months with growth
    updated_time = created_time  # Initially same as created_time
    sql_statements.append(f"INSERT INTO customers (name, email, phone, address, created_time, updated_time) "
                          f"VALUES ('{name}', '{email}', '{phone}', '{address}', '{created_time}', '{updated_time}');")

# Products
product_warehouse_map = {}  # Maps product_id to warehouse_id
warehouse_product_counts = {i: 0 for i in range(1, NUM_WAREHOUSES + 1)}  # Track products per warehouse
for product_id in range(1, NUM_PRODUCTS + 1):
    name = faker.word().capitalize().replace("'", "''")
    description = faker.sentence().replace("'", "''")
    price = round(random.uniform(5.0, 1000.0), 2)
    quantity = random.randint(0, 500)
    supplier_id = random.randint(1, NUM_SUPPLIERS)
    # Distribute products evenly across warehouses
    warehouse_id = (product_id % NUM_WAREHOUSES) + 1
    warehouse_product_counts[warehouse_id] += 1
    category_id = random.randint(1, len(categories))
    image_url = f"https://api.dicebear.com/9.x/identicon/svg?seed={name}"
    created_time = generate_realistic_date(months_back=10, growth_pattern=True)  # Product creation over 10 months with growth
    updated_time = created_time  # Initially same as created_time
    product_warehouse_map[product_id] = warehouse_id
    sql_statements.append(f"INSERT INTO products (name, description, price, quantity, supplier_id, warehouse_id, category_id, image_url, created_time, updated_time) "
                          f"VALUES ('{name}', '{description}', {price}, {quantity}, {supplier_id}, {warehouse_id}, {category_id}, '{image_url}', '{created_time}', '{updated_time}');")

# Orders
order_warehouse_map = {}  # Maps order_id to warehouse_id (in memory only)
for order_id in range(1, NUM_ORDERS + 1):
    customer_id = random.randint(1, NUM_CUSTOMERS)
    status = random.choice(['pending', 'completed', 'cancelled'])
    order_date = generate_order_date()
    created_time = order_date  # Order created same time as order date
    updated_time = order_date  # Initially same as created_time
    # Assign a random warehouse to each order (not stored in DB)
    warehouse_id = random.randint(1, NUM_WAREHOUSES)
    order_warehouse_map[order_id] = warehouse_id
    sql_statements.append(f"INSERT INTO orders (customer_id, order_date, status, created_time, updated_time) "
                          f"VALUES ({customer_id}, '{order_date}', '{status}', '{created_time}', '{updated_time}');")

# Order Items
order_item_to_order = {}  # Maps order_item_id to order_id
order_item_id = 1

# Step 1: Ensure each order has at least one order_item
for order_id in range(1, NUM_ORDERS + 1):
    order_item_to_order[order_item_id] = order_id
    sql_statements.append(f"INSERT INTO order_items (order_id) VALUES ({order_id});")
    order_item_id += 1

# Step 2: Distribute remaining order_items (if any) randomly
remaining_items = NUM_ORDER_ITEMS - NUM_ORDERS
if remaining_items > 0:
    for _ in range(remaining_items):
        order_id = random.randint(1, NUM_ORDERS)
        order_item_to_order[order_item_id] = order_id
        sql_statements.append(f"INSERT INTO order_items (order_id) VALUES ({order_id});")
        order_item_id += 1

# Product Order Items
used_combinations = set()
max_attempts = NUM_ORDER_ITEMS * 10  # Safeguard to prevent infinite loop
attempt = 0

for order_item_id in range(1, NUM_ORDER_ITEMS + 1):
    while attempt < max_attempts:
        order_id = order_item_to_order[order_item_id]
        warehouse_id = order_warehouse_map[order_id]
        available_products = [pid for pid, wid in product_warehouse_map.items() if wid == warehouse_id]
        
        if not available_products:
            attempt += 1
            continue
        
        product_id = random.choice(available_products)
        combination = (product_id, order_item_id)
        if combination not in used_combinations:
            used_combinations.add(combination)
            quantity = random.randint(1, 10)
            # Get product price for accurate total_price
            for stmt in sql_statements:
                if f"INSERT INTO products" in stmt and f"VALUES ('{product_id}'," in stmt:
                    price = float(stmt.split(',')[3].strip())
                    break
            total_price = round(quantity * price, 2)
            sql_statements.append(f"INSERT INTO product_order_items (product_id, order_item_id, quantity, total_price) "
                                  f"VALUES ({product_id}, {order_item_id}, {quantity}, {total_price});")
            break
        attempt += 1
    
    if attempt >= max_attempts:
        print(f"Warning: Could not find unique combination for order_item_id {order_item_id} after {max_attempts} attempts. Skipping.")
        break

# Write to SQL file
with open("./ims-database/init-scripts/init-db2.sql", "w", encoding="utf-8") as f:
    f.write("\n".join(sql_statements))

print("Fake data generated and written to init-db2.sql")
print("Product distribution per warehouse:", warehouse_product_counts)