import { supabase } from './supabase'

export interface Celebration {
  id: number
  customerName: string
  customerPhone: string
  eventType: string
  date: string
  guests: number
  notes: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
}

// Fetch all celebrations from Supabase
export async function fetchCelebrations(): Promise<Celebration[]> {
  try {
    const { data, error } = await supabase
      .from('celebrations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching celebrations:', error)
      throw error
    }

    // Map snake_case from DB to camelCase for frontend
    return (data || []).map(item => ({
      id: item.id,
      customerName: item.customer_name,
      customerPhone: item.customer_phone,
      eventType: item.event_type,
      date: item.date,
      guests: item.guests,
      notes: item.notes || '',
      status: item.status
    }))
  } catch (error) {
    console.error('Error in fetchCelebrations:', error)
    return []
  }
}

// Add a new celebration to Supabase
export async function addCelebration(celebration: Omit<Celebration, 'id'>): Promise<Celebration | null> {
  try {
    const { data, error } = await supabase
      .from('celebrations')
      .insert([{
        customer_name: celebration.customerName,
        customer_phone: celebration.customerPhone,
        event_type: celebration.eventType,
        date: celebration.date,
        guests: celebration.guests,
        notes: celebration.notes || '',
        status: celebration.status || 'pending'
      }])
      .select()
      .single()

    if (error) {
      console.error('Error adding celebration:', error)
      throw error
    }

    // Map snake_case from DB to camelCase for frontend
    return {
      id: data.id,
      customerName: data.customer_name,
      customerPhone: data.customer_phone,
      eventType: data.event_type,
      date: data.date,
      guests: data.guests,
      notes: data.notes || '',
      status: data.status
    }
  } catch (error) {
    console.error('Error in addCelebration:', error)
    return null
  }
}

// Update an existing celebration in Supabase
export async function updateCelebration(id: number, celebration: Partial<Celebration>): Promise<Celebration | null> {
  try {
    const updateData: any = {}
    
    if (celebration.customerName !== undefined) updateData.customer_name = celebration.customerName
    if (celebration.customerPhone !== undefined) updateData.customer_phone = celebration.customerPhone
    if (celebration.eventType !== undefined) updateData.event_type = celebration.eventType
    if (celebration.date !== undefined) updateData.date = celebration.date
    if (celebration.guests !== undefined) updateData.guests = celebration.guests
    if (celebration.notes !== undefined) updateData.notes = celebration.notes
    if (celebration.status !== undefined) updateData.status = celebration.status

    const { data, error } = await supabase
      .from('celebrations')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating celebration:', error)
      throw error
    }

    // Map snake_case from DB to camelCase for frontend
    return {
      id: data.id,
      customerName: data.customer_name,
      customerPhone: data.customer_phone,
      eventType: data.event_type,
      date: data.date,
      guests: data.guests,
      notes: data.notes || '',
      status: data.status
    }
  } catch (error) {
    console.error('Error in updateCelebration:', error)
    return null
  }
}

// Delete a celebration from Supabase
export async function deleteCelebration(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('celebrations')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting celebration:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Error in deleteCelebration:', error)
    return false
  }
}
