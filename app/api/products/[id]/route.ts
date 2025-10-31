import { NextRequest, NextResponse } from 'next/server'
import { deleteProduct } from '@/lib/productsAPI'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }
    
    const success = await deleteProduct(id)
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'

