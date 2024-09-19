step-1:
git clone https://github.com/EngrMunir/bit-task-2.git

step-2:
open vs code
.........................
cd BitCodeTask2/frontend  
npm install
............................
cd BitCodeTask2/server
npm install  
...............................
go to mysql and run this sql
...............................
step-3: CREATE TABLE bitetask

step-4: 
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    user_phone VARCHAR(20) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

step-5:
CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_code VARCHAR(100) NOT NULL UNIQUE,
    product_name VARCHAR(255) NOT NULL,
    product_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

step-6:
CREATE TABLE IF NOT EXISTS purchase_history (
    purchase_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    product_code VARCHAR(100) NOT NULL,
    order_no VARCHAR(255),
    purchase_quantity INT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

 
