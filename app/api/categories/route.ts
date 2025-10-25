import { NextResponse } from 'next/server'
import { fetchCategories, addCategory, deleteCategory } from '@/lib/categoriesAPI'

export async function GET() {
  try {
    const categories = await fetchCategories()
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newCategory = await addCategory(body)
    return NextResponse.json(newCategory)
  } catch (error) {
    console.error('Error adding category:', error)
    return NextResponse.json({ error: 'Failed to add category' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Category ID required' }, { status: 400 })
    }
    
    const success = await deleteCategory(parseInt(id))
    return NextResponse.json({ success })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
