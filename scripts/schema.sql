-- Lotoks Database Schema
-- Run this to set up the MySQL database

CREATE DATABASE IF NOT EXISTS lotoks CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lotoks;

-- ── Admins / Staff ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) DEFAULT '',
  role ENUM('super_admin','reviewer','finance','recruiter') NOT NULL DEFAULT 'reviewer',
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Requirement Sets (one per service type) ────────────────────
CREATE TABLE IF NOT EXISTS requirement_sets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  service_type VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by INT,
  FOREIGN KEY (updated_by) REFERENCES admins(id) ON DELETE SET NULL
);

-- ── Categories within a requirement set ────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  set_id INT NOT NULL,
  category_key VARCHAR(50) NOT NULL,
  category_name VARCHAR(255) NOT NULL,
  display_order INT DEFAULT 0,
  FOREIGN KEY (set_id) REFERENCES requirement_sets(id) ON DELETE CASCADE,
  UNIQUE KEY (set_id, category_key)
);

-- ── Individual Documents within a category ─────────────────────
CREATE TABLE IF NOT EXISTS documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  doc_key VARCHAR(50) NOT NULL,
  label VARCHAR(255) NOT NULL,
  description TEXT,
  required BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE KEY (category_id, doc_key)
);

-- ── Users (for future customer auth) ───────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  country VARCHAR(100),
  email_verified BOOLEAN DEFAULT FALSE,
  status ENUM('active','inactive','suspended') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Applications ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  service_type VARCHAR(20) NOT NULL,
  status ENUM('draft','submitted','under_review','additional_info','approved','rejected') DEFAULT 'draft',
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── Listings (job/education opportunities) ────────────────────
CREATE TABLE IF NOT EXISTS listings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type ENUM('job','education') NOT NULL,
  country VARCHAR(100) NOT NULL,
  employer VARCHAR(255),
  description TEXT,
  requirements TEXT,
  benefits TEXT,
  status ENUM('active','paused','closed') DEFAULT 'active',
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL
);

-- ── Payments ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT,
  user_id INT,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  method ENUM('paypal','stripe','paystack','bank') NOT NULL,
  status ENUM('pending','completed','failed','refunded') DEFAULT 'pending',
  transaction_ref VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── System Config ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_config (
  id INT AUTO_INCREMENT PRIMARY KEY,
  config_key VARCHAR(100) NOT NULL UNIQUE,
  config_value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT IGNORE INTO site_config (config_key, config_value) VALUES
('site_name', 'Lotoks'),
('support_email', 'support@lotoks.com'),
('support_phone', '+234 801 234 5678'),
('whatsapp_number', '2348012345678'),
('maintenance_mode', 'false');
