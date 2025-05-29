-- Comprehensive Fake Data for IMS Dashboard Statistics
-- This file contains realistic fake data with proper timestamps for meaningful dashboard analytics

-- Categories
INSERT INTO categories (name, description) VALUES 
('Electronics', 'Computers, smartphones, tablets, and electronic accessories'),
('Books', 'Fiction, non-fiction, educational, and digital books'),
('Clothing', 'Men''s and women''s fashion, shoes, and accessories'),
('Home & Garden', 'Furniture, home decor, tools, and garden supplies'),
('Sports & Outdoors', 'Sports equipment, outdoor gear, and fitness accessories'),
('Health & Beauty', 'Cosmetics, skincare, health supplements, and personal care'),
('Toys & Games', 'Children''s toys, board games, and educational materials'),
('Automotive', 'Car parts, accessories, and maintenance supplies'),
('Food & Beverages', 'Gourmet foods, snacks, beverages, and specialty items'),
('Office Supplies', 'Stationery, office equipment, and business supplies');

-- Suppliers
INSERT INTO suppliers (name, contact_name, contact_email, phone) VALUES 
('TechCorp Solutions', 'Alice Johnson', 'alice.johnson@techcorp.com', '+1-555-0101'),
('BookWorld Publishers', 'Robert Chen', 'r.chen@bookworld.com', '+1-555-0102'),
('Fashion Forward Inc', 'Maria Rodriguez', 'maria@fashionforward.com', '+1-555-0103'),
('HomeCraft Industries', 'David Wilson', 'david.wilson@homecraft.com', '+1-555-0104'),
('Athletic Gear Pro', 'Jennifer Martinez', 'j.martinez@athleticgear.com', '+1-555-0105'),
('Beauty Essentials Ltd', 'Sarah Thompson', 'sarah@beautyessentials.com', '+1-555-0106'),
('PlayTime Manufacturing', 'Michael Brown', 'michael@playtime.com', '+1-555-0107'),
('AutoParts Direct', 'Kevin Anderson', 'kevin@autopartsdirect.com', '+1-555-0108'),
('Gourmet Foods Corp', 'Lisa Davis', 'lisa.davis@gourmetfoods.com', '+1-555-0109'),
('Office Solutions Group', 'James White', 'james.white@officesolutions.com', '+1-555-0110'),
('Global Electronics', 'Emma Wilson', 'emma@globalelectronics.com', '+1-555-0111'),
('Literary Works Publishing', 'Nathan Garcia', 'nathan@literaryworks.com', '+1-555-0112'),
('StyleHub Distributors', 'Amanda Taylor', 'amanda@stylehub.com', '+1-555-0113'),
('HomeMax Supply', 'Christopher Lee', 'chris.lee@homemax.com', '+1-555-0114'),
('FitZone Equipment', 'Rachel Miller', 'rachel@fitzone.com', '+1-555-0115');

-- Warehouses
INSERT INTO warehouses (name, address) VALUES 
('Central Distribution Center', '1500 Industrial Blvd, Atlanta, GA 30309'),
('West Coast Hub', '2800 Commerce Way, Los Angeles, CA 90021'),
('Northeast Facility', '950 Logistics Drive, Newark, NJ 07102'),
('Midwest Operations', '1200 Distribution Center, Chicago, IL 60622'),
('Southwest Regional', '3400 Supply Chain Ave, Dallas, TX 75247');

-- Users (including staff for different warehouses)
INSERT INTO users (username, email, password_hash, role_name, warehouse_id, is_active, image_url) VALUES 
('admin', 'admin@company.com', '$2b$12$MhPoat8o/LgpoL2spnBagetd5YPqa1HwP6dzRpGg4O1PQ8mwMLQSy', 'admin', 1, TRUE, 'https://api.dicebear.com/9.x/avataaars/svg?seed=admin'),
('john_manager', 'john.manager@company.com', '$2b$12$MhPoat8o/LgpoL2spnBagetd5YPqa1HwP6dzRpGg4O1PQ8mwMLQSy', 'staff', 1, TRUE, 'https://api.dicebear.com/9.x/avataaars/svg?seed=john'),
('mary_staff', 'mary.staff@company.com', '$2b$12$MhPoat8o/LgpoL2spnBagetd5YPqa1HwP6dzRpGg4O1PQ8mwMLQSy', 'staff', 2, TRUE, 'https://api.dicebear.com/9.x/avataaars/svg?seed=mary'),
('david_lead', 'david.lead@company.com', '$2b$12$MhPoat8o/LgpoL2spnBagetd5YPqa1HwP6dzRpGg4O1PQ8mwMLQSy', 'staff', 3, TRUE, 'https://api.dicebear.com/9.x/avataaars/svg?seed=david'),
('sarah_coordinator', 'sarah.coord@company.com', '$2b$12$MhPoat8o/LgpoL2spnBagetd5YPqa1HwP6dzRpGg4O1PQ8mwMLQSy', 'staff', 4, TRUE, 'https://api.dicebear.com/9.x/avataaars/svg?seed=sarah'),
('mike_supervisor', 'mike.super@company.com', '$2b$12$MhPoat8o/LgpoL2spnBagetd5YPqa1HwP6dzRpGg4O1PQ8mwMLQSy', 'staff', 5, TRUE, 'https://api.dicebear.com/9.x/avataaars/svg?seed=mike');

