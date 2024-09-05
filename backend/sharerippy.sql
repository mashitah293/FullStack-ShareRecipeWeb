create database sharerippy;
use ShareRippy;

create table users (
id int auto_increment primary key,
username varchar(50) not null,
email varchar(50) not null unique,
password varchar(10000) not null,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recipe (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipeName VARCHAR(255),
    description TEXT,
    ingredients TEXT,
    cookingSteps TEXT,
    difficulty ENUM('easy', 'medium', 'hard'),
    category ENUM('mdish', 'beverage', 'dessert', 'other'),
    imageUrl VARCHAR(255),  -- Column to store the image URL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT, -- Foreign key linking to the recipe
    username VARCHAR(100),
    comment_text TEXT,
    rating INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

use sharerippy;
select * from recipe;
select * from users;
select * from Comments;

