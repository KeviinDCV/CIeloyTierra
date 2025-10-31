'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useAppData, type Category } from '../../../lib/AppDataContext'
import BottomNavigation from '../../../components/BottomNavigation'
import Modal from '../../../components/Modal'
import { generateInvoice, type Order as InvoiceOrder } from '../../../lib/invoice'
// Note: addProduct and updateProduct are now called via API routes
import { updateCelebration as updateCelebrationAPI, deleteCelebration as deleteCelebrationAPI } from '../../../lib/celebrationsAPI'
import { OrganicBlob, CircleBorder, DecorativeDots, DiamondShape } from '../../../components/decorations'

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

export default function AdminDashboard() {
  const { categories, addCategory, deleteCategory, setOrders: setGlobalOrders } = useAppData()
  const [activeTab, setActiveTab] = useState('overview')
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [celebrations, setCelebrations] = useState<Celebration[]>([])
  const [showProductModal, setShowProductModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'cancelled'>('all')
  const [showClearHistoryModal, setShowClearHistoryModal] = useState(false)
  const [showDeleteCelebrationModal, setShowDeleteCelebrationModal] = useState(false)
  const [celebrationToDelete, setCelebrationToDelete] = useState<number | null>(null)
  const [showDeleteProductModal, setShowDeleteProductModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState<number | null>(null)
  const [newProductId, setNewProductId] = useState(3)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState('')
  const [isClient, setIsClient] = useState(false)
  const [showSessionClosedModal, setShowSessionClosedModal] = useState(false)

  // Set client flag first
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Check authentication on mount (only on client)
  useEffect(() => {
    if (!isClient) return
    
    const verifyAuth = async () => {
      try {
        const { getDeviceId, getAdminToken } = await import('@/lib/adminClientUtils')
        const token = getAdminToken()
        const deviceId = getDeviceId()
        
        if (!token || !deviceId) {
          window.location.href = '/admin'
          return
        }
        
        // Set timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
          localStorage.removeItem('adminToken')
          window.location.href = '/admin'
        }, 5000) // 5 second timeout
        
        // Verify session with server
        const response = await fetch('/api/admin/session/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deviceId, token })
        })
        
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          throw new Error('Verification failed')
        }
        
        const data = await response.json()
        
        if (!data.valid) {
          // Invalid session, redirect to login
          localStorage.removeItem('adminToken')
          window.location.href = '/admin'
          return
        }
        
        // Set up periodic verification (every 30 seconds)
        const intervalId = setInterval(async () => {
          try {
            const { getDeviceId: getCurrentDeviceId, getAdminToken: getCurrentToken } = await import('@/lib/adminClientUtils')
            const currentToken = getCurrentToken()
            const currentDeviceId = getCurrentDeviceId()
            
            if (!currentToken || !currentDeviceId) {
              clearInterval(intervalId)
              window.location.href = '/admin'
              return
            }
            
            const verifyResponse = await fetch('/api/admin/session/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ deviceId: currentDeviceId, token: currentToken })
            })
            
            if (verifyResponse.ok) {
              const verifyData = await verifyResponse.json()
              if (!verifyData.valid) {
                // Session was invalidated (someone else logged in)
                clearInterval(intervalId)
                localStorage.removeItem('adminToken')
                setShowSessionClosedModal(true)
              }
            }
          } catch (error) {
            console.error('Error in periodic verification:', error)
          }
        }, 30000) // Check every 30 seconds
        
        // Cleanup interval on unmount
        return () => {
          clearInterval(intervalId)
        }
      } catch (error) {
        console.error('Error verifying session:', error)
        // On error, redirect to login for security
        localStorage.removeItem('adminToken')
        window.location.href = '/admin'
      }
    }
    
    verifyAuth()
  }, [isClient])

  // Image compression function (preserves PNG transparency)
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new window.Image()
      
      img.onload = () => {
        const maxWidth = 600
        const maxHeight = 600
        let { width, height } = img
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        if (ctx) {
          // Clear canvas with transparent background for PNG files
          if (file.type === 'image/png') {
            ctx.clearRect(0, 0, width, height)
          }
          
          ctx.drawImage(img, 0, 0, width, height)
          
          // Preserve format: PNG for PNG files (with transparency), JPEG for others
          const outputFormat = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
          const quality = file.type === 'image/png' ? 0.9 : 0.6 // Higher quality for PNG
          const compressedDataUrl = canvas.toDataURL(outputFormat, quality)
          resolve(compressedDataUrl)
        } else {
          resolve(URL.createObjectURL(file))
        }
      }
      
      img.onerror = () => {
        resolve(URL.createObjectURL(file))
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  // Handle product save with Supabase
  const handleSaveProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      let result
      
      if (editingProduct) {
        // Update existing product via API
        const response = await fetch('/api/products', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingProduct.id,
            ...productData,
            rating: 0
          })
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to update product')
        }
        
        result = await response.json()
        
        if (result) {
          // Update local state
          setProducts(products.map(p => p.id === editingProduct.id ? result! : p))
          setToastMessage('✅ Producto actualizado correctamente')
          // Reload products from API to ensure consistency
          loadProductsFromSupabase()
        } else {
          throw new Error('Failed to update product')
        }
      } else {
        // Add new product via API
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...productData,
            rating: 0
          })
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to add product')
        }
        
        result = await response.json()
        
        if (result) {
          // Update local state
          setProducts([...products, result])
          setToastMessage('✅ Producto agregado correctamente')
          // Reload products from API to ensure consistency
          loadProductsFromSupabase()
        } else {
          throw new Error('Failed to add product')
        }
      }
      
      setShowProductModal(false)
      setEditingProduct(null)
      setSelectedImage(null)
      
      // Clear toast after 3 seconds
      setTimeout(() => setToastMessage(''), 3000)
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error al guardar el producto. Por favor intenta de nuevo.')
    }
  }

  // Handle image selection with compression
  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('La imagen es demasiado grande. Por favor selecciona una imagen menor a 5MB.')
        return
      }
      
      try {
        const compressedImage = await compressImage(file)
        setSelectedImage(compressedImage)
      } catch (error) {
        console.error('Error processing image:', error)
        alert('Error al procesar la imagen')
      }
    }
  }

  // Delete product with modal
  const deleteProduct = (productId: number) => {
    setProductToDelete(productId)
    setShowDeleteProductModal(true)
  }

  // Confirm product deletion
  const confirmDeleteProduct = async () => {
    if (productToDelete === null) return

    try {
      const response = await fetch(`/api/products/${productToDelete}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete product')
      }
      
      const data = await response.json()
      
      if (data.success) {
        // Update local state
        setProducts(products.filter(p => p.id !== productToDelete))
        setToastMessage('🗑️ Producto eliminado correctamente')
        setTimeout(() => setToastMessage(''), 3000)
        // Reload products from API to ensure consistency
        loadProductsFromSupabase()
      } else {
        throw new Error('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      setToastMessage('❌ Error al eliminar el producto')
      setTimeout(() => setToastMessage(''), 3000)
    } finally {
      setShowDeleteProductModal(false)
      setProductToDelete(null)
    }
  }

  // Load products from API
  const loadProductsFromSupabase = async () => {
    try {
      const response = await fetch('/api/products')
      if (!response.ok) throw new Error('Failed to fetch products')
      const productsFromDB = await response.json()
      setProducts(productsFromDB)
    } catch (error) {
      console.error('Error loading products:', error)
      // Fallback to localStorage if API fails
      const savedProducts = localStorage.getItem('cieloytierra_products')
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts))
      }
    }
  }

  // Load celebrations from API
  const loadCelebrationsFromSupabase = async () => {
    try {
      const response = await fetch('/api/celebrations')
      if (!response.ok) throw new Error('Failed to fetch celebrations')
      const celebrationsFromDB = await response.json()
      setCelebrations(celebrationsFromDB)
    } catch (error) {
      console.error('Error loading celebrations:', error)
      // Fallback to localStorage if API fails
      const savedCelebrations = localStorage.getItem('cieloytierra_celebrations')
      if (savedCelebrations) {
        setCelebrations(JSON.parse(savedCelebrations))
      }
    }
  }

  // Load orders from API
  const loadOrdersFromSupabase = async () => {
    try {
      const response = await fetch('/api/orders')
      if (!response.ok) throw new Error('Failed to fetch orders')
      const ordersFromDB = await response.json()
      setOrders(ordersFromDB)
    } catch (error) {
      console.error('Error loading orders:', error)
      // Fallback to localStorage if API fails
      const savedOrders = localStorage.getItem('cieloytierra_orders')
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders))
      }
    }
  }

  // Function to load data from localStorage with intelligent merge logic
  const loadDataFromStorage = () => {
    if (!isClient) return
    
    try {
      const savedOrders = localStorage.getItem('cieloytierra_orders')

      if (savedOrders) {
        const newOrdersFromStorage = JSON.parse(savedOrders)
        
        // Intelligent merge: preserve existing order states while adding new orders
        setOrders(currentOrders => {
          // Create a map of current orders by ID for quick lookup
          const currentOrdersMap = new Map(currentOrders.map(order => [order.id, order]))
          
          // Start with all orders from storage
          const mergedOrders = [...newOrdersFromStorage]
          
          // Update each order: if it exists in current state, preserve its status and updates
          for (let i = 0; i < mergedOrders.length; i++) {
            const storageOrder = mergedOrders[i]
            const currentOrder = currentOrdersMap.get(storageOrder.id)
            
            if (currentOrder) {
              // Preserve the current state (status changes made by admin)
              mergedOrders[i] = {
                ...storageOrder, // Keep data from storage (in case customer info was updated)
                status: currentOrder.status, // Preserve admin's status changes
                // Preserve any other admin modifications
              }
            }
            // If order doesn't exist in current state, it's a new order - keep as is
          }
          
          return mergedOrders
        })
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error)
    }
  }

  // Load data from Supabase and localStorage on component mount (only on client)
  useEffect(() => {
    if (!isClient) return
    loadProductsFromSupabase()
    loadOrdersFromSupabase()
    loadCelebrationsFromSupabase()
    loadDataFromStorage()
  }, [isClient])

  // Auto-refresh data every 10 seconds for real-time monitoring (only on client)
  useEffect(() => {
    if (!isClient) return
    
    const interval = setInterval(() => {
      // Only refresh if no modals are open to prevent conflicts
      if (!showClearHistoryModal && !showProductModal && !showCategoryModal) {
        loadOrdersFromSupabase() // Real-time updates for orders
        loadCelebrationsFromSupabase() // Real-time updates for celebrations
      }
    }, 10000) // Poll every 10 seconds

    return () => clearInterval(interval)
  }, [isClient, showClearHistoryModal, showProductModal, showCategoryModal])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    window.location.href = '/admin'
  }

  const updateOrderStatus = async (orderId: number, newStatus: Order['status']) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update order')
      }
      
      const result = await response.json()
      
      // Update local state
      const updatedOrders = orders.map(order =>
        order.id === orderId ? result : order
      )
      setOrders(updatedOrders)
      setToastMessage('✅ Estado del pedido actualizado')
      setTimeout(() => setToastMessage(''), 3000)
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Error al actualizar el estado del pedido. Por favor intenta de nuevo.')
    }
  }

  const contactCustomer = (order: any) => {
    const message = `¡Hola ${order.customerName}! 🍽️\n\nTu pedido #${order.id} de Cielo y Tierra está siendo procesado.\n\nDetalles del pedido:\n${order.items.map((item: any) => `• ${item.name} x${item.quantity}`).join('\n')}\n\nTotal: $${order.total.toLocaleString('es-CO')}\n\n¡Te contactaremos pronto para coordinar la entrega! 😊`
    
    // Clean phone number (remove spaces, dashes, etc.)
    const cleanPhone = order.customerPhone.replace(/\D/g, '')
    
    // WhatsApp URL
    const whatsappUrl = `https://wa.me/57${cleanPhone}?text=${encodeURIComponent(message)}`
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank')
  }

  const clearOrderHistory = () => {
    // Clear orders locally in dashboard
    setOrders([])
    // Clear orders globally in AppDataContext (this is the key fix)
    setGlobalOrders([])
    // Clear ONLY orders from localStorage (DO NOT clear all localStorage to preserve auth)
    localStorage.removeItem('cieloytierra_orders')
    setShowClearHistoryModal(false)
    
    // Show success toast instead of browser alert
    setToastMessage('Historial de pedidos eliminado COMPLETAMENTE')
    setTimeout(() => setToastMessage(''), 3000) // Hide after 3 seconds
  }



  const getFilteredOrders = () => {
    switch (orderFilter) {
      case 'pending':
        return orders.filter(order => order.status === 'pending')
      case 'cancelled':
        return orders.filter(order => order.status === 'cancelled')
      default:
        return orders
    }
  }

  const updateCelebrationStatus = async (celebrationId: number, newStatus: Celebration['status']) => {
    try {
      const result = await updateCelebrationAPI(celebrationId, { status: newStatus })
      
      if (result) {
        // Update local state
        const updatedCelebrations = celebrations.map(celebration => 
          celebration.id === celebrationId ? result : celebration
        )
        setCelebrations(updatedCelebrations)
        setToastMessage('✅ Estado actualizado correctamente')
        setTimeout(() => setToastMessage(''), 3000)
      } else {
        throw new Error('Failed to update celebration')
      }
    } catch (error) {
      console.error('Error updating celebration:', error)
      alert('Error al actualizar el estado. Por favor intenta de nuevo.')
    }
  }

  // Delete celebration function
  const deleteCelebration = (celebrationId: number) => {
    setCelebrationToDelete(celebrationId)
    setShowDeleteCelebrationModal(true)
  }

  // Confirm celebration deletion
  const confirmDeleteCelebration = async () => {
    if (celebrationToDelete) {
      try {
        const success = await deleteCelebrationAPI(celebrationToDelete)
        
        if (success) {
          // Update local state
          const updatedCelebrations = celebrations.filter(celebration => celebration.id !== celebrationToDelete)
          setCelebrations(updatedCelebrations)
          setToastMessage('🗑️ Reserva eliminada correctamente')
          setTimeout(() => setToastMessage(''), 3000)
        } else {
          throw new Error('Failed to delete celebration')
        }
      } catch (error) {
        console.error('Error deleting celebration:', error)
        alert('Error al eliminar la reserva. Por favor intenta de nuevo.')
      }
    }
    
    // Reset modal state
    setShowDeleteCelebrationModal(false)
    setCelebrationToDelete(null)
  }

  // Handle invoice printing
  const handlePrintInvoice = async (order: Order) => {
    try {
      // Convert dashboard Order to InvoiceOrder format
      const invoiceOrder: InvoiceOrder = {
        id: order.id.toString(),
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerAddress: order.customerAddress,
        items: order.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total: order.total,
        timestamp: order.timestamp,
        status: order.status === 'completed' ? 'completed' : order.status === 'pending' ? 'preparing' : 'ready'
      }

      await generateInvoice(invoiceOrder)
      
      // Show success toast
      setToastMessage('Factura generada correctamente')
      setTimeout(() => setToastMessage(''), 3000)
    } catch (error) {
      console.error('Error printing invoice:', error)
      setToastMessage('Error al generar la factura')
      setTimeout(() => setToastMessage(''), 3000)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/10'
      case 'accepted': case 'confirmed': return 'text-primary-red bg-primary-red/10'
      case 'completed': return 'text-green-400 bg-green-400/10'
      case 'cancelled': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente'
      case 'accepted': return 'Aceptado'
      case 'confirmed': return 'Confirmado'
      case 'completed': return 'Completado'
      case 'cancelled': return 'Cancelado'
      default: return status
    }
  }

  // Calculate today's sales
  const getTodaysSales = () => {
    const today = new Date().toDateString()
    const todaysOrders = orders.filter(order => {
      const orderDate = new Date(order.timestamp).toDateString()
      return orderDate === today && order.status === 'completed'
    })
    return todaysOrders.reduce((total, order) => total + order.total, 0)
  }

  const getTodaysOrdersCount = () => {
    const today = new Date().toDateString()
    return orders.filter(order => {
      const orderDate = new Date(order.timestamp).toDateString()
      return orderDate === today && order.status === 'completed'
    }).length
  }

  const renderOverview = () => (
    <div className="space-y-6 md:space-y-8 lg:space-y-10">
      {/* Statistics Cards Grid - 4 cards principales con reorganización inteligente */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
        {/* Total Orders Card */}
        <div className="bg-gradient-to-b from-layer-high to-layer-mid rounded-2xl p-3 relative hover:from-layer-elevated hover:to-layer-high transition-all duration-300 shadow-layer-md hover:shadow-layer-lg md:p-5 lg:p-6">
          <div className="text-center">
            <div 
              className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 bg-primary-red/20 rounded-lg flex items-center justify-center"
              style={{ boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.4), inset 0 -1px 0 rgba(255, 255, 255, 0.05)' }}
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 text-primary-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1">{orders.length}</h3>
            <p className="text-gray-400 text-xs md:text-sm font-medium">Total de Pedidos</p>
            <p className="text-primary-red text-[10px] md:text-xs mt-1">{orders.filter(o => o.status === 'pending').length} Pendientes</p>
          </div>
        </div>

        {/* Total Products Card */}
        <div className="bg-gradient-to-b from-layer-high to-layer-mid rounded-2xl p-3 relative hover:from-layer-elevated hover:to-layer-high transition-all duration-300 shadow-layer-md hover:shadow-layer-lg md:p-5 lg:p-6">
          <div className="text-center">
            <div 
              className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 bg-primary-yellow/20 rounded-lg flex items-center justify-center"
              style={{ boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.4), inset 0 -1px 0 rgba(255, 255, 255, 0.05)' }}
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 text-primary-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1">{products.length}</h3>
            <p className="text-gray-400 text-xs md:text-sm font-medium">Productos Disponibles</p>
            <p className="text-primary-yellow text-[10px] md:text-xs mt-1">{products.filter(p => p.featured).length} Destacados</p>
          </div>
        </div>

        {/* Total Categories Card */}
        <div className="bg-gradient-to-b from-layer-high to-layer-mid rounded-2xl p-3 relative hover:from-layer-elevated hover:to-layer-high transition-all duration-300 shadow-layer-md hover:shadow-layer-lg md:p-5 lg:p-6">
          <div className="text-center">
            <div 
              className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 bg-primary-red/20 rounded-lg flex items-center justify-center"
              style={{ boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.4), inset 0 -1px 0 rgba(255, 255, 255, 0.05)' }}
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 text-primary-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1">{categories.length}</h3>
            <p className="text-gray-400 text-xs md:text-sm font-medium">Categorías</p>
            <p className="text-primary-red text-[10px] md:text-xs mt-1">Organizadas</p>
          </div>
        </div>

        {/* Total Celebrations Card */}
        <div className="bg-gradient-to-b from-layer-high to-layer-mid rounded-2xl p-3 relative hover:from-layer-elevated hover:to-layer-high transition-all duration-300 shadow-layer-md hover:shadow-layer-lg md:p-5 lg:p-6">
          <div className="text-center">
            <div 
              className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 bg-primary-yellow/20 rounded-lg flex items-center justify-center"
              style={{ boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.4), inset 0 -1px 0 rgba(255, 255, 255, 0.05)' }}
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 text-primary-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1">{celebrations.length}</h3>
            <p className="text-gray-400 text-xs md:text-sm font-medium">Celebraciones</p>
            <p className="text-primary-yellow text-[10px] md:text-xs mt-1">{celebrations.filter(c => c.status === 'pending').length} Pendientes</p>
          </div>
        </div>
      </div>

      {/* Today's Sales Card - Card alargada con el mismo estilo que las demás */}
      <div className="bg-gradient-to-b from-layer-elevated to-layer-high rounded-2xl p-3 relative hover:from-layer-elevated hover:to-layer-elevated transition-all duration-300 shadow-layer-lg col-span-2 lg:col-span-4 md:p-6 lg:p-8">
        <div className="text-center">
          <div 
            className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-3 md:mb-4 bg-primary-yellow/20 rounded-lg flex items-center justify-center"
            style={{ boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.4), inset 0 -1px 0 rgba(255, 255, 255, 0.05)' }}
          >
            <svg className="w-6 h-6 md:w-7 md:h-7 text-primary-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 md:mb-2">
            ${getTodaysSales().toLocaleString('es-ES', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-gray-400 text-sm md:text-base font-medium">
            💰 Ventas del día de hoy - {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long',
              day: 'numeric',
              month: 'long'
            })}
          </p>
        </div>
      </div>
    </div>
  )

  const renderOrders = () => {
    const filteredOrders = getFilteredOrders()
    
    return (
      <div className="space-y-4 md:space-y-5 lg:space-y-6">
        {/* Header compacto móvil-first */}
        <div className="flex flex-col space-y-3 md:space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl md:text-2xl font-bold text-white">Pedidos</h2>
            <button
              onClick={() => setShowClearHistoryModal(true)}
              className="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
              title="Limpiar historial"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
          
          {/* Filtros compactos */}
          <div className="flex space-x-2 overflow-x-auto pb-1">
            <button 
              onClick={() => setOrderFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                orderFilter === 'all' 
                  ? 'bg-gradient-to-b from-primary-red to-primary-red/90 text-white' 
                  : 'bg-layer-high text-gray-300 hover:bg-layer-elevated shadow-layer-sm'
              }`}
              style={orderFilter === 'all' ? { boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 -1px 0 rgba(255, 255, 255, 0.06), 0 4px 12px rgba(0, 0, 0, 0.5)' } : undefined}
            >
              Todos ({orders.length})
            </button>
            <button 
              onClick={() => setOrderFilter('pending')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                orderFilter === 'pending' 
                  ? 'bg-gradient-to-b from-primary-yellow to-primary-yellow/90 text-gray-900' 
                  : 'bg-primary-yellow/20 text-primary-yellow hover:bg-primary-yellow/30 shadow-layer-sm'
              }`}
              style={orderFilter === 'pending' ? { boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 -1px 0 rgba(255, 255, 255, 0.08), 0 4px 12px rgba(0, 0, 0, 0.5)' } : undefined}
            >
              Pendientes ({orders.filter(o => o.status === 'pending').length})
            </button>
            <button 
              onClick={() => setOrderFilter('cancelled')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                orderFilter === 'cancelled' 
                  ? 'bg-gradient-to-b from-gray-600 to-gray-700 text-white' 
                  : 'bg-gray-600/20 text-gray-400 hover:bg-gray-600/30 shadow-layer-sm'
              }`}
              style={orderFilter === 'cancelled' ? { boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 -1px 0 rgba(255, 255, 255, 0.05), 0 4px 12px rgba(0, 0, 0, 0.5)' } : undefined}
            >
              Cancelados ({orders.filter(o => o.status === 'cancelled').length})
            </button>
          </div>
        </div>

        {/* Lista de pedidos rediseñada para móvil */}
        <div className="space-y-3">
          {filteredOrders.length === 0 ? (
            <div className="bg-gradient-to-b from-layer-mid to-layer-base rounded-2xl p-6 text-center shadow-layer-sm">
              <div 
                className="w-12 h-12 mx-auto mb-3 bg-gray-600/20 rounded-lg flex items-center justify-center"
                style={{ boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)' }}
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm">
                {orderFilter === 'pending' && 'No hay pedidos pendientes'}
                {orderFilter === 'cancelled' && 'No hay pedidos cancelados'}
                {orderFilter === 'all' && 'No hay pedidos registrados'}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-gradient-to-b from-layer-high to-layer-mid rounded-2xl p-3 relative hover:from-layer-elevated hover:to-layer-high transition-all duration-300 shadow-layer-md hover:shadow-layer-lg md:p-4">
                {/* Header del pedido - compacto */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white">Pedido #{order.id}</h3>
                    <p className="text-gray-400 text-xs">{new Date(order.timestamp).toLocaleString('es-CO', { 
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                    })}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>

                {/* Info del cliente - más compacta */}
                <div className="mb-3">
                  <div className="flex items-center mb-1">
                    <div className="w-2 h-2 bg-primary-red rounded-full mr-2"></div>
                    <span className="text-white text-sm font-medium">{order.customerName}</span>
                  </div>
                  <p className="text-gray-400 text-xs ml-4">{order.customerPhone}</p>
                  <p className="text-gray-400 text-xs ml-4 truncate">{order.customerAddress}</p>
                </div>

                {/* Artículos - resumen compacto */}
                <div className="mb-3">
                  <div className="bg-gray-700/30 rounded-lg p-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-300 text-sm">Artículos ({order.items.length})</span>
                      <span className="text-primary-red font-bold text-sm">${order.total.toLocaleString()}</span>
                    </div>
                    <div className="space-y-1">
                      {order.items.slice(0, 2).map((item, index) => (
                        <div key={index} className="flex justify-between text-xs">
                          <span className="text-gray-400 truncate">{item.name} x{item.quantity}</span>
                          <span className="text-primary-yellow">${(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-gray-500 text-xs">+{order.items.length - 2} más...</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notas - si existen */}
                {order.notes && (
                  <div className="mb-3">
                    <div className="bg-primary-yellow/10 border border-primary-yellow/20 rounded-lg p-2">
                      <p className="text-primary-yellow text-xs font-medium mb-1">Notas:</p>
                      <p className="text-gray-300 text-xs">{order.notes}</p>
                    </div>
                  </div>
                )}

                {/* Botones de acción - compactos y organizados */}
                <div className="flex flex-wrap gap-2">
                  {/* Botón principal según estado */}
                  {order.status === 'pending' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'accepted')}
                      className="flex-1 bg-gradient-to-b from-primary-red to-primary-red/90 text-white py-2 px-3 rounded-lg hover:from-primary-red hover:to-primary-red/80 transition-all duration-200 text-sm font-medium"
                      style={{ boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 -1px 0 rgba(255, 255, 255, 0.06), 0 4px 12px rgba(0, 0, 0, 0.5)' }}
                    >
                      ✓ Aceptar
                    </button>
                  )}
                  {order.status === 'accepted' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className="flex-1 bg-gradient-to-b from-primary-yellow to-primary-yellow/90 text-gray-900 py-2 px-3 rounded-lg hover:from-primary-yellow hover:to-primary-yellow/80 transition-all duration-200 text-sm font-medium"
                      style={{ boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 -1px 0 rgba(255, 255, 255, 0.08), 0 4px 12px rgba(0, 0, 0, 0.5)' }}
                    >
                      ✓ Completar
                    </button>
                  )}
                  {order.status === 'completed' && (
                    <button
                      onClick={() => handlePrintInvoice(order)}
                      className="bg-primary-yellow/20 text-primary-yellow py-2 px-3 rounded-lg hover:bg-primary-yellow/30 transition-colors text-sm font-medium flex items-center justify-center"
                      title="Imprimir factura"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                    </button>
                  )}
                  
                  {/* Botón de contacto */}
                  <button 
                    onClick={() => contactCustomer(order)}
                    className="bg-primary-yellow/20 text-primary-yellow py-2 px-3 rounded-lg hover:bg-primary-yellow/30 transition-colors text-sm font-medium flex items-center space-x-1"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.520.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    <span>WhatsApp</span>
                  </button>
                  
                  {/* Botón cancelar - solo si no está cancelado */}
                  {order.status !== 'cancelled' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      className="bg-gray-600/20 text-gray-400 py-2 px-3 rounded-lg hover:bg-gray-600/30 transition-colors text-sm font-medium"
                    >
                      ✕ Cancelar
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal de confirmación - Mobile-first */}
        {showClearHistoryModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn">
            <div className="h-full overflow-y-auto">
              <div className="min-h-full flex items-center justify-center p-2 sm:p-4">
                <div className="w-full max-w-xs sm:max-w-sm bg-gray-800 rounded-lg sm:rounded-xl shadow-2xl border border-gray-700/50 overflow-hidden animate-slideUpBounce max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-2rem)] my-2 sm:my-4">
                  <div className="px-3 py-3 sm:px-4 sm:py-4">
                    <div className="text-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 bg-primary-red/20 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </div>
                      
                      <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                        ¿Limpiar historial?
                      </h3>
                      
                      <p className="text-gray-300 text-xs sm:text-sm mb-4 sm:mb-6 px-2">
                        Se eliminarán <strong>todos los pedidos</strong> permanentemente.
                      </p>
                      
                      <div className="flex space-x-2 sm:space-x-3">
                        <button
                          onClick={() => setShowClearHistoryModal(false)}
                          className="flex-1 bg-gray-700 text-white py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-600 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={clearOrderHistory}
                          className="flex-1 bg-primary-red text-white py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-primary-red/90 transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }



  const renderProducts = () => (
    <div className="space-y-4 md:space-y-5 lg:space-y-6">
      {/* Header compacto móvil-first */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-bold text-white">Productos</h2>
        <button
          onClick={() => setShowProductModal(true)}
          className="bg-gradient-to-b from-primary-red to-primary-red/90 text-white px-3 py-2 rounded-lg hover:from-primary-red hover:to-primary-red/80 transition-all duration-200 text-sm font-bold"
          style={{ boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 -1px 0 rgba(255, 255, 255, 0.06), 0 4px 12px rgba(0, 0, 0, 0.5)' }}
        >
          + Agregar
        </button>
      </div>

      {/* Grid con reorganización inteligente - 1 → 2 → 3 columnas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-5">
        {products.length === 0 ? (
          <div className="col-span-full bg-gradient-to-b from-layer-mid to-layer-base rounded-2xl p-6 text-center shadow-layer-sm">
            <div 
              className="w-12 h-12 mx-auto mb-3 bg-primary-yellow/20 rounded-lg flex items-center justify-center"
              style={{ boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)' }}
            >
              <svg className="w-6 h-6 text-primary-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm">No hay productos registrados</p>
          </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="bg-gradient-to-b from-layer-high to-layer-mid rounded-2xl p-3 relative hover:from-layer-elevated hover:to-layer-high transition-all duration-300 shadow-layer-md hover:shadow-layer-lg overflow-hidden">
              {/* Imagen más compacta */}
              <div className="aspect-[4/3] relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {/* Badge de destacado */}
                {product.featured && (
                  <div className="absolute top-2 right-2 bg-primary-yellow text-gray-900 px-2 py-1 rounded-lg text-xs font-bold">
                    ⭐ Destacado
                  </div>
                )}
              </div>
              
              {/* Contenido compacto */}
              <div className="p-3">
                {/* Header del producto */}
                <div className="mb-2">
                  <h3 className="text-base font-bold text-white mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">{product.description}</p>
                </div>
                
                {/* Precio y categoría */}
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary-red rounded-full mr-2"></div>
                    <span className="text-lg font-bold text-primary-red">${product.price.toLocaleString()}</span>
                  </div>
                  <span className="bg-primary-yellow/20 text-primary-yellow px-2 py-1 rounded-lg text-xs font-medium">
                    {product.category}
                  </span>
                </div>
                
                {/* Botones compactos */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingProduct(product)
                      setSelectedImage(product.image)
                      setShowProductModal(true)
                    }}
                    className="flex-1 bg-primary-yellow/20 text-primary-yellow py-2 px-3 rounded-lg hover:bg-primary-yellow/30 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="bg-gray-600/20 text-gray-400 py-2 px-3 rounded-lg hover:bg-red-600/20 hover:text-red-400 transition-colors text-sm font-medium flex items-center justify-center"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )

  const renderCategories = () => (
    <div className="space-y-4 md:space-y-5 lg:space-y-6">
      {/* Header compacto móvil-first */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-bold text-white">Categorías</h2>
        <button
          onClick={() => setShowCategoryModal(true)}
          className="bg-gradient-to-b from-primary-red to-primary-red/90 text-white px-3 py-2 rounded-lg hover:from-primary-red hover:to-primary-red/80 transition-all duration-200 text-sm font-bold"
          style={{ boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 -1px 0 rgba(255, 255, 255, 0.06), 0 4px 12px rgba(0, 0, 0, 0.5)' }}
        >
          + Agregar
        </button>
      </div>

      {/* Grid con reorganización inteligente - 1 → 2 → 3 columnas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-5">
        {categories.length === 0 ? (
          <div className="col-span-full bg-gradient-to-b from-layer-mid to-layer-base rounded-2xl p-6 text-center shadow-layer-sm">
            <div 
              className="w-12 h-12 mx-auto mb-3 bg-primary-yellow/20 rounded-lg flex items-center justify-center"
              style={{ boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)' }}
            >
              <svg className="w-6 h-6 text-primary-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm">No hay categorías registradas</p>
          </div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="bg-gradient-to-b from-layer-high to-layer-mid rounded-2xl p-3 relative hover:from-layer-elevated hover:to-layer-high transition-all duration-300 shadow-layer-md hover:shadow-layer-lg">
              {/* Header de la categoría */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {/* Indicador de color */}
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full border-2 border-white/20" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                  </div>
                  <h3 className="text-base font-bold text-white line-clamp-1">{category.name}</h3>
                </div>
                
                {/* Botón eliminar compacto */}
                <button
                  onClick={() => deleteCategory(category.id)}
                  className="p-1.5 rounded-lg bg-gray-600/20 text-gray-400 hover:bg-red-600/20 hover:text-red-400 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              
              {/* Descripción compacta */}
              <div className="pl-5">
                <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">{category.description}</p>
              </div>
              
              {/* Información adicional */}
              <div className="flex items-center justify-between mt-3 pl-5">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-primary-yellow rounded-full"></div>
                  <span className="text-xs text-gray-500">
                    {products.filter(p => p.category === category.name).length} productos
                  </span>
                </div>
                
                {/* Badge con color de categoría */}
                <div className="flex items-center space-x-1">
                  <div 
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-sm"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.name.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )

  // Show loading screen during SSR to prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  const renderCelebrations = () => (
    <div className="space-y-4 md:space-y-5 lg:space-y-6">
      {/* Header compacto móvil-first */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-bold text-white">Celebraciones</h2>
        <div className="text-xs text-gray-400">
          {celebrations.length} reserva{celebrations.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Lista de celebraciones optimizada para móvil */}
      <div className="space-y-3">
        {celebrations.length === 0 ? (
          <div className="bg-gradient-to-b from-layer-mid to-layer-base rounded-2xl p-6 text-center shadow-layer-sm">
            <div 
              className="w-12 h-12 mx-auto mb-3 bg-primary-yellow/20 rounded-lg flex items-center justify-center"
              style={{ boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)' }}
            >
              <svg className="w-6 h-6 text-primary-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m6-10v10m-6-4h.01M18 7h.01" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm">No hay celebraciones programadas</p>
          </div>
        ) : (
          celebrations.map((celebration) => (
            <div key={celebration.id} className="bg-gradient-to-b from-layer-high to-layer-mid rounded-2xl p-3 relative hover:from-layer-elevated hover:to-layer-high transition-all duration-300 shadow-layer-md hover:shadow-layer-lg">
              {/* Header de la celebración */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-2 h-2 bg-primary-red rounded-full"></div>
                    <h3 className="text-base font-bold text-white line-clamp-1">{celebration.eventType}</h3>
                  </div>
                  <p className="text-xs text-gray-400 pl-4">
                    📅 {new Date(celebration.date).toLocaleDateString('es-CO', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                
                {/* Status badge compacto */}
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(celebration.status)}`}>
                  {getStatusText(celebration.status)}
                </span>
              </div>

              {/* Información del cliente compacta */}
              <div className="bg-gray-700/30 rounded-lg p-2 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-1 mb-1">
                      <svg className="w-3 h-3 text-primary-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-xs text-white font-medium">{celebration.customerName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-xs text-gray-400">{celebration.customerPhone}</span>
                    </div>
                  </div>
                  
                  {/* Invitados */}
                  <div className="flex items-center space-x-1 bg-primary-yellow/20 px-2 py-1 rounded-lg">
                    <svg className="w-3 h-3 text-primary-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-xs font-bold text-primary-yellow">{celebration.guests}</span>
                  </div>
                </div>
              </div>

              {/* Notas si existen */}
              {celebration.notes && (
                <div className="bg-primary-yellow/10 border-l-2 border-primary-yellow pl-3 py-2 mb-3">
                  <p className="text-xs text-gray-300 line-clamp-2">{celebration.notes}</p>
                </div>
              )}

              {/* Botones de acción compactos */}
              <div className="flex gap-2">
                {celebration.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateCelebrationStatus(celebration.id, 'confirmed')}
                      className="flex-1 bg-primary-red/20 text-primary-red py-2 px-3 rounded-lg hover:bg-primary-red/30 transition-colors text-xs font-medium flex items-center justify-center space-x-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Confirmar</span>
                    </button>
                    <button
                      onClick={() => updateCelebrationStatus(celebration.id, 'cancelled')}
                      className="bg-gray-600/20 text-gray-400 py-2 px-3 rounded-lg hover:bg-red-600/20 hover:text-red-400 transition-colors text-xs font-medium flex items-center justify-center"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </>
                )}
                {celebration.status === 'confirmed' && (
                  <>
                    <button
                      onClick={() => updateCelebrationStatus(celebration.id, 'completed')}
                      className="flex-1 bg-primary-yellow/20 text-primary-yellow py-2 px-3 rounded-lg hover:bg-primary-yellow/30 transition-colors text-xs font-medium flex items-center justify-center space-x-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Completar</span>
                    </button>
                    <a
                      href={`https://wa.me/57${celebration.customerPhone.replace(/\D/g, '')}?text=Hola ${celebration.customerName}, confirmamos tu evento ${celebration.eventType} para el ${new Date(celebration.date).toLocaleDateString('es-CO')}. ¡Te esperamos! - Cielo y Tierra`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600/20 text-green-400 py-2 px-3 rounded-lg hover:bg-green-600/30 transition-colors text-xs font-medium flex items-center justify-center"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.588z"/>
                      </svg>
                    </a>
                  </>
                )}
                {celebration.status === 'completed' && (
                  <div className="flex-1 bg-green-600/20 text-green-400 py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center space-x-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Completado</span>
                  </div>
                )}
                
                {/* Delete button - Always visible for all celebrations */}
                <button
                  onClick={() => deleteCelebration(celebration.id)}
                  className="bg-red-600/20 text-red-400 py-2 px-3 rounded-lg hover:bg-red-600/30 hover:text-red-300 transition-colors text-xs font-medium flex items-center justify-center"
                  title="Eliminar reserva"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-layer-base text-white relative overflow-hidden">
      {/* Decoraciones de fondo - Organic Blobs */}
      <OrganicBlob 
        color="cream" 
        size="lg" 
        position={{ top: '8%', right: '-12%' }} 
        opacity={0.08}
      />
      <OrganicBlob 
        color="yellow" 
        size="md" 
        position={{ top: '50%', left: '-10%' }} 
        opacity={0.06}
      />
      
      {/* Círculos decorativos */}
      <CircleBorder 
        color="red" 
        size={170} 
        position={{ top: '25%', right: '6%' }} 
        opacity={0.12}
      />
      <CircleBorder 
        color="yellow" 
        size={110} 
        position={{ bottom: '18%', left: '8%' }} 
        opacity={0.1}
      />
      
      {/* Diamantes decorativos */}
      <DiamondShape 
        size={45} 
        color="yellow" 
        position={{ top: '15%', left: '12%' }} 
        rotation={45}
        opacity={0.15}
      />
      <DiamondShape 
        size={35} 
        color="red" 
        position={{ top: '65%', right: '10%' }} 
        rotation={30}
        opacity={0.12}
      />
      
      {/* Header con logo - Igual que /home */}
      <div className="pt-4 pb-2 relative z-10">
        <div className="text-center relative">
          <DecorativeDots 
            color="yellow" 
            count={3} 
            position={{ top: '20px', left: 'calc(50% - 30px)' }} 
            spacing={6}
          />
          <div className="relative w-28 h-28 mx-auto">
            <Image 
              src="/Logo.png" 
              alt="Cielo y Tierra Logo" 
              fill 
              className="object-contain"
              priority 
            />
          </div>
        </div>
      </div>

      {/* Contenedor principal responsive - Sistema de cajas con relaciones claras */}
      <div className="px-4 md:px-6 lg:px-8 pb-24 md:pb-28 max-w-sm mx-auto md:max-w-3xl lg:max-w-5xl xl:max-w-7xl relative z-10">

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'categories' && renderCategories()}
        {activeTab === 'celebrations' && renderCelebrations()}

        <BottomNavigation 
          onAdminTabChange={setActiveTab}
          adminActiveTab={activeTab}
        />
      </div>

      {/* Product Modal - Mobile Optimized */}
      <Modal 
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false)
          setEditingProduct(null)
          setSelectedImage(null)
        }}
        title={editingProduct ? 'Editar Producto' : 'Agregar Producto'}
        size="md"
      >
        <form onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          const productData = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            price: Number(formData.get('price')),
            image: selectedImage || '/placeholder.jpg',
            category: formData.get('category') as string,
            featured: formData.get('featured') === 'on',
            rating: 0
          }
          handleSaveProduct(productData)
        }}>
          <div className="space-y-3 sm:space-y-4">
            {/* Product Name */}
            <div>
              <label className="block text-white text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">Nombre del Producto</label>
              <input
                name="name"
                type="text"
                required
                defaultValue={editingProduct?.name || ''}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-yellow transition-colors"
                placeholder="Ej: Paella Marinera"
              />
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-white text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">Descripción</label>
              <textarea
                name="description"
                required
                defaultValue={editingProduct?.description || ''}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-yellow resize-none transition-colors"
                rows={3}
                placeholder="Describe el producto, ingredientes principales..."
              />
            </div>
            
            {/* Price and Category Row - Mobile optimized */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <div>
                <label className="block text-white text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">Precio</label>
                <input
                  name="price"
                  type="number"
                  required
                  min="0"
                  step="1000"
                  defaultValue={editingProduct?.price || ''}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-yellow transition-colors"
                  placeholder="25000"
                />
              </div>
              <div>
                <label className="block text-white text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">Categoría</label>
                <select
                  name="category"
                  required
                  defaultValue={editingProduct?.category || ''}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-yellow transition-colors"
                >
                  <option value="">Seleccionar...</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>{category.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Image Upload */}
            <div>
              <label className="block text-white text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">Imagen del Producto</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-yellow transition-colors file:mr-2 sm:file:mr-3 file:py-1.5 sm:file:py-2 file:px-2 sm:file:px-3 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-primary-yellow file:text-gray-900 hover:file:bg-primary-yellow/90"
              />
              {selectedImage && (
                <div className="mt-2 sm:mt-3 flex justify-center">
                  <img src={selectedImage} alt="Vista previa" className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border-2 border-gray-600" />
                </div>
              )}
            </div>
            
            {/* Featured Checkbox - Mobile optimized */}
            <div className="bg-gray-700/30 rounded-lg p-2.5 sm:p-3">
              <div className="flex items-center space-x-2">
                <input
                  name="featured"
                  type="checkbox"
                  id="featured"
                  defaultChecked={editingProduct?.featured || false}
                  className="w-4 h-4 text-primary-yellow bg-gray-700 border-gray-600 rounded focus:ring-primary-yellow focus:ring-2"
                />
                <label htmlFor="featured" className="text-white text-xs sm:text-sm font-medium">
                  ⭐ Marcar como producto destacado
                </label>
              </div>
            </div>
          </div>
          
          {/* Action Button - Single yellow button */}
          <div className="pt-3 sm:pt-4 mt-4 sm:mt-6">
            <button
              type="submit"
              className="w-full bg-primary-yellow text-gray-900 py-2.5 sm:py-3 rounded-lg hover:bg-primary-yellow/90 transition-colors font-bold flex items-center justify-center space-x-2 text-sm"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{editingProduct ? 'Actualizar' : 'Agregar'}</span>
            </button>
          </div>
        </form>
      </Modal>



      {/* Category Modal using new Modal component */}
      <Modal 
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        title="Agregar Categoría"
        size="sm"
      >
        <form onSubmit={async (e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          const categoryData = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            color: formData.get('color') as string,
          }
          
          try {
            await addCategory(categoryData)
            setShowCategoryModal(false)
            setToastMessage('✅ Categoría agregada correctamente')
            setTimeout(() => setToastMessage(''), 3000)
          } catch (error) {
            console.error('Error adding category:', error)
            alert('Error al agregar la categoría. Por favor intenta de nuevo.')
          }
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-white text-sm font-semibold mb-2">Nombre de la Categoría</label>
              <input
                name="name"
                type="text"
                required
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-yellow transition-colors"
                placeholder="Ej: Platos Principales, Postres..."
              />
            </div>
            
            <div>
              <label className="block text-white text-sm font-semibold mb-2">Descripción (Opcional)</label>
              <textarea
                name="description"
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-yellow h-20 resize-none transition-colors"
                placeholder="Describe brevemente la categoría..."
              />
            </div>
            
            <div>
              <label className="block text-white text-sm font-semibold mb-2">Color Identificativo</label>
              <div className="flex items-center space-x-3">
                <input
                  name="color"
                  type="color"
                  defaultValue="#e61d25"
                  className="w-12 h-12 bg-gray-700 rounded-lg border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-yellow transition-colors cursor-pointer"
                />
                <div className="flex-1 text-sm text-gray-300">
                  Selecciona un color para identificar esta categoría en el menú
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-primary-yellow text-gray-900 py-2.5 sm:py-3 rounded-lg hover:bg-primary-yellow/90 transition-colors font-bold flex items-center justify-center space-x-2 text-sm"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Agregar</span>
            </button>
          </div>
        </form>
      </Modal>
      
      {/* Success Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 right-6 z-[9999] max-w-md mx-auto">
          <div className="bg-gradient-to-r from-primary-red to-primary-yellow rounded-lg shadow-lg p-4 border border-gray-600">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-yellow to-primary-red rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white text-sm font-medium flex-1 leading-tight">{toastMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Celebration Modal - Mobile-first */}
      {showDeleteCelebrationModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn">
          <div className="h-full overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-2 sm:p-4">
              <div className="w-full max-w-xs sm:max-w-sm bg-gray-800 rounded-lg sm:rounded-xl shadow-2xl border border-gray-700/50 overflow-hidden animate-slideUpBounce max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-2rem)] my-2 sm:my-4">
                <div className="px-3 py-3 sm:px-4 sm:py-4">
                  <div className="text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 bg-primary-red/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </div>
                    
                    <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                      ¿Eliminar reserva?
                    </h3>
                    
                    <p className="text-gray-300 text-xs sm:text-sm mb-4 sm:mb-6 px-2">
                      Se eliminará <strong>esta reserva</strong> permanentemente.
                    </p>
                    
                    <div className="flex space-x-2 sm:space-x-3">
                      <button
                        onClick={() => setShowDeleteCelebrationModal(false)}
                        className="flex-1 bg-gray-700 text-white py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-600 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={confirmDeleteCelebration}
                        className="flex-1 bg-primary-red text-white py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-primary-red/90 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Product Modal - Mobile-first */}
      {showDeleteProductModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn">
          <div className="h-full overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-2 sm:p-4">
              <div className="w-full max-w-xs sm:max-w-sm bg-gray-800 rounded-lg sm:rounded-xl shadow-2xl border border-gray-700/50 overflow-hidden animate-slideUpBounce max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-2rem)] my-2 sm:my-4">
                <div className="px-3 py-3 sm:px-4 sm:py-4">
                  <div className="text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 bg-primary-red/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </div>
                    
                    <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                      ¿Eliminar producto?
                    </h3>
                    
                    <p className="text-gray-300 text-xs sm:text-sm mb-4 sm:mb-6 px-2">
                      Se eliminará <strong>este producto</strong> permanentemente del menú.
                    </p>
                    
                    <div className="flex space-x-2 sm:space-x-3">
                      <button
                        onClick={() => setShowDeleteProductModal(false)}
                        className="flex-1 bg-gray-700 text-white py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-600 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={confirmDeleteProduct}
                        className="flex-1 bg-primary-red text-white py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-primary-red/90 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Session Closed Modal */}
      <Modal
        isOpen={showSessionClosedModal}
        onClose={() => {
          setShowSessionClosedModal(false)
          window.location.href = '/admin'
        }}
        title="Sesión Cerrada"
        size="sm"
        showCloseButton={false}
      >
        <div className="text-center space-y-4 pb-2">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary-red/20 to-primary-yellow/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-primary-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-2">Sesión Cerrada</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Tu sesión ha sido cerrada porque alguien más inició sesión desde otro dispositivo.
            </p>
          </div>
          <button
            onClick={() => {
              setShowSessionClosedModal(false)
              window.location.href = '/admin'
            }}
            className="w-full bg-gradient-to-r from-primary-red to-primary-yellow text-white py-3 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity shadow-layer-lg"
            style={{ boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 -1px 0 rgba(255, 255, 255, 0.06), 0 8px 24px rgba(0, 0, 0, 0.6)' }}
          >
            Ir al Login
          </button>
        </div>
      </Modal>
    </div>
  )
}