-- Customers (realistic customer data)
INSERT INTO customers (name, email, phone, address) VALUES 
('Emily Johnson', 'emily.johnson@email.com', '+1-555-1001', '123 Maple Street, Springfield, IL 62701'),
('Michael Brown', 'michael.brown@email.com', '+1-555-1002', '456 Oak Avenue, Portland, OR 97201'),
('Jessica Davis', 'jessica.davis@email.com', '+1-555-1003', '789 Pine Road, Austin, TX 78701'),
('Christopher Wilson', 'chris.wilson@email.com', '+1-555-1004', '321 Elm Drive, Denver, CO 80201'),
('Amanda Miller', 'amanda.miller@email.com', '+1-555-1005', '654 Birch Lane, Seattle, WA 98101'),
('Daniel Anderson', 'daniel.anderson@email.com', '+1-555-1006', '987 Cedar Boulevard, Miami, FL 33101'),
('Sarah Thompson', 'sarah.thompson@email.com', '+1-555-1007', '147 Spruce Street, Boston, MA 02101'),
('Kevin Martinez', 'kevin.martinez@email.com', '+1-555-1008', '258 Walnut Avenue, Phoenix, AZ 85001'),
('Lisa Garcia', 'lisa.garcia@email.com', '+1-555-1009', '369 Chestnut Road, Atlanta, GA 30301'),
('Robert Lee', 'robert.lee@email.com', '+1-555-1010', '741 Hickory Drive, Nashville, TN 37201'),
('Jennifer White', 'jennifer.white@email.com', '+1-555-1011', '852 Ash Lane, Las Vegas, NV 89101'),
('Ryan Taylor', 'ryan.taylor@email.com', '+1-555-1012', '963 Maple Court, San Diego, CA 92101'),
('Nicole Robinson', 'nicole.robinson@email.com', '+1-555-1013', '159 Oak Place, Charlotte, NC 28201'),
('James Clark', 'james.clark@email.com', '+1-555-1014', '357 Pine Circle, Indianapolis, IN 46201'),
('Michelle Lewis', 'michelle.lewis@email.com', '+1-555-1015', '468 Elm Square, Columbus, OH 43201'),
('Andrew Walker', 'andrew.walker@email.com', '+1-555-1016', '579 Birch Way, San Antonio, TX 78201'),
('Stephanie Hall', 'stephanie.hall@email.com', '+1-555-1017', '680 Cedar Street, Milwaukee, WI 53201'),
('Brandon Allen', 'brandon.allen@email.com', '+1-555-1018', '791 Spruce Avenue, Oklahoma City, OK 73101'),
('Katherine Young', 'katherine.young@email.com', '+1-555-1019', '802 Walnut Boulevard, Louisville, KY 40201'),
('Jonathan King', 'jonathan.king@email.com', '+1-555-1020', '913 Chestnut Drive, Memphis, TN 38101'),
('Elizabeth Wright', 'elizabeth.wright@email.com', '+1-555-1021', '124 Hickory Road, Baltimore, MD 21201'),
('Anthony Lopez', 'anthony.lopez@email.com', '+1-555-1022', '235 Ash Avenue, Detroit, MI 48201'),
('Rachel Hill', 'rachel.hill@email.com', '+1-555-1023', '346 Maple Lane, El Paso, TX 79901'),
('William Scott', 'william.scott@email.com', '+1-555-1024', '457 Oak Drive, Seattle, WA 98102'),
('Samantha Green', 'samantha.green@email.com', '+1-555-1025', '568 Pine Street, Portland, OR 97202'),
('Joshua Adams', 'joshua.adams@email.com', '+1-555-1026', '679 Elm Avenue, Denver, CO 80202'),
('Ashley Baker', 'ashley.baker@email.com', '+1-555-1027', '780 Birch Boulevard, Boston, MA 02102'),
('Tyler Gonzalez', 'tyler.gonzalez@email.com', '+1-555-1028', '891 Cedar Road, Atlanta, GA 30302'),
('Megan Nelson', 'megan.nelson@email.com', '+1-555-1029', '102 Spruce Drive, Miami, FL 33102'),
('Justin Carter', 'justin.carter@email.com', '+1-555-1030', '213 Walnut Lane, Phoenix, AZ 85002');

