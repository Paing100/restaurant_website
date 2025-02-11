DROP TABLE IF EXISTS menu_item_dietary_restrictions CASCADE;
DROP TABLE IF EXISTS menu_item_allergens CASCADE;
DROP TABLE IF EXISTS dietary_restrictions CASCADE;
DROP TABLE IF EXISTS allergens CASCADE;
DROP TABLE IF EXISTS order_menu_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS menu_item CASCADE;
DROP TABLE IF EXISTS customer CASCADE;

CREATE TABLE customer (
    customer_id SERIAL PRIMARY KEY
);

CREATE TABLE orders (
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
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
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

INSERT INTO menu_item (name, description, price, in_stock, calories) VALUES
('Agua de Jamaica', 'Refreshing hibiscus flower tea, lightly sweetened', 3.99, TRUE, 90),
('Birria Tacos', 'Slow-cooked beef tacos served with consommé for dipping', 12.99, TRUE, 750),
('Capirotada', 'Traditional Mexican bread pudding with cinnamon and raisins', 6.99, TRUE, 500),
('Chile Relleno', 'Poblano pepper stuffed with cheese, battered, and fried', 11.99, TRUE, 750),
('Churro', 'Crispy fried dough covered in cinnamon sugar', 4.99, TRUE, 350),
('Cocktail', 'Classic Mexican cocktail with tequila, lime, and fruit juice', 9.99, TRUE, 180),
('Enchiladas', 'Soft corn tortillas rolled with filling and smothered in sauce', 12.49, TRUE, 700),
('Esquites', 'Mexican street corn salad with lime, cheese, and chili powder', 5.99, TRUE, 400),
('Flan', 'Caramel custard dessert with a silky texture', 6.49, TRUE, 300),
('Guac', 'Short for guacamole—fresh mashed avocados with lime and cilantro', 5.99, TRUE, 250),
('Guacamole', 'Creamy avocado dip with tomatoes, onions, and lime', 6.49, TRUE, 250),
('Horchata', 'Sweet rice and cinnamon drink served chilled', 3.99, TRUE, 160),
('Michelada', 'Spicy and tangy beer cocktail with lime, salt, and hot sauce', 8.99, TRUE, 150),
('Pan de Muerto', 'Traditional sweet bread made for Día de los Muertos', 5.49, TRUE, 400),
('Pozole', 'Traditional hominy soup with pork, radish, and lime', 10.99, TRUE, 650),
('Queso Fundido', 'Melted cheese dip served with warm tortillas', 8.99, TRUE, 600),
('Sopes', 'Thick corn cakes topped with beans, meat, and cheese', 9.49, TRUE, 500),
('Taco', 'Classic Mexican street taco with your choice of filling', 3.99, TRUE, 300),
('Tacos el Pastor', 'Marinated pork tacos with pineapple, onions, and cilantro', 11.99, TRUE, 700),
('Tamales', 'Corn dough filled with meat, wrapped in banana leaves and steamed', 8.99, TRUE, 500),
('Tequila Sunrise', 'Vibrant cocktail with tequila, orange juice, and grenadine', 9.99, TRUE, 200),
('Tres Leches Cake', 'Moist sponge cake soaked in three kinds of milk', 7.49, TRUE, 450);

INSERT INTO menu_item_dietary_restrictions (item_id, restriction_id) 
VALUES 
((SELECT item_id FROM menu_item WHERE name = 'Chile Relleno'), (SELECT restriction_id FROM dietary_restrictions WHERE name = 'Vegetarian')),
((SELECT item_id FROM menu_item WHERE name = 'Esquites'), (SELECT restriction_id FROM dietary_restrictions WHERE name = 'Vegetarian')),
((SELECT item_id FROM menu_item WHERE name = 'Guac'), (SELECT restriction_id FROM dietary_restrictions WHERE name = 'Vegan')),
((SELECT item_id FROM menu_item WHERE name = 'Guacamole'), (SELECT restriction_id FROM dietary_restrictions WHERE name = 'Vegan')),
((SELECT item_id FROM menu_item WHERE name = 'Queso Fundido'), (SELECT restriction_id FROM dietary_restrictions WHERE name = 'Vegetarian')),
((SELECT item_id FROM menu_item WHERE name = 'Birria Tacos'), (SELECT restriction_id FROM dietary_restrictions WHERE name = 'Halal')),
((SELECT item_id FROM menu_item WHERE name = 'Enchiladas'), (SELECT restriction_id FROM dietary_restrictions WHERE name = 'Halal')),
((SELECT item_id FROM menu_item WHERE name = 'Pozole'), (SELECT restriction_id FROM dietary_restrictions WHERE name = 'Halal')),
((SELECT item_id FROM menu_item WHERE name = 'Sopes'), (SELECT restriction_id FROM dietary_restrictions WHERE name = 'Halal')),
((SELECT item_id FROM menu_item WHERE name = 'Taco'), (SELECT restriction_id FROM dietary_restrictions WHERE name = 'Halal')),
((SELECT item_id FROM menu_item WHERE name = 'Tamales'), (SELECT restriction_id FROM dietary_restrictions WHERE name = 'Halal'));

INSERT INTO menu_item_allergens (item_id, allergen_id) 
VALUES 
-- Dairy
((SELECT item_id FROM menu_item WHERE name = 'Chile Relleno'), 
 (SELECT allergen_id FROM allergens WHERE name = 'Dairy')),
((SELECT item_id FROM menu_item WHERE name = 'Esquites'), 
 (SELECT allergen_id FROM allergens WHERE name = 'Dairy')),
((SELECT item_id FROM menu_item WHERE name = 'Flan'), 
 (SELECT allergen_id FROM allergens WHERE name = 'Dairy')),
((SELECT item_id FROM menu_item WHERE name = 'Queso Fundido'), 
 (SELECT allergen_id FROM allergens WHERE name = 'Dairy')),
((SELECT item_id FROM menu_item WHERE name = 'Tres Leches Cake'), 
 (SELECT allergen_id FROM allergens WHERE name = 'Dairy')),

-- Gluten
((SELECT item_id FROM menu_item WHERE name = 'Capirotada'), 
 (SELECT allergen_id FROM allergens WHERE name = 'Gluten')),
((SELECT item_id FROM menu_item WHERE name = 'Churro'), 
 (SELECT allergen_id FROM allergens WHERE name = 'Gluten')),
((SELECT item_id FROM menu_item WHERE name = 'Pan de Muerto'), 
 (SELECT allergen_id FROM allergens WHERE name = 'Gluten')),

-- Nuts
((SELECT item_id FROM menu_item WHERE name = 'Capirotada'), 
 (SELECT allergen_id FROM allergens WHERE name = 'Nuts')),

-- Eggs
((SELECT item_id FROM menu_item WHERE name = 'Capirotada'), 
 (SELECT allergen_id FROM allergens WHERE name = 'Eggs')),
((SELECT item_id FROM menu_item WHERE name = 'Chile Relleno'), 
 (SELECT allergen_id FROM allergens WHERE name = 'Eggs')),
((SELECT item_id FROM menu_item WHERE name = 'Churro'), 
 (SELECT allergen_id FROM allergens WHERE name = 'Eggs')),
((SELECT item_id FROM menu_item WHERE name = 'Flan'), 
 (SELECT allergen_id FROM allergens WHERE name = 'Eggs')),
((SELECT item_id FROM menu_item WHERE name = 'Pan de Muerto'), 
 (SELECT allergen_id FROM allergens WHERE name = 'Eggs')),
((SELECT item_id FROM menu_item WHERE name = 'Tamales'), 
 (SELECT allergen_id FROM allergens WHERE name = 'Eggs')),
((SELECT item_id FROM menu_item WHERE name = 'Tres Leches Cake'), 
 (SELECT allergen_id FROM allergens WHERE name = 'Eggs'));


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
);

