'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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
  status: 'pending' | 'confirmed' | 'completed'
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

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem('cieloytierra_products')
      if (savedProducts) {
        const parsedProducts = JSON.parse(savedProducts)
        setProductsState(parsedProducts)
      }

      const savedOrders = localStorage.getItem('cieloytierra_orders')
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders)
        setOrdersState(parsedOrders)
      }

      const savedCelebrations = localStorage.getItem('cieloytierra_celebrations')
      if (savedCelebrations) {
        const parsedCelebrations = JSON.parse(savedCelebrations)
        setCelebrationsState(parsedCelebrations)
      }

      const savedCategories = localStorage.getItem('cieloytierra_categories')
      if (savedCategories) {
        const parsedCategories = JSON.parse(savedCategories)
        setCategoriesState(parsedCategories)
      }

      const savedCart = localStorage.getItem('cieloytierra_cart')
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        setCart(parsedCart)
      }
    } catch (error) {
      console.warn('Error loading saved data:', error)
    }
  }, [])

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

  const addOrder = (orderData: Omit<Order, 'id' | 'timestamp'>) => {
    const newOrder: Order = {
      ...orderData,
      id: nextOrderId,
      timestamp: new Date().toISOString()
    }
    const updatedOrders = [...orders, newOrder]
    setOrders(updatedOrders)
    setNextOrderId(nextOrderId + 1)
  }

  const addCelebration = (celebrationData: Omit<Celebration, 'id'>) => {
    const newCelebration: Celebration = {
      ...celebrationData,
      id: nextCelebrationId
    }
    const updatedCelebrations = [...celebrations, newCelebration]
    setCelebrations(updatedCelebrations)
    setNextCelebrationId(nextCelebrationId + 1)
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

  // Category functions
  const setCategories = (newCategories: Category[]) => {
    setCategoriesState(newCategories)
    localStorage.setItem('cieloytierra_categories', JSON.stringify(newCategories))
  }

  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: nextCategoryId
    }
    const updatedCategories = [...categories, newCategory]
    setCategories(updatedCategories)
    setNextCategoryId(nextCategoryId + 1)
  }

  const deleteCategory = (categoryId: number) => {
    const updatedCategories = categories.filter(cat => cat.id !== categoryId)
    setCategories(updatedCategories)
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