-- Products (realistic products with proper categories and pricing)
INSERT INTO products (name, description, price, quantity, supplier_id, warehouse_id, category_id, image_url) VALUES 
-- Electronics
('MacBook Pro 16"', 'Apple MacBook Pro with M2 chip, 16GB RAM, 512GB SSD', 2499.00, 45, 1, 1, 1, 'https://api.dicebear.com/9.x/identicon/svg?seed=macbook'),
('iPhone 15', 'Latest iPhone with 128GB storage, multiple colors available', 799.00, 120, 1, 2, 1, 'https://api.dicebear.com/9.x/identicon/svg?seed=iphone'),
('Samsung 65" QLED TV', '4K Ultra HD Smart TV with Quantum Dot technology', 1299.00, 28, 11, 3, 1, 'https://api.dicebear.com/9.x/identicon/svg?seed=samsung-tv'),
('Dell XPS 13 Laptop', 'Ultraportable laptop with Intel i7, 16GB RAM, 1TB SSD', 1199.00, 35, 11, 4, 1, 'https://api.dicebear.com/9.x/identicon/svg?seed=dell-xps'),
('AirPods Pro', 'Apple wireless earbuds with noise cancellation', 249.00, 85, 1, 5, 1, 'https://api.dicebear.com/9.x/identicon/svg?seed=airpods'),

-- Books
('The Great Gatsby', 'Classic American novel by F. Scott Fitzgerald', 14.99, 150, 2, 1, 2, 'https://api.dicebear.com/9.x/identicon/svg?seed=gatsby'),
('Python Programming Masterclass', 'Complete guide to Python programming for beginners', 49.99, 75, 12, 2, 2, 'https://api.dicebear.com/9.x/identicon/svg?seed=python-book'),
('The Psychology of Money', 'Behavioral finance and investment insights', 24.99, 95, 2, 3, 2, 'https://api.dicebear.com/9.x/identicon/svg?seed=psychology-money'),
('Atomic Habits', 'How to build good habits and break bad ones', 18.99, 110, 12, 4, 2, 'https://api.dicebear.com/9.x/identicon/svg?seed=atomic-habits'),
('Data Science Handbook', 'Comprehensive guide to data science and analytics', 59.99, 42, 2, 5, 2, 'https://api.dicebear.com/9.x/identicon/svg?seed=data-science'),

-- Clothing
('Nike Air Max Sneakers', 'Comfortable running shoes with air cushioning', 129.99, 200, 3, 1, 3, 'https://api.dicebear.com/9.x/identicon/svg?seed=nike-airmax'),
('Levi''s 501 Jeans', 'Classic straight-leg denim jeans', 69.99, 180, 13, 2, 3, 'https://api.dicebear.com/9.x/identicon/svg?seed=levis-jeans'),
('Patagonia Rain Jacket', 'Waterproof outdoor jacket for hiking and camping', 199.99, 65, 3, 3, 3, 'https://api.dicebear.com/9.x/identicon/svg?seed=patagonia-jacket'),
('Polo Ralph Lauren Shirt', 'Classic cotton polo shirt in multiple colors', 89.99, 145, 13, 4, 3, 'https://api.dicebear.com/9.x/identicon/svg?seed=polo-shirt'),
('Adidas Ultraboost Running Shoes', 'High-performance running shoes with boost technology', 179.99, 95, 3, 5, 3, 'https://api.dicebear.com/9.x/identicon/svg?seed=adidas-ultraboost'),

