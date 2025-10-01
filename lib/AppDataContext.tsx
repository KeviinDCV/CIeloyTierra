'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { fetchCategories, addCategory as addCategoryAPI, deleteCategory as deleteCategoryAPI } from './categoriesAPI'
import { fetchCelebrations, addCelebration as addCelebrationAPI, updateCelebration as updateCelebrationAPI, deleteCelebration as deleteCelebrationAPI } from './celebrationsAPI'
import { fetchProducts } from './productsAPI'
import { fetchOrders, addOrder as addOrderAPI, updateOrder as updateOrderAPI } from './ordersAPI'

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
  rating: number
  featured: boolean
}

interface Order {
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

interface Celebration {
  id: number
  customerName: string
  customerPhone: string
  eventType: string
  date: string
  guests: number
  notes: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
}

interface CartItem {
  id: number
  name: string
  description: string
  price: number
  image: string
  quantity: number
  category: string
}

interface Category {
  id: number
  name: string
  description?: string
  color?: string
}

interface AppDataContextType {
  // Products
  products: Product[]
  setProducts: (products: Product[]) => void
  getFeaturedProducts: () => Product[]
  
  // Orders
  orders: Order[]
  setOrders: (orders: Order[]) => void
  addOrder: (order: Omit<Order, 'id' | 'timestamp'>) => void
  
  // Celebrations
  celebrations: Celebration[]
  setCelebrations: (celebrations: Celebration[]) => void
  addCelebration: (celebration: Omit<Celebration, 'id'>) => void
  
  // Categories
  categories: Category[]
  setCategories: (categories: Category[]) => void
  addCategory: (category: Omit<Category, 'id'>) => void
  deleteCategory: (categoryId: number) => void
  
  // Cart
  cart: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: number) => void
  updateCartQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined)

// No default data - everything will be managed from admin panel
const defaultProducts: Product[] = []

