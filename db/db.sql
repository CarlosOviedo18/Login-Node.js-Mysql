CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0
);

-- INSERT INTO products (name, description, price, stock) VALUES
-- ('Camiseta básica', 'Camiseta de algodón color blanco', 15.99, 100),
-- ('Jeans azul', 'Pantalón vaquero azul', 39.99, 50),
-- ('Chaqueta de cuero', 'Chaqueta negra de cuero genuino', 89.99, 20),
-- ('Sudadera con capucha', 'Sudadera gris con capucha', 29.99, 75);


CREATE TABLE carts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    status ENUM('active', 'paid', 'cancelled') DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES usuarios(id)
        ON DELETE CASCADE
);

CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (cart_id) REFERENCES carts(id)
        ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE RESTRICT
);