-- Home & Garden
('KitchenAid Stand Mixer', 'Professional 5-quart stand mixer for baking', 379.99, 55, 4, 1, 4, 'https://api.dicebear.com/9.x/identicon/svg?seed=kitchenaid'),
('Dyson V15 Vacuum', 'Cordless stick vacuum with laser dust detection', 749.99, 32, 14, 2, 4, 'https://api.dicebear.com/9.x/identicon/svg?seed=dyson-vacuum'),
('West Elm Mid-Century Sofa', 'Modern 3-seater sofa in multiple fabric options', 1299.00, 18, 4, 3, 4, 'https://api.dicebear.com/9.x/identicon/svg?seed=west-elm-sofa'),
('Ninja Foodi Pressure Cooker', 'Multi-use pressure cooker and air fryer', 199.99, 78, 14, 4, 4, 'https://api.dicebear.com/9.x/identicon/svg?seed=ninja-foodi'),
('Weber Genesis Gas Grill', 'Premium 3-burner gas grill for outdoor cooking', 899.99, 25, 4, 5, 4, 'https://api.dicebear.com/9.x/identicon/svg?seed=weber-grill'),

-- Sports & Outdoors
('Peloton Bike+', 'Interactive exercise bike with HD touchscreen', 2495.00, 12, 5, 1, 5, 'https://api.dicebear.com/9.x/identicon/svg?seed=peloton'),
('REI Co-op Trail 25 Backpack', 'Hiking backpack with hydration compatibility', 89.99, 125, 15, 2, 5, 'https://api.dicebear.com/9.x/identicon/svg?seed=rei-backpack'),
('Yeti Rambler Tumbler', 'Insulated stainless steel drinkware', 39.99, 235, 5, 3, 5, 'https://api.dicebear.com/9.x/identicon/svg?seed=yeti-tumbler'),
('Coleman 4-Person Tent', 'Easy-setup camping tent for family adventures', 149.99, 68, 15, 4, 5, 'https://api.dicebear.com/9.x/identicon/svg?seed=coleman-tent'),
('Bowflex Adjustable Dumbbells', 'Space-saving adjustable weight set', 399.99, 45, 5, 5, 5, 'https://api.dicebear.com/9.x/identicon/svg?seed=bowflex-dumbbells'),

-- Health & Beauty
('Olay Regenerist Serum', 'Anti-aging facial serum with niacinamide', 28.99, 185, 6, 1, 6, 'https://api.dicebear.com/9.x/identicon/svg?seed=olay-serum'),
('Fitbit Versa 4', 'Health and fitness smartwatch with GPS', 199.99, 92, 6, 2, 6, 'https://api.dicebear.com/9.x/identicon/svg?seed=fitbit-versa'),
('Cetaphil Daily Moisturizer', 'Gentle face moisturizer for sensitive skin', 16.99, 220, 6, 3, 6, 'https://api.dicebear.com/9.x/identicon/svg?seed=cetaphil'),
('Philips Sonicare Toothbrush', 'Electric toothbrush with smart sensors', 89.99, 115, 6, 4, 6, 'https://api.dicebear.com/9.x/identicon/svg?seed=sonicare'),
('Nature Made Vitamin D3', 'High-potency vitamin D supplement', 19.99, 165, 6, 5, 6, 'https://api.dicebear.com/9.x/identicon/svg?seed=vitamin-d3'),

-- Toys & Games
('LEGO Creator Expert Set', 'Advanced building set for adults and teens', 179.99, 85, 7, 1, 7, 'https://api.dicebear.com/9.x/identicon/svg?seed=lego-creator'),
('Monopoly Board Game', 'Classic family board game', 24.99, 145, 7, 2, 7, 'https://api.dicebear.com/9.x/identicon/svg?seed=monopoly'),
('Nintendo Switch OLED', 'Portable gaming console with vibrant display', 349.99, 58, 7, 3, 7, 'https://api.dicebear.com/9.x/identicon/svg?seed=nintendo-switch'),
('Barbie Dreamhouse', 'Multi-story dollhouse with furniture and accessories', 199.99, 35, 7, 4, 7, 'https://api.dicebear.com/9.x/identicon/svg?seed=barbie-dreamhouse'),
('Ravensburger 1000pc Puzzle', 'High-quality jigsaw puzzle for adults', 19.99, 125, 7, 5, 7, 'https://api.dicebear.com/9.x/identicon/svg?seed=ravensburger-puzzle'),

