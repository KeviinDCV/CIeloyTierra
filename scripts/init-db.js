/**
 * Script para inicializar la base de datos de Neon
 * Ejecutar con: node scripts/init-db.js
 */

const { neon } = require('@neondatabase/serverless')
require('dotenv').config({ path: '.env.local' })

const sql = neon(process.env.DATABASE_URL)

const schema = `
-- ========================================
-- PRODUCTS TABLE
-- ========================================

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

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_celebrations_status ON celebrations(status);
CREATE INDEX IF NOT EXISTS idx_celebrations_date ON celebrations(date);

-- ========================================
-- ORDERS TABLE
-- ========================================

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'completed', 'cancelled')),
  notes TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_timestamp ON orders(timestamp);
`

async function initDatabase() {
  console.log('🚀 Inicializando base de datos en Neon...\n')
  
  try {
    console.log('1. Creando tabla products...')
    await sql`
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
      )
    `
    
    await sql`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)`
    await sql`CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured)`
    
    console.log('2. Creando tabla categories...')
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id BIGSERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        color TEXT DEFAULT '#3182ce',
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `
    
    console.log('3. Insertando categorías predeterminadas...')
    await sql`
      INSERT INTO categories (id, name, description, color) VALUES
        (1, 'Desayuno', 'Comidas matutinas', '#fdb72d'),
        (2, 'Almuerzo', 'Comidas del mediodía', '#e61d25'),
        (3, 'Cena', 'Comidas nocturnas', '#2d3748'),
        (4, 'Entrada', 'Aperitivos y entradas', '#38a169'),
        (5, 'Principal', 'Platos principales', '#3182ce'),
        (6, 'Postre', 'Dulces y postres', '#d53f8c'),
        (7, 'Bebida', 'Bebidas y refrescos', '#805ad5')
      ON CONFLICT (name) DO NOTHING
    `
    
    await sql`SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories))`
    
    console.log('4. Creando tabla celebrations...')
    await sql`
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
      )
    `
    
    await sql`CREATE INDEX IF NOT EXISTS idx_celebrations_status ON celebrations(status)`
    await sql`CREATE INDEX IF NOT EXISTS idx_celebrations_date ON celebrations(date)`
    
    console.log('5. Creando tabla orders...')
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id BIGSERIAL PRIMARY KEY,
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        customer_address TEXT NOT NULL,
        items JSONB NOT NULL,
        total NUMERIC NOT NULL,
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'completed', 'cancelled')),
        notes TEXT,
        timestamp TIMESTAMPTZ DEFAULT NOW()
      )
    `
    
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_timestamp ON orders(timestamp)`

    console.log('\n✅ Base de datos inicializada correctamente!')
    console.log('\n📊 Tablas creadas:')
    console.log('  • products')
    console.log('  • categories (con 7 categorías predeterminadas)')
    console.log('  • celebrations')
    console.log('  • orders')
    
    // Verificar las categorías
    const categories = await sql`SELECT name FROM categories ORDER BY id`
    console.log('\n📋 Categorías disponibles:')
    categories.forEach(cat => console.log(`  • ${cat.name}`))
    
  } catch (error) {
    console.error('\n❌ Error al inicializar la base de datos:', error)
    console.error('Detalle:', error.message)
    process.exit(1)
  }
}

initDatabase()
