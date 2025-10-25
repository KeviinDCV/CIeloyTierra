import { sql } from './db'

export interface Order {
  id: number
  customerName: string
  customerPhone: string
  customerAddress: string
  items: any[]
  total: number
  status: 'pending' | 'accepted' | 'completed' | 'cancelled'
  timestamp: string
  notes?: string
}

// Fetch all orders from Neon
export async function fetchOrders(): Promise<Order[]> {
  try {
    const data = await sql`
      SELECT id, customer_name, customer_phone, customer_address, items, total, status, timestamp, notes
      FROM orders
      ORDER BY timestamp DESC
    `

    // Map snake_case from DB to camelCase for frontend
    return data.map(item => ({
      id: item.id,
      customerName: item.customer_name,
      customerPhone: item.customer_phone,
      customerAddress: item.customer_address,
      items: item.items,
      total: parseFloat(item.total),
      status: item.status,
      timestamp: item.timestamp,
      notes: item.notes || ''
    }))
  } catch (error) {
    console.error('Error in fetchOrders:', error)
    return []
  }
}

// Add a new order to Neon
export async function addOrder(order: Omit<Order, 'id' | 'timestamp'>): Promise<Order | null> {
  try {
    const data = await sql`
      INSERT INTO orders (customer_name, customer_phone, customer_address, items, total, status, notes)
      VALUES (
        ${order.customerName},
        ${order.customerPhone},
        ${order.customerAddress},
        ${JSON.stringify(order.items)},
        ${order.total},
        ${order.status || 'pending'},
        ${order.notes || ''}
      )
      RETURNING *
    `

    const result = data[0]
    // Map snake_case from DB to camelCase for frontend
    return {
      id: result.id,
      customerName: result.customer_name,
      customerPhone: result.customer_phone,
      customerAddress: result.customer_address,
      items: result.items,
      total: parseFloat(result.total),
      status: result.status,
      timestamp: result.timestamp,
      notes: result.notes || ''
    }
  } catch (error) {
    console.error('Error in addOrder:', error)
    return null
  }
}

// Update an existing order in Neon
export async function updateOrder(id: number, order: Partial<Order>): Promise<Order | null> {
  try {
    const data = await sql`
      UPDATE orders
      SET
        customer_name = COALESCE(${order.customerName}, customer_name),
        customer_phone = COALESCE(${order.customerPhone}, customer_phone),
        customer_address = COALESCE(${order.customerAddress}, customer_address),
        items = COALESCE(${order.items ? JSON.stringify(order.items) : null}::jsonb, items),
        total = COALESCE(${order.total}, total),
        status = COALESCE(${order.status}, status),
        notes = COALESCE(${order.notes}, notes)
      WHERE id = ${id}
      RETURNING *
    `

    const result = data[0]
    // Map snake_case from DB to camelCase for frontend
    return {
      id: result.id,
      customerName: result.customer_name,
      customerPhone: result.customer_phone,
      customerAddress: result.customer_address,
      items: result.items,
      total: parseFloat(result.total),
      status: result.status,
      timestamp: result.timestamp,
      notes: result.notes || ''
    }
  } catch (error) {
    console.error('Error in updateOrder:', error)
    return null
  }
}

// Delete an order from Neon
export async function deleteOrder(id: number): Promise<boolean> {
  try {
    await sql`
      DELETE FROM orders
      WHERE id = ${id}
    `

    return true
  } catch (error) {
    console.error('Error in deleteOrder:', error)
    return false
  }
}
