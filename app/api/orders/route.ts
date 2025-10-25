import { NextResponse } from 'next/server'
import { fetchOrders, addOrder } from '@/lib/ordersAPI'

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
    const newOrder = await addOrder(body)
    return NextResponse.json(newOrder)
  } catch (error) {
    console.error('Error adding order:', error)
    return NextResponse.json({ error: 'Failed to add order' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
