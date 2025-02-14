INSERT INTO dietary_restrictions (name, description) VALUES
('VEGETARIAN', 'No meat or fish'),
('VEGAN', 'No animal products'),
('GLUTENFREE', 'No gluten-containing ingredients'),
('HALAL', 'Prepared according to Islamic law');

INSERT INTO allergens (name, description) VALUES
('GLUTEN', 'Wheat, barley, and rye'),
('SHELLFISH', 'Crustaceans and mollusks'),
('DAIRY', 'Milk and milk products'),
('NUTS', 'Peanuts, tree nuts'),
('SOYA', 'Soy products'),
('EGG', 'Eggs and egg-based products');

INSERT INTO menu_item (name, description, price, available, calories) VALUES
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

INSERT INTO menu_item_dietary_restrictions (item_id, restriction)
VALUES
((SELECT item_id FROM menu_item WHERE name = 'Chile Relleno'), (SELECT name FROM dietary_restrictions WHERE name = 'VEGETARIAN')),
((SELECT item_id FROM menu_item WHERE name = 'Esquites'), (SELECT name FROM dietary_restrictions WHERE name = 'VEGETARIAN')),
((SELECT item_id FROM menu_item WHERE name = 'Guac'), (SELECT name FROM dietary_restrictions WHERE name = 'VEGAN')),
((SELECT item_id FROM menu_item WHERE name = 'Guacamole'), (SELECT name FROM dietary_restrictions WHERE name = 'VEGAN')),
((SELECT item_id FROM menu_item WHERE name = 'Queso Fundido'), (SELECT name FROM dietary_restrictions WHERE name = 'VEGETARIAN')),
((SELECT item_id FROM menu_item WHERE name = 'Birria Tacos'), (SELECT name FROM dietary_restrictions WHERE name = 'HALAL')),
((SELECT item_id FROM menu_item WHERE name = 'Enchiladas'), (SELECT name FROM dietary_restrictions WHERE name = 'HALAL')),
((SELECT item_id FROM menu_item WHERE name = 'Pozole'), (SELECT name FROM dietary_restrictions WHERE name = 'HALAL')),
((SELECT item_id FROM menu_item WHERE name = 'Sopes'), (SELECT name FROM dietary_restrictions WHERE name = 'HALAL')),
((SELECT item_id FROM menu_item WHERE name = 'Taco'), (SELECT name FROM dietary_restrictions WHERE name = 'HALAL')),
((SELECT item_id FROM menu_item WHERE name = 'Tamales'), (SELECT name FROM dietary_restrictions WHERE name = 'HALAL'));

INSERT INTO menu_item_allergens (item_id, allergen)
VALUES
((SELECT item_id FROM menu_item WHERE name = 'Chile Relleno'), (SELECT name FROM allergens WHERE name = 'DAIRY')),
((SELECT item_id FROM menu_item WHERE name = 'Esquites'), (SELECT name FROM allergens WHERE name = 'DAIRY')),
((SELECT item_id FROM menu_item WHERE name = 'Flan'), (SELECT name FROM allergens WHERE name = 'DAIRY')),
((SELECT item_id FROM menu_item WHERE name = 'Queso Fundido'), (SELECT name FROM allergens WHERE name = 'DAIRY')),
((SELECT item_id FROM menu_item WHERE name = 'Tres Leches Cake'), (SELECT name FROM allergens WHERE name = 'DAIRY')),

((SELECT item_id FROM menu_item WHERE name = 'Capirotada'), (SELECT name FROM allergens WHERE name = 'GLUTEN')),
((SELECT item_id FROM menu_item WHERE name = 'Churro'), (SELECT name FROM allergens WHERE name = 'GLUTEN')),
((SELECT item_id FROM menu_item WHERE name = 'Pan de Muerto'), (SELECT name FROM allergens WHERE name = 'GLUTEN')),

((SELECT item_id FROM menu_item WHERE name = 'Capirotada'), (SELECT name FROM allergens WHERE name = 'NUTS')),

((SELECT item_id FROM menu_item WHERE name = 'Capirotada'), (SELECT name FROM allergens WHERE name = 'EGG')),
((SELECT item_id FROM menu_item WHERE name = 'Chile Relleno'), (SELECT name FROM allergens WHERE name = 'EGG')),
((SELECT item_id FROM menu_item WHERE name = 'Churro'), (SELECT name FROM allergens WHERE name = 'EGG')),
((SELECT item_id FROM menu_item WHERE name = 'Flan'), (SELECT name FROM allergens WHERE name = 'EGG')),
((SELECT item_id FROM menu_item WHERE name = 'Pan de Muerto'), (SELECT name FROM allergens WHERE name = 'EGG')),
((SELECT item_id FROM menu_item WHERE name = 'Tamales'), (SELECT name FROM allergens WHERE name = 'EGG')),
((SELECT item_id FROM menu_item WHERE name = 'Tres Leches Cake'), (SELECT name FROM allergens WHERE name = 'EGG'));