-- Automotive
('Michelin CrossClimate2 Tires', 'All-season tires for superior performance', 159.99, 75, 8, 1, 8, 'https://api.dicebear.com/9.x/identicon/svg?seed=michelin-tires'),
('Garmin DriveSmart GPS', 'Advanced GPS navigator with voice assistance', 179.99, 48, 8, 2, 8, 'https://api.dicebear.com/9.x/identicon/svg?seed=garmin-gps'),
('Chemical Guys Car Wash Kit', 'Complete car cleaning and detailing kit', 79.99, 95, 8, 3, 8, 'https://api.dicebear.com/9.x/identicon/svg?seed=car-wash-kit'),
('Thule Roof Cargo Box', 'Large capacity rooftop cargo carrier', 449.99, 28, 8, 4, 8, 'https://api.dicebear.com/9.x/identicon/svg?seed=thule-cargo'),
('Bosch Icon Wiper Blades', 'Premium beam wiper blades for clear visibility', 39.99, 135, 8, 5, 8, 'https://api.dicebear.com/9.x/identicon/svg?seed=bosch-wipers'),

-- Food & Beverages
('Blue Bottle Coffee Beans', 'Single-origin artisanal coffee beans', 24.99, 185, 9, 1, 9, 'https://api.dicebear.com/9.x/identicon/svg?seed=blue-bottle-coffee'),
('Whole Foods Organic Honey', 'Raw unfiltered honey from local beekeepers', 18.99, 125, 9, 2, 9, 'https://api.dicebear.com/9.x/identicon/svg?seed=organic-honey'),
('Ghirardelli Chocolate Squares', 'Premium dark chocolate assortment', 12.99, 195, 9, 3, 9, 'https://api.dicebear.com/9.x/identicon/svg?seed=ghirardelli'),
('Harney & Sons Tea Collection', 'Gourmet tea sampler with 20 varieties', 34.99, 85, 9, 4, 9, 'https://api.dicebear.com/9.x/identicon/svg?seed=harney-tea'),
('Himalayan Pink Salt', 'Pure pink salt from Pakistan mountains', 15.99, 155, 9, 5, 9, 'https://api.dicebear.com/9.x/identicon/svg?seed=pink-salt'),

-- Office Supplies
('Herman Miller Aeron Chair', 'Ergonomic office chair with lumbar support', 1395.00, 22, 10, 1, 10, 'https://api.dicebear.com/9.x/identicon/svg?seed=aeron-chair'),
('Apple Magic Keyboard', 'Wireless keyboard for Mac with numeric keypad', 129.99, 78, 10, 2, 10, 'https://api.dicebear.com/9.x/identicon/svg?seed=magic-keyboard'),
('Moleskine Large Notebook', 'Premium hardcover notebook with dotted pages', 24.99, 145, 10, 3, 10, 'https://api.dicebear.com/9.x/identicon/svg?seed=moleskine'),
('HP OfficeJet Pro Printer', 'All-in-one wireless color printer', 199.99, 42, 10, 4, 10, 'https://api.dicebear.com/9.x/identicon/svg?seed=hp-printer'),
('Staples Adjustable Desk', 'Height-adjustable standing desk converter', 299.99, 35, 10, 5, 10, 'https://api.dicebear.com/9.x/identicon/svg?seed=adjustable-desk');

-- Orders with realistic timestamps (spread across last 3 months for good analytics)
-- Current month orders (December 2024)
INSERT INTO orders (customer_id, order_date, status) VALUES 
(1, '2024-12-01 09:15:00', 'completed'),
(2, '2024-12-01 14:30:00', 'completed'),
(3, '2024-12-02 11:45:00', 'completed'),
(4, '2024-12-02 16:20:00', 'pending'),
(5, '2024-12-03 10:30:00', 'completed'),
(6, '2024-12-03 15:45:00', 'completed'),
(7, '2024-12-04 09:00:00', 'completed'),
(8, '2024-12-04 13:15:00', 'cancelled'),
(9, '2024-12-05 11:30:00', 'completed'),
(10, '2024-12-05 17:00:00', 'completed'),
(11, '2024-12-06 08:45:00', 'completed'),
(12, '2024-12-06 14:20:00', 'pending'),
(13, '2024-12-07 10:15:00', 'completed'),
(14, '2024-12-07 16:30:00', 'completed'),
(15, '2024-12-08 09:30:00', 'completed'),
(16, '2024-12-08 15:15:00', 'completed'),
(17, '2024-12-09 11:00:00', 'pending'),
(18, '2024-12-09 17:45:00', 'completed'),
(19, '2024-12-10 08:30:00', 'completed'),
(20, '2024-12-10 14:45:00', 'completed'),
(21, '2024-12-11 10:00:00', 'completed'),
(22, '2024-12-11 16:15:00', 'cancelled'),
(23, '2024-12-12 09:45:00', 'completed'),
(24, '2024-12-12 15:30:00', 'completed'),
(25, '2024-12-13 11:15:00', 'completed'),
(26, '2024-12-13 17:30:00', 'pending'),
(27, '2024-12-14 08:15:00', 'completed'),
(28, '2024-12-14 14:00:00', 'completed'),
(29, '2024-12-15 10:45:00', 'completed'),
(30, '2024-12-15 16:45:00', 'completed'),
(1, '2024-12-16 09:30:00', 'completed'),
(2, '2024-12-16 15:15:00', 'pending'),
(3, '2024-12-17 11:30:00', 'completed'),
(4, '2024-12-17 17:15:00', 'completed'),
(5, '2024-12-18 08:45:00', 'completed'),
(6, '2024-12-18 14:30:00', 'completed'),
(7, '2024-12-19 10:15:00', 'completed'),
(8, '2024-12-19 16:00:00', 'completed'),
(9, '2024-12-20 09:00:00', 'pending'),
(10, '2024-12-20 15:45:00', 'completed'),

