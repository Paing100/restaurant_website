DROP TABLE IF EXISTS menu_item_dietary_restrictions CASCADE;
DROP TABLE IF EXISTS menu_item_allergens CASCADE;
DROP TABLE IF EXISTS dietary_restrictions CASCADE;
DROP TABLE IF EXISTS allergens CASCADE;
DROP TABLE IF EXISTS order_menu_items CASCADE;
DROP TABLE IF EXISTS order CASCADE;
DROP TABLE IF EXISTS menu_item CASCADE;
DROP TABLE IF EXISTS customer CASCADE;

CREATE TABLE customer (
    customer_id SERIAL PRIMARY KEY
);

CREATE TABLE order (
    order_id SERIAL PRIMARY KEY,
    customer_id INT UNIQUE,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE
);

CREATE TABLE menu_item (
    item_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    in_stock BOOLEAN NOT NULL DEFAULT TRUE,
    calories INT
);

CREATE TABLE order_menu_items (
    order_id INT,
    item_id INT,
    PRIMARY KEY (order_id, item_id),
    FOREIGN KEY (order_id) REFERENCES order(order_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES menu_item(item_id) ON DELETE CASCADE
);

CREATE TABLE allergens (
    name VARCHAR(255) PRIMARY KEY,
    description TEXT NOT NULL
);

CREATE TABLE menu_item_allergens (
    item_id INT,
    allergen VARCHAR(255),
    PRIMARY KEY (item_id, allergen),
    FOREIGN KEY (item_id) REFERENCES menu_item(item_id) ON DELETE CASCADE,
    FOREIGN KEY (allergen) REFERENCES allergens(name) ON DELETE CASCADE
);

CREATE TABLE dietary_restrictions (
    name VARCHAR(255) PRIMARY KEY,
    description TEXT NOT NULL
);

CREATE TABLE menu_item_dietary_restrictions (
    item_id INT,
    restriction VARCHAR(255),
    PRIMARY KEY (item_id, restriction),
    FOREIGN KEY (item_id) REFERENCES menu_item(item_id) ON DELETE CASCADE,
    FOREIGN KEY (restriction) REFERENCES dietary_restrictions(name) ON DELETE CASCADE
);

INSERT INTO dietary_restrictions (name) VALUES
('Vegetarian'),
('Vegan'),
('Gluten-Free'),
('Halal');

INSERT INTO allergens (name) VALUES
('Gluten'),
('Shellfish'),
('Dairy'),
('Nuts'),
('Soya'),
('Eggs');
