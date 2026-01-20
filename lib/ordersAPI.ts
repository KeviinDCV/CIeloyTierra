import { supabase } from './db'

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

interface OrderDB {
  id: number
  customer_name: string
  customer_phone: string
  customer_address: string
  items: any[]
  total: string | number
  status: 'pending' | 'accepted' | 'completed' | 'cancelled'
  timestamp: string
  notes?: string
}

// Fetch all orders from Supabase
export async function fetchOrders(): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('id, customer_name, customer_phone, customer_address, items, total, status, timestamp, notes')
      .order('timestamp', { ascending: false })

    if (error) throw error

    // Map snake_case from DB to camelCase for frontend
    return data.map((item: OrderDB) => ({
      id: item.id,
      customerName: item.customer_name,
      customerPhone: item.customer_phone,
      customerAddress: item.customer_address,
      items: item.items,
      total: typeof item.total === 'string' ? parseFloat(item.total) : item.total,
      status: item.status,
      timestamp: item.timestamp,
      notes: item.notes || ''
    }))
  } catch (error) {
    console.error('Error in fetchOrders:', error)
    return []
  }
}

// Add a new order to Supabase
export async function addOrder(order: Omit<Order, 'id' | 'timestamp'>): Promise<Order | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        customer_name: order.customerName,
        customer_phone: order.customerPhone,
        customer_address: order.customerAddress,
        items: order.items,
        total: order.total,
        status: order.status || 'pending',
        notes: order.notes || ''
      })
      .select()
      .single()

    if (error) throw error

    const result = data as OrderDB
    // Map snake_case from DB to camelCase for frontend
    return {
      id: result.id,
      customerName: result.customer_name,
      customerPhone: result.customer_phone,
      customerAddress: result.customer_address,
      items: result.items,
      total: typeof result.total === 'string' ? parseFloat(result.total) : result.total,
      status: result.status,
      timestamp: result.timestamp,
      notes: result.notes || ''
    }
  } catch (error) {
    console.error('Error in addOrder:', error)
    return null
  }
}

// Update an existing order in Supabase
export async function updateOrder(id: number, order: Partial<Order>): Promise<Order | null> {
  try {
    const updateData: any = {}
    if (order.customerName !== undefined) updateData.customer_name = order.customerName
    if (order.customerPhone !== undefined) updateData.customer_phone = order.customerPhone
    if (order.customerAddress !== undefined) updateData.customer_address = order.customerAddress
    if (order.items !== undefined) updateData.items = order.items
    if (order.total !== undefined) updateData.total = order.total
    if (order.status !== undefined) updateData.status = order.status
    if (order.notes !== undefined) updateData.notes = order.notes

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    const result = data as OrderDB
    // Map snake_case from DB to camelCase for frontend
    return {
      id: result.id,
      customerName: result.customer_name,
      customerPhone: result.customer_phone,
      customerAddress: result.customer_address,
      items: result.items,
      total: typeof result.total === 'string' ? parseFloat(result.total) : result.total,
      status: result.status,
      timestamp: result.timestamp,
      notes: result.notes || ''
    }
  } catch (error) {
    console.error('Error in updateOrder:', error)
    return null
  }
}

// Delete an order from Supabase
export async function deleteOrder(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error in deleteOrder:', error)
    return false
  }
}