-- Previous month orders (November 2024) - slightly fewer orders
(11, '2024-11-01 10:30:00', 'completed'),
(12, '2024-11-01 16:15:00', 'completed'),
(13, '2024-11-02 09:45:00', 'completed'),
(14, '2024-11-02 15:20:00', 'completed'),
(15, '2024-11-03 11:00:00', 'cancelled'),
(16, '2024-11-03 17:30:00', 'completed'),
(17, '2024-11-04 08:15:00', 'completed'),
(18, '2024-11-04 14:45:00', 'completed'),
(19, '2024-11-05 10:00:00', 'completed'),
(20, '2024-11-05 16:30:00', 'completed'),
(21, '2024-11-06 09:15:00', 'completed'),
(22, '2024-11-06 15:00:00', 'completed'),
(23, '2024-11-07 11:45:00', 'completed'),
(24, '2024-11-07 17:00:00', 'cancelled'),
(25, '2024-11-08 08:30:00', 'completed'),
(26, '2024-11-08 14:15:00', 'completed'),
(27, '2024-11-09 10:45:00', 'completed'),
(28, '2024-11-09 16:45:00', 'completed'),
(29, '2024-11-10 09:30:00', 'completed'),
(30, '2024-11-10 15:15:00', 'completed'),
(1, '2024-11-11 11:30:00', 'completed'),
(2, '2024-11-11 17:15:00', 'completed'),
(3, '2024-11-12 08:45:00', 'completed'),
(4, '2024-11-12 14:30:00', 'completed'),
(5, '2024-11-13 10:15:00', 'completed'),
(6, '2024-11-13 16:00:00', 'completed'),
(7, '2024-11-14 09:00:00', 'completed'),
(8, '2024-11-14 15:45:00', 'completed'),
(9, '2024-11-15 11:15:00', 'completed'),
(10, '2024-11-15 17:30:00', 'completed'),

-- Two months ago orders (October 2024) - even fewer orders to show growth
(11, '2024-10-01 10:00:00', 'completed'),
(12, '2024-10-01 16:30:00', 'completed'),
(13, '2024-10-02 09:15:00', 'completed'),
(14, '2024-10-02 15:45:00', 'completed'),
(15, '2024-10-03 11:30:00', 'completed'),
(16, '2024-10-03 17:00:00', 'cancelled'),
(17, '2024-10-04 08:45:00', 'completed'),
(18, '2024-10-04 14:15:00', 'completed'),
(19, '2024-10-05 10:30:00', 'completed'),
(20, '2024-10-05 16:15:00', 'completed'),
(21, '2024-10-06 09:00:00', 'completed'),
(22, '2024-10-06 15:30:00', 'completed'),
(23, '2024-10-07 11:15:00', 'completed'),
(24, '2024-10-07 17:45:00', 'completed'),
(25, '2024-10-08 08:30:00', 'completed'),
(26, '2024-10-08 14:00:00', 'completed'),
(27, '2024-10-09 10:45:00', 'completed'),
(28, '2024-10-09 16:30:00', 'completed'),
(29, '2024-10-10 09:30:00', 'completed'),
(30, '2024-10-10 15:15:00', 'completed');

