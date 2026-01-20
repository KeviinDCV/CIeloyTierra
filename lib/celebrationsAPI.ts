import { supabase } from './db'

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

interface CelebrationDB {
  id: number
  customer_name: string
  customer_phone: string
  event_type: string
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
      .select('id, customer_name, customer_phone, event_type, date, guests, notes, status')
      .order('created_at', { ascending: false })

    if (error) throw error

    // Map snake_case from DB to camelCase for frontend
    return data.map((item: CelebrationDB) => ({
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
      .insert({
        customer_name: celebration.customerName,
        customer_phone: celebration.customerPhone,
        event_type: celebration.eventType,
        date: celebration.date,
        guests: celebration.guests,
        notes: celebration.notes || '',
        status: celebration.status || 'pending'
      })
      .select()
      .single()

    if (error) throw error

    const result = data as CelebrationDB
    // Map snake_case from DB to camelCase for frontend
    return {
      id: result.id,
      customerName: result.customer_name,
      customerPhone: result.customer_phone,
      eventType: result.event_type,
      date: result.date,
      guests: result.guests,
      notes: result.notes || '',
      status: result.status
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

    if (error) throw error

    const result = data as CelebrationDB
    // Map snake_case from DB to camelCase for frontend
    return {
      id: result.id,
      customerName: result.customer_name,
      customerPhone: result.customer_phone,
      eventType: result.event_type,
      date: result.date,
      guests: result.guests,
      notes: result.notes || '',
      status: result.status
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

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error in deleteCelebration:', error)
    return false
  }
}
