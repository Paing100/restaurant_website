DROP TABLE IF EXISTS menu_item_dietary_restrictions CASCADE;
DROP TABLE IF EXISTS menu_item_allergens CASCADE;
DROP TABLE IF EXISTS dietary_restrictions CASCADE;
DROP TABLE IF EXISTS allergens CASCADE;
DROP TABLE IF EXISTS order_menu_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS menu_item CASCADE;
DROP TABLE IF EXISTS customer CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS waiter CASCADE;
DROP TABLE IF EXISTS employee CASCADE;

CREATE TABLE employee (
    employeeId VARCHAR(255) PRIMARY KEY NOT NULL,
    firstName VARCHAR(225) NOT NULL,
    lastName VARCHAR(225) NOT NULL,
    role VARCHAR(225) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE waiter (
    waiter_id SERIAL PRIMARY KEY,
    employee_id VARCHAR(255) NOT NULL UNIQUE,
    FOREIGN KEY (employee_id) REFERENCES employee(employeeId) ON DELETE CASCADE
);

CREATE TABLE customer (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    password VARCHAR(255)
);

CREATE TYPE order_status AS ENUM ('CREATED', 'SUBMITTED', 'CONFIRMED', 'IN_PROGRESS', 'READY', 'DELIVERED');

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    table_num INT NOT NULL,
    waiter_id INT,
    order_placed TIMESTAMP,
    status order_status NOT NULL,
    order_paid BOOLEAN,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (waiter_id) REFERENCES waiter(waiter_id) ON DELETE SET NULL
);

CREATE TABLE menu_item (
    item_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    available BOOLEAN NOT NULL DEFAULT TRUE,
    calories INT,
    category INT,
    image_path VARCHAR(225)
);

CREATE TABLE order_menu_items (
    order_id INT,
    item_id INT,
    quantity INT NOT NULL,
    orderSubmitted BOOLEAN,
    comment varchar (100),
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

CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    message_type VARCHAR(225) NOT NULL,
    order_id INT NOT NULL,
    recipient VARCHAR(225) NOT NULL,
    message VARCHAR(225) NOT NULL,
    waiterId VARCHAR(225)

);

