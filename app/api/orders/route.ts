import { NextResponse } from 'next/server'
import { fetchOrders, addOrder } from '../../../lib/ordersAPI'

export async function GET() {
  try {
    const orders = await fetchOrders()
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const order = await addOrder(body)
    
    if (!order) {
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }
    
    return NextResponse.json(order)
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
