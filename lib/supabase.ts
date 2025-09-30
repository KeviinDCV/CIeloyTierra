import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
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
        Insert: {
          id?: number
          name: string
          description: string
          price: number
          image: string
          category: string
          featured?: boolean
          rating?: number
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string
          price?: number
          image?: string
          category?: string
          featured?: boolean
          rating?: number
          created_at?: string
        }
      }
    }
  }
}
