CREATE DATABASE IF NOT EXISTS crypto_orders
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE crypto_orders;

CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    payment_id VARCHAR(20) UNIQUE,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    delivery_address TEXT NOT NULL,
    phone VARCHAR(50) NOT NULL,
    order_details TEXT,

    amount_aud DECIMAL(10,2) NOT NULL,
    crypto_type VARCHAR(10),
    crypto_amount DECIMAL(18,8),

    tx_hash VARCHAR(255),
    payment_status VARCHAR(20) DEFAULT 'pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP NULL,

    INDEX idx_payment_id (payment_id),
    INDEX idx_status (payment_status),
    INDEX idx_created (created_at)
);