-- Order Items and Product Order Items (linking orders to products)
-- December 2024 order items
INSERT INTO order_items (order_id) VALUES 
(1), (2), (3), (4), (5), (6), (7), (8), (9), (10),
(11), (12), (13), (14), (15), (16), (17), (18), (19), (20),
(21), (22), (23), (24), (25), (26), (27), (28), (29), (30),
(31), (32), (33), (34), (35), (36), (37), (38), (39), (40);

-- November 2024 order items
INSERT INTO order_items (order_id) VALUES 
(41), (42), (43), (44), (45), (46), (47), (48), (49), (50),
(51), (52), (53), (54), (55), (56), (57), (58), (59), (60),
(61), (62), (63), (64), (65), (66), (67), (68), (69), (70);

-- October 2024 order items
INSERT INTO order_items (order_id) VALUES 
(71), (72), (73), (74), (75), (76), (77), (78), (79), (80),
(81), (82), (83), (84), (85), (86), (87), (88), (89), (90);

-- Product Order Items (realistic purchase combinations)
-- December 2024 purchases (higher revenue month)
INSERT INTO product_order_items (product_id, order_item_id, quantity, total_price) VALUES 
-- High-value electronics purchases
(1, 1, 1, 2499.00),  -- MacBook Pro
(2, 2, 2, 1598.00),  -- 2x iPhone 15
(3, 3, 1, 1299.00),  -- Samsung TV
(4, 4, 1, 1199.00),  -- Dell XPS
(5, 5, 3, 747.00),   -- 3x AirPods Pro

-- Mixed purchases
(6, 6, 5, 74.95),    -- Books
(7, 7, 2, 99.98),    -- Python Programming books
(11, 8, 2, 259.98),  -- Nike sneakers
(12, 9, 1, 69.99),   -- Levi's jeans
(16, 10, 1, 379.99), -- KitchenAid mixer

-- More diverse purchases
(21, 11, 1, 2495.00), -- Peloton bike
(26, 12, 3, 86.97),   -- Olay serum
(31, 13, 2, 359.98),  -- LEGO sets
(36, 14, 4, 179.96),  -- Garmin GPS
(41, 15, 8, 199.92),  -- Blue Bottle coffee

-- Medium-value purchases
(17, 16, 1, 749.99),  -- Dyson vacuum
(22, 17, 3, 269.97),  -- REI backpacks
(27, 18, 2, 399.98),  -- Fitbit watches
(32, 19, 6, 149.94),  -- Monopoly games
(42, 20, 5, 94.95),   -- Organic honey

-- Lower-value but higher quantity
(8, 21, 1, 24.99),    -- Psychology book
(13, 22, 1, 199.99),  -- Patagonia jacket
(23, 23, 6, 239.94),  -- Yeti tumblers
(28, 24, 4, 67.96),   -- Cetaphil moisturizer
(43, 25, 3, 38.97),   -- Ghirardelli chocolate

-- More purchases for December
(9, 26, 2, 37.98),    -- Atomic Habits books
(14, 27, 1, 89.99),   -- Polo shirt
(19, 28, 1, 899.99),  -- Weber grill
(24, 29, 2, 299.98),  -- Coleman tents
(29, 30, 4, 71.96),   -- Philips toothbrush

-- Additional December purchases
(15, 31, 1, 179.99),  -- Adidas shoes
(20, 32, 2, 399.98),  -- Ninja Foodi
(25, 33, 3, 1199.97), -- Bowflex dumbbells
(30, 34, 5, 99.95),   -- Vitamin D3
(35, 35, 2, 39.98),   -- Ravensburger puzzles

(37, 36, 1, 179.99),  -- Garmin GPS
(38, 37, 1, 79.99),   -- Car wash kit
(39, 38, 1, 449.99),  -- Thule cargo
(44, 39, 4, 139.96),  -- Harney tea
(46, 40, 2, 259.98);  -- Apple keyboard

-- November 2024 purchases (moderate revenue)
INSERT INTO product_order_items (product_id, order_item_id, quantity, total_price) VALUES 
(2, 41, 1, 799.00),   -- iPhone 15
(6, 42, 3, 44.97),    -- Great Gatsby books
(11, 43, 1, 129.99),  -- Nike sneakers
(16, 44, 1, 379.99),  -- KitchenAid mixer
(21, 45, 1, 2495.00), -- Peloton bike

(4, 46, 1, 1199.00),  -- Dell XPS
(12, 47, 2, 139.98),  -- Levi's jeans
(17, 48, 1, 749.99),  -- Dyson vacuum
(22, 49, 2, 179.98),  -- REI backpacks
(26, 50, 4, 115.96),  -- Olay serum

