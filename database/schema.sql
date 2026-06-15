CREATE DATABASE IF NOT EXISTS inventory_db;
USE inventory_db;

CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    expiry_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO items (name, stock, expiry_date) VALUES
('Milk', 50, '2026-06-20'),
('Rice', 200, '2026-12-25'),
('Bread', 15, '2026-06-13'),
('Eggs', 30, '2026-06-18'),
('Yogurt', 0, '2026-06-10');

