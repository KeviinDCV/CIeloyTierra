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
  status: 'pending' | 'accepted' | 'completed'
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

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [products, setProductsState] = useState<Product[]>(defaultProducts)
  const [orders, setOrdersState] = useState<Order[]>([])
  const [celebrations, setCelebrationsState] = useState<Celebration[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [nextOrderId, setNextOrderId] = useState(1)
  const [nextCelebrationId, setNextCelebrationId] = useState(1)

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem('cieloytierra_products')
      const savedOrders = localStorage.getItem('cieloytierra_orders')
      const savedCelebrations = localStorage.getItem('cieloytierra_celebrations')
      const savedCart = localStorage.getItem('cieloytierra_cart')

      if (savedProducts) {
        setProductsState(JSON.parse(savedProducts))
      }
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders)
        setOrdersState(parsedOrders)
        setNextOrderId(Math.max(...parsedOrders.map((o: Order) => o.id), 0) + 1)
      }
      if (savedCelebrations) {
        const parsedCelebrations = JSON.parse(savedCelebrations)
        setCelebrationsState(parsedCelebrations)
        setNextCelebrationId(Math.max(...parsedCelebrations.map((c: Celebration) => c.id), 0) + 1)
      }
      if (savedCart) {
        setCart(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error)
    }
  }, [])

  // Save to localStorage when data changes
  const setProducts = (newProducts: Product[]) => {
    setProductsState(newProducts)
    localStorage.setItem('cieloytierra_products', JSON.stringify(newProducts))
  }

  const setOrders = (newOrders: Order[]) => {
    setOrdersState(newOrders)
    localStorage.setItem('cieloytierra_orders', JSON.stringify(newOrders))
  }

  const setCelebrations = (newCelebrations: Celebration[]) => {
    setCelebrationsState(newCelebrations)
    localStorage.setItem('cieloytierra_celebrations', JSON.stringify(newCelebrations))
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
