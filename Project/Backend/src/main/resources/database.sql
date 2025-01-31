DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS item_category CASCADE;

CREATE TABLE menu_items (
    item_id INT PRIMARY KEY,
    category_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    allergens VARCHAR(255),
    calories INT(5),
    is_halal BOOLEAN DEFAULT FALSE,
    is_vegan BOOLEAN DEFAULT FALSE,
    is_gluten_free BOOLEAN DEFAULT FALSE,
    in_stock BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) 
);

CREATE TABLE item_category ( 
    category_id INT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO item_category (category_id, name) VALUES
(1, 'Starters'),
(2, 'Course');

INSERT INTO menu_items (item_id, category_id, name, description, price, allergens, calories, is_halal, is_vegan, is_gluten_free, in_stock) VALUES
(1, 1, 'Spring Rolls', 'veggie spring rolls', 3.99, 'Gluten, Soy', 250, TRUE, TRUE, FALSE, TRUE),
(2, 1, 'Garlic Bread', 'garliced bread', 4.49, 'Gluten, Dairy', 300, FALSE, FALSE, FALSE, TRUE),
(3, 2, 'Grilled Chicken', 'chicken been grilled', 6.99, NULL, 750, TRUE, FALSE, TRUE, TRUE);
