import { createClient } from '@supabase/supabase-js'

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : (() => {
      if (typeof window === 'undefined') {
        console.warn('Supabase credentials not set - database operations will fail')
      }
      return null as any
    })()

// For backwards compatibility with Neon code, we keep the sql export
// but it's not used anymore - we use supabase client directly
export const sql = supabase

// Database types
export interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
  featured: boolean
  rating: number
  created_at: string
}

export interface Category {
  id: number
  name: string
  description?: string
  color?: string
  created_at: string
}

export interface Order {
  id: number
  customer_name: string
  customer_phone: string
  customer_address: string
  items: any
  total: number
  status: 'pending' | 'accepted' | 'completed' | 'cancelled'
  notes?: string
  timestamp: string
}

export interface Celebration {
  id: number
  customer_name: string
  customer_phone: string
  event_type: string
  date: string
  guests: number
  notes?: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  created_at: string
}
