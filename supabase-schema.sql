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
