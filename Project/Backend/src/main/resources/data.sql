-- Insert into dietary_restrictions
INSERT INTO dietary_restrictions (name) VALUES
('Vegetarian'),
('Vegan'),
('Gluten-Free'),
('Halal');

-- Insert into allergens
INSERT INTO allergens (name) VALUES
('Gluten'),
('Shellfish'),
('Dairy'),
('Nuts'),
('Soya'),
('Eggs');

-- Insert into menu_item
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

-- Insert into menu_item_dietary_restrictions
INSERT INTO menu_item_dietary_restrictions (item_id, restriction)
VALUES 
((SELECT item_id FROM menu_item WHERE name = 'Chile Relleno'), 'Vegetarian'),
((SELECT item_id FROM menu_item WHERE name = 'Esquites'), 'Vegetarian'),
((SELECT item_id FROM menu_item WHERE name = 'Guac'), 'Vegan'),
((SELECT item_id FROM menu_item WHERE name = 'Guacamole'), 'Vegan'),
((SELECT item_id FROM menu_item WHERE name = 'Queso Fundido'), 'Vegetarian'),
((SELECT item_id FROM menu_item WHERE name = 'Birria Tacos'), 'Halal'),
((SELECT item_id FROM menu_item WHERE name = 'Enchiladas'), 'Halal'),
((SELECT item_id FROM menu_item WHERE name = 'Pozole'), 'Halal'),
((SELECT item_id FROM menu_item WHERE name = 'Sopes'), 'Halal'),
((SELECT item_id FROM menu_item WHERE name = 'Taco'), 'Halal'),
((SELECT item_id FROM menu_item WHERE name = 'Tamales'), 'Halal');

-- Insert into menu_item_allergens
INSERT INTO menu_item_allergens (item_id, allergen)
VALUES 
-- Dairy
((SELECT item_id FROM menu_item WHERE name = 'Chile Relleno'), 'Dairy'),
((SELECT item_id FROM menu_item WHERE name = 'Esquites'), 'Dairy'),
((SELECT item_id FROM menu_item WHERE name = 'Flan'), 'Dairy'),
((SELECT item_id FROM menu_item WHERE name = 'Queso Fundido'), 'Dairy'),
((SELECT item_id FROM menu_item WHERE name = 'Tres Leches Cake'), 'Dairy'),

-- Gluten
((SELECT item_id FROM menu_item WHERE name = 'Capirotada'), 'Gluten'),
((SELECT item_id FROM menu_item WHERE name = 'Churro'), 'Gluten'),
((SELECT item_id FROM menu_item WHERE name = 'Pan de Muerto'), 'Gluten'),

-- Nuts
((SELECT item_id FROM menu_item WHERE name = 'Capirotada'), 'Nuts'),

-- Eggs
((SELECT item_id FROM menu_item WHERE name = 'Capirotada'), 'Eggs'),
((SELECT item_id FROM menu_item WHERE name = 'Chile Relleno'), 'Eggs'),
((SELECT item_id FROM menu_item WHERE name = 'Churro'), 'Eggs'),
((SELECT item_id FROM menu_item WHERE name = 'Flan'), 'Eggs'),
((SELECT item_id FROM menu_item WHERE name = 'Pan de Muerto'), 'Eggs'),
((SELECT item_id FROM menu_item WHERE name = 'Tamales'), 'Eggs'),
((SELECT item_id FROM menu_item WHERE name = 'Tres Leches Cake'), 'Eggs');
