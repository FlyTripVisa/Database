-- Users Table (Universal for all projects)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  metadata TEXT DEFAULT '{}', -- Extra project-specific data (JSON)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Visa Catalog Table
CREATE TABLE IF NOT EXISTS visa_catalog (
  id TEXT PRIMARY KEY,
  country TEXT NOT NULL,
  visa_type TEXT NOT NULL,
  price REAL NOT NULL,
  processing_time TEXT,
  requirements TEXT DEFAULT '[]', -- JSON Array of requirement strings
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Universal Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  visa_id TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  amount REAL NOT NULL,
  project_source TEXT DEFAULT 'main_site', -- Identifies which project created this order
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (visa_id) REFERENCES visa_catalog(id)
);
