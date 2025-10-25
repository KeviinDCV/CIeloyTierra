import { neon } from '@neondatabase/serverless'

// Validate environment variable (only on server)
if (typeof window === 'undefined' && !process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

// Create Neon SQL client (only on server)
export const sql = typeof window === 'undefined' 
  ? neon(process.env.DATABASE_URL!) 
  : null as any

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
