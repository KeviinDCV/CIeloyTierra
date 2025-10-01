import { supabase } from './supabase'

export interface Category {
  id: number
  name: string
  description?: string
  color?: string
}

// Fetch all categories from Supabase
export async function fetchCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error in fetchCategories:', error)
    return []
  }
}

// Add a new category to Supabase
export async function addCategory(category: Omit<Category, 'id'>): Promise<Category | null> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([{
        name: category.name,
        description: category.description,
        color: category.color || '#3182ce'
      }])
      .select()
      .single()

    if (error) {
      console.error('Error adding category:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error in addCategory:', error)
    return null
  }
}

// Update an existing category in Supabase
export async function updateCategory(id: number, category: Partial<Category>): Promise<Category | null> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update({
        name: category.name,
        description: category.description,
        color: category.color
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating category:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error in updateCategory:', error)
    return null
  }
}

// Delete a category from Supabase
export async function deleteCategory(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting category:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Error in deleteCategory:', error)
    return false
  }
}
