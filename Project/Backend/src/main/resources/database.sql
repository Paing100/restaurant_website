DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS item_category CASCADE;
DROP TABLE IF EXISTS customer CASCADE;
DROP TABLE IF EXISTS allergies CASCADE;

CREATE TABLE customer (
    order_no SERIAL PRIMARY KEY,
);

CREATE TABLE customer_menu_items (
    order_no INT,
    item_id INT,
    PRIMARY KEY (order_no, item_id),
    FOREIGN KEY (order_no) REFERENCES customer(order_no) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES menu_items(item_id) ON DELETE CASCADE
);

CREATE TABLE menu_items (
    item_id INT PRIMARY KEY,
    category_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    calories INT(5),
    FOREIGN KEY (category_id) REFERENCES categories(category_id) 
);

CREATE TABLE allergies (
    allergy_id INT PRIMARY KEY, 
    name VARCHAR(40) UNIQUE NOT NULL
);

CREATE TABLE item_allergies (
    item_id INT,
    allergy_id INT,
    PRIMARY KEY (item_id, allergy_id),
    FOREIGN KEY (item_id) REFERENCES menu_items(item_id) ON DELETE CASCADE,
    FOREIGN KEY (allergy_id) REFERENCES allergies(allergy_id) ON DELETE CASCADE
);

CREATE TABLE dietary_restrictions (
    dietaryRes_id SERIAL PRIMARY KEY,
    dietaryRes_name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE menu_item_dietary_restrictions (
    item_id INT,
    dietaryRes_id INT,
    PRIMARY KEY (item_id, dietaryRes_id),
    FOREIGN KEY (item_id) REFERENCES menu_items(item_id) ON DELETE CASCADE,
    FOREIGN KEY (dietaryRes_id) REFERENCES dietary_restrictions(dietaryRes_id) ON DELETE CASCADE
);

CREATE TABLE item_category ( 
    category_id INT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);


-- Insert categories
INSERT INTO item_category (category_id, name) VALUES
(1, 'Starters'),
(2, 'Main Course'),
(3, 'Desserts'),
(4, 'Drinks');

-- Insert menu items
INSERT INTO menu_items (item_id, category_id, name, description, price, allergens, calories, is_halal, is_vegan, is_gluten_free, in_stock) VALUES
(1, 1, 'Spring Rolls', 'Crispy fried rolls with vegetables', 6.49, 'Gluten, Soy', 320, TRUE, TRUE, FALSE, TRUE),
(2, 1, 'Garlic Bread', 'Crispy bread with garlic butter', 4.99, 'Gluten, Dairy', 250, FALSE, FALSE, FALSE, TRUE),
(3, 1, 'Bruschetta', 'Toasted bread with tomatoes and basil', 5.99, 'Gluten', 300, FALSE, TRUE, FALSE, TRUE),
(4, 2, 'Grilled Chicken', 'Juicy grilled chicken with vegetables', 12.99, NULL, 600, TRUE, FALSE, TRUE, TRUE),
(5, 2, 'Spaghetti Carbonara', 'Pasta with creamy sauce and bacon', 11.99, 'Gluten, Dairy', 750, FALSE, FALSE, FALSE, TRUE),
(6, 3, 'Chocolate Cake', 'Rich chocolate cake with frosting', 6.99, 'Dairy, Eggs', 500, FALSE, FALSE, FALSE, TRUE),
(7, 3, 'Cheesecake', 'Classic New York-style cheesecake', 7.99, 'Dairy', 450, FALSE, FALSE, FALSE, TRUE),
(8, 4, 'Orange Juice', 'Freshly squeezed orange juice', 3.99, NULL, 120, TRUE, TRUE, TRUE, TRUE),
(9, 4, 'Cappuccino', 'Italian coffee with steamed milk foam', 4.49, 'Dairy', 150, FALSE, FALSE, TRUE, TRUE);