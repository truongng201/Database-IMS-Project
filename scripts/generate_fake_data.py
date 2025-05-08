from faker import Faker
import random

faker = Faker()

# Constants
NUM_SUPPLIERS = 100
NUM_LOCATIONS = 30
NUM_PRODUCTS = 1000
NUM_CUSTOMERS = 1000
NUM_ORDERS = 1000
NUM_ORDER_ITEMS = 1000
NUM_USERS = 10


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
    ["Home", "Household items and decor."],
    ["Garden", "Outdoor and gardening supplies."],
    ["Pet Supplies", "Products for pets."],
    ["Office Supplies", "Stationery and office equipment."],
    ["Jewelry", "Accessories and adornments."],
    ["Music", "Musical instruments and accessories."],
    ["Movies", "Films and entertainment media."],
    ["Video Games", "Gaming consoles and accessories."],
    ["Travel", "Luggage and travel accessories."],
    ["Tools", "Hand and power tools for DIY projects."],
    ["Health & Beauty", "Products for health and beauty."],
    ["Baby", "Products for infants and toddlers."],
    ["Gifts", "Gift items for various occasions."],
    ["Watches", "Timepieces and accessories."],
    ["Collectibles", "Items for collectors."],
    ["Crafts", "Art and craft supplies."],
    ["Musical Instruments", "Instruments and accessories."],
    ["Photography", "Cameras and photography equipment."],
    ["Computers", "Hardware and software products."],
    ["Networking", "Networking equipment and accessories."],
    ["Smart Home", "Smart devices for home automation."],
    ["Virtual Reality", "VR headsets and accessories."],
    ["Drones", "Unmanned aerial vehicles and accessories."],
    ["3D Printing", "3D printers and supplies."],
    ["Wearable Technology", "Smartwatches and fitness trackers."],
    ["Home Improvement", "Tools and materials for home renovation."],
    ["Camping & Hiking", "Outdoor gear and equipment."],
    ["Fishing", "Fishing gear and accessories."],
    ["Cycling", "Bicycles and cycling accessories."],
    ["Running", "Running shoes and apparel."],
    ["Yoga", "Yoga mats and accessories."],
    ["Fitness", "Gym equipment and fitness gear."],
    ["Outdoor Recreation", "Gear for outdoor activities."],
    ["Travel Accessories", "Items for travelers."],
    ["Camping Gear", "Equipment for camping trips."],
    ["Fishing Gear", "Equipment for fishing enthusiasts."],
    ["Cycling Gear", "Bicycles and cycling accessories."],
    ["Hiking Gear", "Equipment for hiking adventures."],
    ["Running Gear", "Shoes and apparel for runners."],
    ["Yoga Gear", "Mats and accessories for yoga practitioners."],
    ["Fitness Gear", "Equipment for fitness enthusiasts."],
    ["Outdoor Gear", "Equipment for outdoor adventures."],
    ["Travel Gear", "Accessories for travelers."],
    ["Camping Supplies", "Items for camping trips."],
    ["Fishing Supplies", "Gear for fishing enthusiasts."],
    ["Cycling Supplies", "Bicycles and cycling accessories."],
    ["Hiking Supplies", "Equipment for hiking adventures."],
    ["Running Supplies", "Shoes and apparel for runners."],
    ["Yoga Supplies", "Mats and accessories for yoga practitioners."]
]

# Predefined roles
roles = [
    ("Admin", "System administrator"),
    ("Manager", "Inventory manager"),
    ("User", "Standard user")
]

# Generate SQL inserts
sql_statements = []

# Categories
for item in categories:
    name = item[0].replace("'", "''")
    description = item[1].replace("'", "''")
    sql_statements.append(f"INSERT INTO categories (name, description) VALUES ('{name}', '{description}');")

# Roles
for role, desc in roles:
    sql_statements.append(f"INSERT INTO roles (role_name, description) VALUES ('{role}', '{desc}');")

# Suppliers
for _ in range(NUM_SUPPLIERS):
    name = faker.company().replace("'", "''")
    contact = faker.name().replace("'", "''")
    email = faker.company_email()
    phone = faker.phone_number()
    sql_statements.append(f"INSERT INTO suppliers (name, contact_name, contact_email, phone) "
                          f"VALUES ('{name}', '{contact}', '{email}', '{phone}');")

# Locations
for _ in range(NUM_LOCATIONS):
    name = faker.city().replace("'", "''")
    address = faker.street_address().replace("'", "''")
    city = faker.city().replace("'", "''")
    state = faker.state().replace("'", "''")
    zip_code = faker.postcode()
    sql_statements.append(f"INSERT INTO locations (name, address, city, state, zip_code) "
                          f"VALUES ('{name}', '{address}', '{city}', '{state}', '{zip_code}');")

# Customers
for _ in range(NUM_CUSTOMERS):
    fname = faker.first_name()
    lname = faker.last_name()
    # Generate a unique email
    email = f"{fname.lower()}.{lname.lower()}{random.randint(1, 100)}@example.com"
    phone = faker.phone_number()
    address = faker.address().replace('\n', ', ').replace("'", "''")
    sql_statements.append(f"INSERT INTO customers (first_name, last_name, email, phone, address) "
                          f"VALUES ('{fname}', '{lname}', '{email}', '{phone}', '{address}');")

# Users
for _ in range(NUM_USERS):
    username = faker.user_name()
    email = faker.email()
    full_name = faker.name().replace("'", "''")
    password_hash = faker.sha256()
    role_id = random.randint(1, len(roles))
    sql_statements.append(f"INSERT INTO users (username, email, password_hash, role_id, full_name) "
                          f"VALUES ('{username}', '{email}', '{password_hash}', {role_id}, '{full_name}');")

# Products
for _ in range(NUM_PRODUCTS):
    name = faker.word().capitalize().replace("'", "''")
    desc = faker.sentence().replace("'", "''")
    price = round(random.uniform(5.0, 1000.0), 2)
    category_id = random.randint(1, len(categories))
    supplier_id = random.randint(1, NUM_SUPPLIERS)
    location_id = random.randint(1, NUM_LOCATIONS)
    image_url = faker.image_url()
    sql_statements.append(
        f"INSERT INTO products (name, description, price, category_id, supplier_id, location_id, image_url) "
        f"VALUES ('{name}', '{desc}', {price}, {category_id}, {supplier_id}, {location_id}, '{image_url}');"
    )

# Inventory
for product_id in range(1, NUM_PRODUCTS + 1):
    quantity = random.randint(0, 500)
    sql_statements.append(f"INSERT INTO inventory (product_id, quantity) VALUES ({product_id}, {quantity});")

# Orders
for order_id in range(1, NUM_ORDERS + 1):
    customer_id = random.randint(1, NUM_CUSTOMERS)
    status = random.choice(["Pending", "Shipped", "Delivered", "Cancelled"])
    sql_statements.append(f"INSERT INTO orders (customer_id, status) VALUES ({customer_id}, '{status}');")

# Order Items
for _ in range(NUM_ORDER_ITEMS):
    order_id = random.randint(1, NUM_ORDERS)
    product_id = random.randint(1, NUM_PRODUCTS)
    quantity = random.randint(1, 10)
    price = round(random.uniform(5.0, 1000.0), 2)
    sql_statements.append(f"INSERT INTO order_items (order_id, product_id, quantity, price) "
                          f"VALUES ({order_id}, {product_id}, {quantity}, {price});")

# Write to SQL file
with open("./ims-database/init-scripts/init-db2.sql", "w", encoding="utf-8") as f:
    f.write("\n".join(sql_statements))

print("Fake data generated and written to init-db2.sql")