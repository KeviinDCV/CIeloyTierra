import { NextRequest, NextResponse } from 'next/server'
import { fetchProducts, addProduct, updateProduct } from '@/lib/productsAPI'

export async function GET() {
  try {
    const products = await fetchProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const product = await addProduct(body)
    
    if (!product) {
      return NextResponse.json({ error: 'Failed to add product' }, { status: 500 })
    }
    
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error adding product:', error)
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...productData } = body
    
    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }
    
    const product = await updateProduct(id, productData)
    
    if (!product) {
      return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
    }
    
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
