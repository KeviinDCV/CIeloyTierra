import { supabase } from './supabase'

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

// Fetch all products from Supabase
export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      console.error('Error fetching products:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error in fetchProducts:', error)
    return []
  }
}

// Add a new product to Supabase
export async function addProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        featured: product.featured,
        rating: product.rating || 0
      }])
      .select()
      .single()

    if (error) {
      console.error('Error adding product:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error in addProduct:', error)
    return null
  }
}

// Update an existing product in Supabase
export async function updateProduct(id: number, product: Partial<Product>): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        featured: product.featured,
        rating: product.rating
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating product:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error in updateProduct:', error)
    return null
  }
}

// Delete a product from Supabase
export async function deleteProduct(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting product:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Error in deleteProduct:', error)
    return false
  }
}
