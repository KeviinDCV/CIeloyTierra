import { NextResponse } from 'next/server'
import { updateOrder, deleteOrder } from '../../../../lib/ordersAPI'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    
    const order = await updateOrder(id, body)
    
    if (!order) {
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }
    
    return NextResponse.json(order)
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const success = await deleteOrder(id)
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 })
  }
}
