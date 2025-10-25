/**
 * Script para agregar productos de ejemplo
 * Ejecutar con: node scripts/seed-products.js
 */

const { neon } = require('@neondatabase/serverless')
require('dotenv').config({ path: '.env.local' })

const sql = neon(process.env.DATABASE_URL)

const sampleProducts = [
  {
    name: 'Bandeja Paisa',
    description: 'Plato tradicional colombiano con frijoles, arroz, carne, chicharrón, huevo, arepa y aguacate',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1625944525533-473f1e5ac952?w=500',
    category: 'Principal',
    featured: true,
    rating: 4.8
  },
  {
    name: 'Ajiaco Santafereño',
    description: 'Sopa típica bogotana con tres tipos de papa, pollo, mazorca y guascas',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500',
    category: 'Principal',
    featured: true,
    rating: 4.7
  },
  {
    name: 'Arepa de Huevo',
    description: 'Arepa frita rellena con huevo, típica de la costa caribeña',
    price: 8000,
    image: 'https://images.unsplash.com/photo-1628191081301-eee8cc23cd41?w=500',
    category: 'Entrada',
    featured: false,
    rating: 4.5
  },
  {
    name: 'Empanadas',
    description: 'Empanadas crujientes rellenas de carne o pollo con ají casero',
    price: 6000,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500',
    category: 'Entrada',
    featured: false,
    rating: 4.6
  },
  {
    name: 'Jugo Natural',
    description: 'Jugo de frutas frescas (mora, lulo, maracuyá, mango)',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500',
    category: 'Bebida',
    featured: false,
    rating: 4.8
  },
  {
    name: 'Tres Leches',
    description: 'Delicioso postre tradicional empapado en tres tipos de leche',
    price: 8000,
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500',
    category: 'Postre',
    featured: true,
    rating: 4.9
  }
]

async function seedProducts() {
  console.log('🌱 Agregando productos de ejemplo...\n')
  
  try {
    // Verificar si ya existen productos
    const existingProducts = await sql`SELECT COUNT(*) as count FROM products`
    
    if (existingProducts[0].count > 0) {
      console.log('⚠️  Ya existen productos en la base de datos.')
      console.log('¿Desea continuar y agregar más productos? (Ctrl+C para cancelar)\n')
      
      // Esperar 3 segundos antes de continuar
      await new Promise(resolve => setTimeout(resolve, 3000))
    }

    for (const product of sampleProducts) {
      console.log(`Agregando: ${product.name}`)
      
      await sql`
        INSERT INTO products (name, description, price, image, category, featured, rating)
        VALUES (
          ${product.name},
          ${product.description},
          ${product.price},
          ${product.image},
          ${product.category},
          ${product.featured},
          ${product.rating}
        )
      `
    }

    console.log('\n✅ Productos agregados exitosamente!')
    
    // Mostrar resumen
    const totalProducts = await sql`SELECT COUNT(*) as count FROM products`
    const byCategory = await sql`
      SELECT category, COUNT(*) as count 
      FROM products 
      GROUP BY category 
      ORDER BY count DESC
    `
    
    console.log(`\n📊 Total de productos: ${totalProducts[0].count}`)
    console.log('\n📋 Por categoría:')
    byCategory.forEach(cat => console.log(`  • ${cat.category}: ${cat.count}`))
    
  } catch (error) {
    console.error('\n❌ Error al agregar productos:', error)
    process.exit(1)
  }
}

seedProducts()
