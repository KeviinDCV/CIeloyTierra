import { sql } from './db'

export interface Category {
  id: number
  name: string
  description?: string
  color?: string
}

// Fetch all categories from Neon
export async function fetchCategories(): Promise<Category[]> {
  try {
    const data = await sql`
      SELECT id, name, description, color
      FROM categories
      ORDER BY id ASC
    `

    return data as Category[]
  } catch (error) {
    console.error('Error in fetchCategories:', error)
    return []
  }
}

// Add a new category to Neon
export async function addCategory(category: Omit<Category, 'id'>): Promise<Category | null> {
  try {
    const data = await sql`
      INSERT INTO categories (name, description, color)
      VALUES (
        ${category.name},
        ${category.description || null},
        ${category.color || '#3182ce'}
      )
      RETURNING *
    `

    return data[0] as Category
  } catch (error) {
    console.error('Error in addCategory:', error)
    return null
  }
}

// Update an existing category in Neon
export async function updateCategory(id: number, category: Partial<Category>): Promise<Category | null> {
  try {
    const data = await sql`
      UPDATE categories
      SET
        name = COALESCE(${category.name}, name),
        description = COALESCE(${category.description}, description),
        color = COALESCE(${category.color}, color)
      WHERE id = ${id}
      RETURNING *
    `

    return data[0] as Category
  } catch (error) {
    console.error('Error in updateCategory:', error)
    return null
  }
}

// Delete a category from Neon
export async function deleteCategory(id: number): Promise<boolean> {
  try {
    await sql`
      DELETE FROM categories
      WHERE id = ${id}
    `

    return true
  } catch (error) {
    console.error('Error in deleteCategory:', error)
    return false
  }
}
