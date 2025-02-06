-- Drop existing tables if they exist
DROP TABLE IF EXISTS customer_menu_items CASCADE;
DROP TABLE IF EXISTS menu_item_dietary_restrictions CASCADE;
DROP TABLE IF EXISTS item_allergies CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS allergies CASCADE;
DROP TABLE IF EXISTS dietary_restrictions CASCADE;
DROP TABLE IF EXISTS customer CASCADE;
DROP TABLE IF EXISTS item_category CASCADE;

-- Create customer table
CREATE TABLE customer (
    order_no SERIAL PRIMARY KEY
);

-- Create item category table
CREATE TABLE item_category ( 
    category_id INT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- Create menu items table
CREATE TABLE menu_items (
    item_id SERIAL PRIMARY KEY,
    category_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    calories INT,
    FOREIGN KEY (category_id) REFERENCES item_category(category_id) 
);

-- Create allergies table
CREATE TABLE allergies (
    allergy_id SERIAL PRIMARY KEY, 
    name VARCHAR(40) UNIQUE NOT NULL
);

-- Create item allergies table (many-to-many)
CREATE TABLE item_allergies (
    item_id INT,
    allergy_id INT,
    PRIMARY KEY (item_id, allergy_id),
    FOREIGN KEY (item_id) REFERENCES menu_items(item_id) ON DELETE CASCADE,
    FOREIGN KEY (allergy_id) REFERENCES allergies(allergy_id) ON DELETE CASCADE
);

-- Create dietary restrictions table
CREATE TABLE dietary_restrictions (
    dietaryRes_id SERIAL PRIMARY KEY,
    dietaryRes_name VARCHAR(255) UNIQUE NOT NULL
);

-- Create menu item dietary restrictions table (many-to-many)
CREATE TABLE menu_item_dietary_restrictions (
    item_id INT,
    dietaryRes_id INT,
    PRIMARY KEY (item_id, dietaryRes_id),
    FOREIGN KEY (item_id) REFERENCES menu_items(item_id) ON DELETE CASCADE,
    FOREIGN KEY (dietaryRes_id) REFERENCES dietary_restrictions(dietaryRes_id) ON DELETE CASCADE
);

-- Create customer menu items table (many-to-many)
CREATE TABLE customer_menu_items (
    order_no INT,
    item_id INT,
    PRIMARY KEY (order_no, item_id),
    FOREIGN KEY (order_no) REFERENCES customer(order_no) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES menu_items(item_id) ON DELETE CASCADE
);

-- Insert categories
INSERT INTO item_category (category_id, name) VALUES
(1, 'Starters'),
(2, 'Main Course'),
(3, 'Desserts'),
(4, 'Drinks');

-- Insert menu items
INSERT INTO menu_items (category_id, name, description, price, calories) VALUES
(1, 'Garlic Bread', 'Crispy bread with garlic butter', 4.99, 250),
(1, 'Bruschetta', 'Toasted bread with tomatoes and basil', 5.99, 300),
(2, 'Grilled Chicken', 'Juicy grilled chicken with vegetables', 12.99, 600),
(2, 'Spaghetti Carbonara', 'Pasta with creamy sauce and bacon', 11.99, 750),
(3, 'Chocolate Cake', 'Rich chocolate cake with frosting', 6.99, 500),
(3, 'Cheesecake', 'Classic New York-style cheesecake', 7.99, 450),
(4, 'Orange Juice', 'Freshly squeezed orange juice', 3.99, 120),
(4, 'Cappuccino', 'Italian coffee with steamed milk foam', 4.49, 150);

-- Insert allergies
INSERT INTO allergies (name) VALUES
('Gluten'),
('Dairy'),
('Nuts'),
('Eggs'),
('Shellfish');

-- Insert item allergies (associating menu items with allergies)
INSERT INTO item_allergies (item_id, allergy_id) VALUES
(1, 1), -- Garlic Bread contains Gluten
(2, 1), -- Bruschetta contains Gluten
(3, 0), -- Grilled Chicken has no allergies
(4, 1), -- Spaghetti Carbonara contains Gluten
(4, 2), -- Spaghetti Carbonara contains Dairy
(5, 2), -- Chocolate Cake contains Dairy
(5, 4), -- Chocolate Cake contains Eggs
(6, 2), -- Cheesecake contains Dairy
(7, 0), -- Orange Juice has no allergies
(8, 2); -- Cappuccino contains Dairy

-- Insert dietary restrictions
INSERT INTO dietary_restrictions (dietaryRes_name) VALUES
('Vegetarian'),
('Vegan'),
('Gluten-Free'),
('Dairy-Free'),
('Nut-Free');

-- Insert menu item dietary restrictions (associating menu items with restrictions)
INSERT INTO menu_item_dietary_restrictions (item_id, dietaryRes_id) VALUES
(1, 1), -- Garlic Bread is Vegetarian
(2, 1), -- Bruschetta is Vegetarian
(3, 3), -- Grilled Chicken is Gluten-Free
(5, 1), -- Chocolate Cake is Vegetarian
(7, 2), -- Orange Juice is Vegan
(7, 3), -- Orange Juice is Gluten-Free
(7, 4); -- Orange Juice is Dairy-Free