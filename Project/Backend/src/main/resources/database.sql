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

INSERT INTO item_category (category_id, name) VALUES
(1, 'Starters'),
(2, 'Course');

-- rewrite test data
