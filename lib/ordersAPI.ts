import { supabase } from './supabase'

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

// Fetch all orders from Supabase
export async function fetchOrders(): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('timestamp', { ascending: false })

    if (error) {
      console.error('Error fetching orders:', error)
      throw error
    }

    // Map snake_case from DB to camelCase for frontend
    return (data || []).map(item => ({
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

// Add a new order to Supabase
export async function addOrder(order: Omit<Order, 'id' | 'timestamp'>): Promise<Order | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        customer_name: order.customerName,
        customer_phone: order.customerPhone,
        customer_address: order.customerAddress,
        items: order.items,
        total: order.total,
        status: order.status || 'pending',
        notes: order.notes || ''
      }])
      .select()
      .single()

    if (error) {
      console.error('Error adding order:', error)
      throw error
    }

    // Map snake_case from DB to camelCase for frontend
    return {
      id: data.id,
      customerName: data.customer_name,
      customerPhone: data.customer_phone,
      customerAddress: data.customer_address,
      items: data.items,
      total: parseFloat(data.total),
      status: data.status,
      timestamp: data.timestamp,
      notes: data.notes || ''
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

    if (error) {
      console.error('Error updating order:', error)
      throw error
    }

    // Map snake_case from DB to camelCase for frontend
    return {
      id: data.id,
      customerName: data.customer_name,
      customerPhone: data.customer_phone,
      customerAddress: data.customer_address,
      items: data.items,
      total: parseFloat(data.total),
      status: data.status,
      timestamp: data.timestamp,
      notes: data.notes || ''
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

    if (error) {
      console.error('Error deleting order:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Error in deleteOrder:', error)
    return false
  }
}
