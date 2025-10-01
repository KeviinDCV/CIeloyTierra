-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  image TEXT,
  category TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  rating NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access
CREATE POLICY "Allow public read access to products"
ON products FOR SELECT
TO public
USING (true);

-- Create policies to allow authenticated users to insert, update, delete
CREATE POLICY "Allow authenticated insert to products"
ON products FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow authenticated update to products"
ON products FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated delete to products"
ON products FOR DELETE
TO public
USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);

-- ========================================
-- CATEGORIES TABLE
-- ========================================

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#3182ce',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access
CREATE POLICY "Allow public read access to categories"
ON categories FOR SELECT
TO public
USING (true);

-- Create policies to allow authenticated users to insert, update, delete
CREATE POLICY "Allow authenticated insert to categories"
ON categories FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow authenticated update to categories"
ON categories FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated delete to categories"
ON categories FOR DELETE
TO public
USING (true);

-- Insert default categories
INSERT INTO categories (id, name, description, color) VALUES
  (1, 'Desayuno', 'Comidas matutinas', '#fdb72d'),
  (2, 'Almuerzo', 'Comidas del mediodía', '#e61d25'),
  (3, 'Cena', 'Comidas nocturnas', '#2d3748'),
  (4, 'Entrada', 'Aperitivos y entradas', '#38a169'),
  (5, 'Principal', 'Platos principales', '#3182ce'),
  (6, 'Postre', 'Dulces y postres', '#d53f8c'),
  (7, 'Bebida', 'Bebidas y refrescos', '#805ad5')
ON CONFLICT (name) DO NOTHING;

-- Update sequence to start after default categories
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));

-- ========================================
-- CELEBRATIONS TABLE
-- ========================================

-- Create celebrations table
CREATE TABLE IF NOT EXISTS celebrations (
  id BIGSERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  event_type TEXT NOT NULL,
  date TEXT NOT NULL,
  guests INTEGER NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE celebrations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read access to celebrations" ON celebrations;
DROP POLICY IF EXISTS "Allow authenticated insert to celebrations" ON celebrations;
DROP POLICY IF EXISTS "Allow authenticated update to celebrations" ON celebrations;
DROP POLICY IF EXISTS "Allow authenticated delete to celebrations" ON celebrations;

-- Create policies to allow public read access
CREATE POLICY "Allow public read access to celebrations"
ON celebrations FOR SELECT
TO public
USING (true);

-- Create policies to allow public insert (anyone can create a celebration request)
CREATE POLICY "Allow authenticated insert to celebrations"
ON celebrations FOR INSERT
TO public
WITH CHECK (true);

-- Create policies to allow authenticated update
CREATE POLICY "Allow authenticated update to celebrations"
ON celebrations FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Create policies to allow authenticated delete
CREATE POLICY "Allow authenticated delete to celebrations"
ON celebrations FOR DELETE
TO public
USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_celebrations_status ON celebrations(status);
CREATE INDEX IF NOT EXISTS idx_celebrations_date ON celebrations(date);
