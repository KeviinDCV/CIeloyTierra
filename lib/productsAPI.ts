import { sql } from './db'

export interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
  featured: boolean
  rating: number
}

// Fetch all products from Neon
export async function fetchProducts(): Promise<Product[]> {
  try {
    const data = await sql`
      SELECT id, name, description, price, image, category, featured, rating, created_at
      FROM products
      ORDER BY id ASC
    `

    return data as Product[]
  } catch (error) {
    console.error('Error in fetchProducts:', error)
    return []
  }
}

// Add a new product to Neon
export async function addProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
  try {
    const data = await sql`
      INSERT INTO products (name, description, price, image, category, featured, rating)
      VALUES (
        ${product.name},
        ${product.description},
        ${product.price},
        ${product.image},
        ${product.category},
        ${product.featured},
        ${product.rating || 0}
      )
      RETURNING *
    `

    return data[0] as Product
  } catch (error) {
    console.error('Error in addProduct:', error)
    return null
  }
}

// Update an existing product in Neon
export async function updateProduct(id: number, product: Partial<Product>): Promise<Product | null> {
  try {
    const data = await sql`
      UPDATE products
      SET
        name = COALESCE(${product.name}, name),
        description = COALESCE(${product.description}, description),
        price = COALESCE(${product.price}, price),
        image = COALESCE(${product.image}, image),
        category = COALESCE(${product.category}, category),
        featured = COALESCE(${product.featured}, featured),
        rating = COALESCE(${product.rating}, rating)
      WHERE id = ${id}
      RETURNING *
    `

    return data[0] as Product
  } catch (error) {
    console.error('Error in updateProduct:', error)
    return null
  }
}

// Delete a product from Neon
export async function deleteProduct(id: number): Promise<boolean> {
  try {
    await sql`
      DELETE FROM products
      WHERE id = ${id}
    `

    return true
  } catch (error) {
    console.error('Error in deleteProduct:', error)
    return false
  }
}