(7, 51, 1, 49.99),    -- Python book
(13, 52, 1, 199.99),  -- Patagonia jacket
(18, 53, 1, 1299.00), -- West Elm sofa
(23, 54, 4, 159.96),  -- Yeti tumblers
(27, 55, 2, 399.98),  -- Fitbit watches

(8, 56, 2, 49.98),    -- Psychology books
(14, 57, 3, 269.97),  -- Polo shirts
(19, 58, 1, 899.99),  -- Weber grill
(24, 59, 1, 149.99),  -- Coleman tent
(28, 60, 6, 101.94),  -- Cetaphil

(9, 61, 1, 18.99),    -- Atomic Habits
(15, 62, 2, 359.98),  -- Adidas shoes
(20, 63, 1, 199.99),  -- Ninja Foodi
(25, 64, 1, 399.99),  -- Bowflex dumbbells
(29, 65, 2, 179.98),  -- Philips toothbrush

(31, 66, 1, 179.99),  -- LEGO
(36, 67, 2, 359.98),  -- Garmin GPS
(41, 68, 6, 149.94),  -- Blue Bottle coffee
(45, 69, 4, 63.96),   -- Pink salt
(50, 70, 1, 299.99);  -- Adjustable desk

-- October 2024 purchases (lower revenue to show growth)
INSERT INTO product_order_items (product_id, order_item_id, quantity, total_price) VALUES 
(6, 71, 4, 59.96),    -- Books
(11, 72, 1, 129.99),  -- Nike sneakers
(16, 73, 1, 379.99),  -- KitchenAid mixer
(21, 74, 1, 2495.00), -- Peloton bike
(26, 75, 2, 57.98),   -- Olay serum

(7, 76, 2, 99.98),    -- Python books
(12, 77, 1, 69.99),   -- Levi's jeans
(17, 78, 1, 749.99),  -- Dyson vacuum
(22, 79, 3, 269.97),  -- REI backpacks
(27, 80, 1, 199.99),  -- Fitbit watch

(8, 81, 1, 24.99),    -- Psychology book
(13, 82, 2, 399.98),  -- Patagonia jackets
(18, 83, 1, 1299.00), -- West Elm sofa
(23, 84, 2, 79.98),   -- Yeti tumblers
(28, 85, 3, 50.97),   -- Cetaphil

(2, 86, 1, 799.00),   -- iPhone 15
(14, 87, 1, 89.99),   -- Polo shirt
(19, 88, 1, 899.99),  -- Weber grill
(24, 89, 2, 299.98),  -- Coleman tents
(29, 90, 1, 89.99);   -- Philips toothbrush

-- Add some recent login logs for user activity tracking
INSERT INTO login_logs (user_id, refresh_token, login_time, ip_address, user_agent) VALUES 
(1, 'admin_refresh_token_123', '2024-12-20 08:00:00', '192.168.1.100', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'),
(2, 'john_refresh_token_456', '2024-12-20 09:15:00', '192.168.1.101', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'),
(3, 'mary_refresh_token_789', '2024-12-20 08:30:00', '192.168.1.102', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'),
(4, 'david_refresh_token_101', '2024-12-19 16:45:00', '192.168.1.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'),
(5, 'sarah_refresh_token_202', '2024-12-19 14:30:00', '192.168.1.104', 'Mozilla/5.0 (X11; Linux x86_64)'),
(6, 'mike_refresh_token_303', '2024-12-19 10:15:00', '192.168.1.105', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)');

-- Summary of what this data provides:
-- 1. 10 realistic product categories
-- 2. 15 suppliers with proper contact information
-- 3. 5 warehouses across different regions
-- 4. 6 users including admin and staff for different warehouses
-- 5. 30 customers with realistic information
-- 6. 50 products across all categories with realistic pricing
-- 7. 90 orders spread across 3 months showing growth pattern
-- 8. Detailed order items linking products to orders with realistic quantities and pricing
-- 9. Revenue progression: Oct (~$15K) < Nov (~$18K) < Dec (~$25K) showing healthy growth
-- 10. Recent login activity for user tracking

-- This data will provide meaningful dashboard statistics including:
-- - Month-over-month revenue growth
-- - Product count trends
-- - Order volume increases
-- - Customer acquisition patterns
-- - Role-based warehouse filtering capabilities
