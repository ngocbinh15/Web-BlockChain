-- Create Database
CREATE DATABASE IF NOT EXISTS blockchain_rice;
USE blockchain_rice;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'farmer', 'mill', 'transport', 'distributor', 'consumer') NOT NULL,
  full_name VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  is_active BOOLEAN DEFAULT TRUE,
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- Batches Table (Lô gạo)
CREATE TABLE IF NOT EXISTS batches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  batch_code VARCHAR(50) UNIQUE NOT NULL,
  qr_code TEXT,
  product_name VARCHAR(100) NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  unit VARCHAR(20) DEFAULT 'kg',
  status ENUM('created', 'processing', 'ready', 'shipped', 'delivered') DEFAULT 'created',
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_batch_code (batch_code),
  INDEX idx_status (status),
  INDEX idx_created_by (created_by)
);

-- Transactions Table (Lịch sử giao dịch)
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  batch_id INT NOT NULL,
  user_id INT NOT NULL,
  action VARCHAR(50) NOT NULL,
  description TEXT,
  location VARCHAR(200),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metadata JSON,
  FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_batch_id (batch_id),
  INDEX idx_user_id (user_id),
  INDEX idx_timestamp (timestamp)
);

-- Insert demo users (passwords are hashed with bcrypt, all use "demo123")
-- Hash: $2a$10$rZJ5vF3mZ7YHGpXxK.8ZxOqN4VqVj8JxZ9g1xY9Xz7pQ5b3cZ8fGe
INSERT INTO users (username, email, password, role, full_name) VALUES
('admin', 'admin@ricechain.com', '$2a$10$rZJ5vF3mZ7YHGpXxK.8ZxOqN4VqVj8JxZ9g1xY9Xz7pQ5b3cZ8fGe', 'admin', 'Administrator'),
('farmer', 'farmer@ricechain.com', '$2a$10$rZJ5vF3mZ7YHGpXxK.8ZxOqN4VqVj8JxZ9g1xY9Xz7pQ5b3cZ8fGe', 'farmer', 'Nguyễn Văn Nông Dân'),
('mill', 'mill@ricechain.com', '$2a$10$rZJ5vF3mZ7YHGpXxK.8ZxOqN4VqVj8JxZ9g1xY9Xz7pQ5b3cZ8fGe', 'mill', 'Nhà Máy Xay Xát'),
('transport', 'transport@ricechain.com', '$2a$10$rZJ5vF3mZ7YHGpXxK.8ZxOqN4VqVj8JxZ9g1xY9Xz7pQ5b3cZ8fGe', 'transport', 'Công Ty Vận Chuyển'),
('distributor', 'distributor@ricechain.com', '$2a$10$rZJ5vF3mZ7YHGpXxK.8ZxOqN4VqVj8JxZ9g1xY9Xz7pQ5b3cZ8fGe', 'distributor', 'Nhà Phân Phối'),
('consumer', 'consumer@ricechain.com', '$2a$10$rZJ5vF3mZ7YHGpXxK.8ZxOqN4VqVj8JxZ9g1xY9Xz7pQ5b3cZ8fGe', 'consumer', 'Người Tiêu Dùng');

-- Insert demo batches
INSERT INTO batches (batch_code, product_name, quantity, status, created_by) VALUES
('RICE2025001', 'Gạo ST25 cao cấp', 1000.00, 'created', 1),
('RICE2025002', 'Gạo Jasmine hữu cơ', 500.00, 'processing', 2),
('RICE2025003', 'Gạo Nàng Hoa 9', 750.00, 'ready', 2);
