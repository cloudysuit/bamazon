CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE inventory(
item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
product_name VARCHAR(140) NOT NULL,
department_name VARCHAR(140) NULL,
price INTEGER(10,2) NULL,
stock_quantity INTEGER(10) NOT NULL,
PRIMARY KEY (item_id)
); 

SELECT * FROM inventory;
