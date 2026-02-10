-- Asset Management System Database Schema

-- Employees/Users Table
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  employee_id VARCHAR(100) UNIQUE NOT NULL,
  department VARCHAR(100),
  position VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Asset Types Table
CREATE TABLE asset_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assets Master Table (All assets)
CREATE TABLE assets (
  id SERIAL PRIMARY KEY,
  asset_code VARCHAR(100) UNIQUE NOT NULL,
  asset_type_id INTEGER NOT NULL REFERENCES asset_types(id),
  brand VARCHAR(100),
  model VARCHAR(100),
  serial_number VARCHAR(100),
  specification JSONB,
  purchase_date DATE,
  purchase_cost DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'active', -- active, inactive, decommissioned
  depreciation_rate DECIMAL(5, 2) DEFAULT 0, -- percentage per year
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Asset Allocation/Allotment Table
CREATE TABLE asset_allocations (
  id SERIAL PRIMARY KEY,
  asset_id INTEGER NOT NULL REFERENCES assets(id),
  employee_id INTEGER NOT NULL REFERENCES employees(id),
  allocation_date DATE NOT NULL,
  deallocation_date DATE,
  status VARCHAR(50) DEFAULT 'active', -- active, inactive
  condition VARCHAR(50) DEFAULT 'good', -- good, fair, poor
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Asset Transfer Table (Track movement between employees)
CREATE TABLE asset_transfers (
  id SERIAL PRIMARY KEY,
  asset_id INTEGER NOT NULL REFERENCES assets(id),
  from_employee_id INTEGER REFERENCES employees(id), -- NULL if new allocation
  to_employee_id INTEGER NOT NULL REFERENCES employees(id),
  transfer_date DATE NOT NULL,
  transfer_reason VARCHAR(255),
  condition_before VARCHAR(50),
  condition_after VARCHAR(50),
  approved_by VARCHAR(100),
  approval_status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Asset Status/Activation-Deactivation Table
CREATE TABLE asset_activations (
  id SERIAL PRIMARY KEY,
  asset_id INTEGER NOT NULL REFERENCES assets(id),
  asset_status VARCHAR(50) NOT NULL, -- active, inactive, decommissioned
  previous_status VARCHAR(50),
  activation_date TIMESTAMP NOT NULL,
  deactivation_date TIMESTAMP,
  reason VARCHAR(255),
  created_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Trail/History Table
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  action VARCHAR(100) NOT NULL, -- CREATE, UPDATE, DELETE, TRANSFER, ALLOCATE, DEALLOCATE, ACTIVATE, DEACTIVATE
  table_name VARCHAR(100) NOT NULL,
  record_id INTEGER,
  old_values JSONB, -- Previous values
  new_values JSONB, -- New values
  changed_by VARCHAR(100),
  change_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45)
);

-- Bulk Import Logs Table
CREATE TABLE bulk_import_logs (
  id SERIAL PRIMARY KEY,
  import_type VARCHAR(100), -- assets, employees, allocations
  file_name VARCHAR(255),
  total_records INTEGER,
  successful_records INTEGER,
  failed_records INTEGER,
  status VARCHAR(50) DEFAULT 'completed', -- processing, completed, failed
  error_details JSONB,
  imported_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Asset Depreciation History Table
CREATE TABLE asset_depreciation (
  id SERIAL PRIMARY KEY,
  asset_id INTEGER NOT NULL REFERENCES assets(id),
  year INTEGER,
  depreciation_value DECIMAL(10, 2),
  book_value DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for better query performance
CREATE INDEX idx_asset_employee ON asset_allocations(employee_id);
CREATE INDEX idx_asset_alloc_asset ON asset_allocations(asset_id);
CREATE INDEX idx_transfer_asset ON asset_transfers(asset_id);
CREATE INDEX idx_transfer_from_emp ON asset_transfers(from_employee_id);
CREATE INDEX idx_transfer_to_emp ON asset_transfers(to_employee_id);
CREATE INDEX idx_activation_asset ON asset_activations(asset_id);
CREATE INDEX idx_audit_logs_table ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_date ON audit_logs(created_at);
CREATE INDEX idx_assets_type ON assets(asset_type_id);
CREATE INDEX idx_assets_status ON assets(status);

-- Initial Asset Types
INSERT INTO asset_types (name, description) VALUES 
('SIM Card', 'Mobile SIM Cards for connectivity'),
('Phone', 'Mobile phones and smartphones'),
('Laptop', 'Laptops and portable computers');