// Default categories to start with
const defaultCategories: Category[] = [
  { id: 1, name: 'Desayuno', description: 'Comidas matutinas', color: '#fdb72d' },
  { id: 2, name: 'Almuerzo', description: 'Comidas del mediodía', color: '#e61d25' },
  { id: 3, name: 'Cena', description: 'Comidas nocturnas', color: '#2d3748' },
  { id: 4, name: 'Entrada', description: 'Aperitivos y entradas', color: '#38a169' },
  { id: 5, name: 'Principal', description: 'Platos principales', color: '#3182ce' },
  { id: 6, name: 'Postre', description: 'Dulces y postres', color: '#d53f8c' },
  { id: 7, name: 'Bebida', description: 'Bebidas y refrescos', color: '#805ad5' }
]

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [products, setProductsState] = useState<Product[]>(defaultProducts)
  const [orders, setOrdersState] = useState<Order[]>([])
  const [celebrations, setCelebrationsState] = useState<Celebration[]>([])
  const [categories, setCategoriesState] = useState<Category[]>(defaultCategories)
  const [cart, setCart] = useState<CartItem[]>([])
  const [nextOrderId, setNextOrderId] = useState(1)
  const [nextCelebrationId, setNextCelebrationId] = useState(1)
  const [nextCategoryId, setNextCategoryId] = useState(8)
  const [isClient, setIsClient] = useState(false)

  // Set client flag to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load products from Supabase
  const loadProductsFromSupabase = async () => {
    try {
      const productsFromDB = await fetchProducts()
      setProductsState(productsFromDB)
    } catch (error) {
      console.error('Error loading products from Supabase:', error)
      // Fallback to localStorage if Supabase fails
      const savedProducts = localStorage.getItem('cieloytierra_products')
      if (savedProducts) {
        setProductsState(JSON.parse(savedProducts))
      }
    }
  }

  // Load orders from Supabase
  const loadOrdersFromSupabase = async () => {
    try {
      const ordersFromDB = await fetchOrders()
      setOrdersState(ordersFromDB)
    } catch (error) {
      console.error('Error loading orders from Supabase:', error)
      // Fallback to localStorage if Supabase fails
      const savedOrders = localStorage.getItem('cieloytierra_orders')
      if (savedOrders) {
        setOrdersState(JSON.parse(savedOrders))
      }
    }
  }

  // Load celebrations from Supabase
  const loadCelebrationsFromSupabase = async () => {
    try {
      const celebrationsFromDB = await fetchCelebrations()
      setCelebrationsState(celebrationsFromDB)
    } catch (error) {
      console.error('Error loading celebrations from Supabase:', error)
      // Fallback to localStorage if Supabase fails
      const savedCelebrations = localStorage.getItem('cieloytierra_celebrations')
      if (savedCelebrations) {
        setCelebrationsState(JSON.parse(savedCelebrations))
      }
    }
  }

  // Load data from server and sync with localStorage on mount (only on client)
  useEffect(() => {
    if (!isClient) return
    
    // Load products, orders, categories and celebrations from Supabase
    loadProductsFromSupabase()
    loadOrdersFromSupabase()
    loadCategoriesFromSupabase()
    loadCelebrationsFromSupabase()
    
    try {
      const savedCart = localStorage.getItem('cieloytierra_cart')
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        setCart(parsedCart)
      }
    } catch (error) {
      console.warn('Error loading saved data:', error)
    }
  }, [isClient])

  // Save to localStorage when data changes
  const setProducts = (newProducts: Product[]) => {
    setProductsState(newProducts)
    try {
      localStorage.setItem('cieloytierra_products', JSON.stringify(newProducts))
    } catch (error) {
      console.error('Error saving products to localStorage:', error)
      if (error instanceof DOMException && error.code === 22) {
        console.log('LocalStorage quota exceeded for products, clearing and retrying...')
        localStorage.clear()
        try {
          localStorage.setItem('cieloytierra_products', JSON.stringify(newProducts))
        } catch (retryError) {
          console.error('Still failed saving products after clearing localStorage:', retryError)
        }
      }
    }
  }

  const setOrders = (newOrders: Order[]) => {
    setOrdersState(newOrders)
    try {
      // Limit orders to prevent localStorage overflow (keep only last 50 orders)
      const limitedOrders = newOrders.slice(-50)
      localStorage.setItem('cieloytierra_orders', JSON.stringify(limitedOrders))
    } catch (error) {
      console.error('Error saving orders to localStorage:', error)
      // Clear localStorage and try again with limited data
      if (error instanceof DOMException && error.code === 22) {
        console.log('LocalStorage quota exceeded, clearing and saving limited data...')
        localStorage.clear()
        try {
          const limitedOrders = newOrders.slice(-10) // Even more limited in emergency
          localStorage.setItem('cieloytierra_orders', JSON.stringify(limitedOrders))
          console.log('Successfully saved limited orders after clearing localStorage')
        } catch (retryError) {
          console.error('Still failed after clearing localStorage:', retryError)
        }
      }
    }
  }

  const setCelebrations = (newCelebrations: Celebration[]) => {
    setCelebrationsState(newCelebrations)
    try {
      localStorage.setItem('cieloytierra_celebrations', JSON.stringify(newCelebrations))
    } catch (error) {
      console.error('Error saving celebrations to localStorage:', error)
      if (error instanceof DOMException && error.code === 22) {
        console.log('LocalStorage quota exceeded for celebrations, clearing and retrying...')
        localStorage.clear()
        try {
          localStorage.setItem('cieloytierra_celebrations', JSON.stringify(newCelebrations))
        } catch (retryError) {
          console.error('Still failed saving celebrations after clearing localStorage:', retryError)
        }
      }
    }
  }

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart)
    localStorage.setItem('cieloytierra_cart', JSON.stringify(newCart))
  }

  // Helper functions
  const getFeaturedProducts = () => {
    return products.filter(product => product.featured)
  }

  const addOrder = async (orderData: Omit<Order, 'id' | 'timestamp'>) => {
    try {
      const newOrder = await addOrderAPI(orderData)
      if (newOrder) {
        setOrdersState([...orders, newOrder])
        return newOrder
      }
    } catch (error) {
      console.error('Error adding order:', error)
      throw error
    }
  }

  const addCelebration = async (celebrationData: Omit<Celebration, 'id'>) => {
    try {
      const newCelebration = await addCelebrationAPI(celebrationData)
      if (newCelebration) {
        setCelebrationsState([...celebrations, newCelebration])
        return newCelebration
      }
    } catch (error) {
      console.error('Error adding celebration:', error)
      throw error
    }
  }

  // Cart functions
  const addToCart = (product: Product, quantity: number = 1) => {
    const existingItem = cart.find(item => item.id === product.id)
    
    if (existingItem) {
      updateCartQuantity(product.id, existingItem.quantity + quantity)
    } else {
      const cartItem: CartItem = {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        quantity,
        category: product.category
      }
      updateCart([...cart, cartItem])
    }
  }

  const removeFromCart = (productId: number) => {
    updateCart(cart.filter(item => item.id !== productId))
  }

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    
    updateCart(cart.map(item => 
      item.id === productId ? { ...item, quantity } : item
    ))
  }

  const clearCart = () => {
    updateCart([])
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  // Category functions with Supabase
  const loadCategoriesFromSupabase = async () => {
    try {
      const categoriesFromDB = await fetchCategories()
      setCategoriesState(categoriesFromDB)
    } catch (error) {
      console.error('Error loading categories from Supabase:', error)
      // Fallback to localStorage if Supabase fails
      const savedCategories = localStorage.getItem('cieloytierra_categories')
      if (savedCategories) {
        setCategoriesState(JSON.parse(savedCategories))
      }
    }
  }

  const setCategories = (newCategories: Category[]) => {
    setCategoriesState(newCategories)
    localStorage.setItem('cieloytierra_categories', JSON.stringify(newCategories))
  }

  const addCategory = async (categoryData: Omit<Category, 'id'>) => {
    try {
      const newCategory = await addCategoryAPI(categoryData)
      if (newCategory) {
        setCategoriesState([...categories, newCategory])
        return newCategory
      }
    } catch (error) {
      console.error('Error adding category:', error)
      throw error
    }
  }

  const deleteCategory = async (categoryId: number) => {
    try {
      const success = await deleteCategoryAPI(categoryId)
      if (success) {
        setCategoriesState(categories.filter(cat => cat.id !== categoryId))
        return true
      }
      return false
    } catch (error) {
      console.error('Error deleting category:', error)
      throw error
    }
  }

  const value: AppDataContextType = {
    // Products
    products,
    setProducts,
    getFeaturedProducts,
    
    // Orders
    orders,
    setOrders,
    addOrder,
    
    // Celebrations
    celebrations,
    setCelebrations,
    addCelebration,
    
    // Categories
    categories,
    setCategories,
    addCategory,
    deleteCategory,
    
    // Cart
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal
  }

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  )
}

export function useAppData() {
  const context = useContext(AppDataContext)
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider')
  }
  return context
}

// Export interfaces for use in other components
export type { Product, Order, Celebration, CartItem, Category }
