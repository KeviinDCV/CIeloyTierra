import { sql } from './db'

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

// Fetch all celebrations from Neon
export async function fetchCelebrations(): Promise<Celebration[]> {
  try {
    const data = await sql`
      SELECT id, customer_name, customer_phone, event_type, date, guests, notes, status
      FROM celebrations
      ORDER BY created_at DESC
    `

    // Map snake_case from DB to camelCase for frontend
    return data.map(item => ({
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

// Add a new celebration to Neon
export async function addCelebration(celebration: Omit<Celebration, 'id'>): Promise<Celebration | null> {
  try {
    const data = await sql`
      INSERT INTO celebrations (customer_name, customer_phone, event_type, date, guests, notes, status)
      VALUES (
        ${celebration.customerName},
        ${celebration.customerPhone},
        ${celebration.eventType},
        ${celebration.date},
        ${celebration.guests},
        ${celebration.notes || ''},
        ${celebration.status || 'pending'}
      )
      RETURNING *
    `

    const result = data[0]
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

// Update an existing celebration in Neon
export async function updateCelebration(id: number, celebration: Partial<Celebration>): Promise<Celebration | null> {
  try {
    const data = await sql`
      UPDATE celebrations
      SET
        customer_name = COALESCE(${celebration.customerName}, customer_name),
        customer_phone = COALESCE(${celebration.customerPhone}, customer_phone),
        event_type = COALESCE(${celebration.eventType}, event_type),
        date = COALESCE(${celebration.date}, date),
        guests = COALESCE(${celebration.guests}, guests),
        notes = COALESCE(${celebration.notes}, notes),
        status = COALESCE(${celebration.status}, status)
      WHERE id = ${id}
      RETURNING *
    `

    const result = data[0]
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

// Delete a celebration from Neon
export async function deleteCelebration(id: number): Promise<boolean> {
  try {
    await sql`
      DELETE FROM celebrations
      WHERE id = ${id}
    `

    return true
  } catch (error) {
    console.error('Error in deleteCelebration:', error)
    return false
  }
}
