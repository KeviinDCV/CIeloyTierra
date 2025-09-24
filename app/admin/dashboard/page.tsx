'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useAppData, type Category } from '../../../lib/AppDataContext'
import BottomNavigation from '../../../components/BottomNavigation'

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
  status: 'pending' | 'confirmed' | 'completed'
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
  const [newProductId, setNewProductId] = useState(3)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState('')

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      window.location.href = '/admin'
      return
    }
  }, [])

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

  // Handle product save
  const handleSaveProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const newProduct: Product = {
        ...productData,
        id: editingProduct?.id || newProductId,
        rating: 0 // Remove rating from admin, set to 0 by default
      }
      
      let updatedProducts
      if (editingProduct) {
        updatedProducts = products.map(p => p.id === editingProduct.id ? newProduct : p)
      } else {
        updatedProducts = [...products, newProduct]
        setNewProductId(newProductId + 1)
      }
      
      setProducts(updatedProducts)
      localStorage.setItem('cieloytierra_products', JSON.stringify(updatedProducts))
      
      setShowProductModal(false)
      setEditingProduct(null)
      setSelectedImage(null)
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error al guardar el producto. Intenta con una imagen más pequeña.')
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

  // Delete product
  const deleteProduct = (productId: number) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      const updatedProducts = products.filter(p => p.id !== productId)
      setProducts(updatedProducts)
      localStorage.setItem('cieloytierra_products', JSON.stringify(updatedProducts))
    }
  }

  // Function to load data from localStorage (simplified - no merge logic)
  const loadDataFromStorage = () => {
    try {
      const savedOrders = localStorage.getItem('cieloytierra_orders')
      const savedProducts = localStorage.getItem('cieloytierra_products')
      const savedCelebrations = localStorage.getItem('cieloytierra_celebrations')

      if (savedOrders) {
        const newOrders = JSON.parse(savedOrders)
        // Simple replacement - no complex merge logic that causes issues
        setOrders(newOrders)
      }
      
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts))
      }
      if (savedCelebrations) {
        setCelebrations(JSON.parse(savedCelebrations))
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error)
    }
  }

  // Load data from localStorage on component mount
  useEffect(() => {
    loadDataFromStorage()
  }, [])

  // Auto-refresh data every 10 seconds for real-time monitoring (reduced frequency to prevent modal conflicts)
  useEffect(() => {
    const interval = setInterval(() => {
      // Only refresh if no modals are open to prevent conflicts
      if (!showClearHistoryModal && !showProductModal && !showCategoryModal) {
        loadDataFromStorage()
      }
    }, 10000) // Poll every 10 seconds (reduced from 3 seconds)

    return () => clearInterval(interval)
  }, [showClearHistoryModal, showProductModal, showCategoryModal])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    window.location.href = '/admin'
  }

  const updateOrderStatus = (orderId: number, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    )
    setOrders(updatedOrders)
    localStorage.setItem('cieloytierra_orders', JSON.stringify(updatedOrders))
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

  const updateCelebrationStatus = (celebrationId: number, newStatus: Celebration['status']) => {
    const updatedCelebrations = celebrations.map(celebration => 
      celebration.id === celebrationId ? { ...celebration, status: newStatus } : celebration
    )
    setCelebrations(updatedCelebrations)
    localStorage.setItem('cieloytierra_celebrations', JSON.stringify(updatedCelebrations))
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

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Statistics Cards Grid - SOLO 4 cards con colores de marca */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Orders Card */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700/50">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-primary-red/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{orders.length}</h3>
            <p className="text-gray-400 text-sm font-medium">Total de Pedidos</p>
            <p className="text-primary-red text-xs mt-1">{orders.filter(o => o.status === 'pending').length} Pendientes</p>
          </div>
        </div>

        {/* Total Products Card */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700/50">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-primary-yellow/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{products.length}</h3>
            <p className="text-gray-400 text-sm font-medium">Productos Disponibles</p>
            <p className="text-primary-yellow text-xs mt-1">{products.filter(p => p.featured).length} Destacados</p>
          </div>
        </div>

        {/* Total Categories Card */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700/50">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-primary-red/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{categories.length}</h3>
            <p className="text-gray-400 text-sm font-medium">Categorías</p>
            <p className="text-primary-red text-xs mt-1">Organizadas</p>
          </div>
        </div>

        {/* Total Celebrations Card */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700/50">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-primary-yellow/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{celebrations.length}</h3>
            <p className="text-gray-400 text-sm font-medium">Celebraciones</p>
            <p className="text-primary-yellow text-xs mt-1">{celebrations.filter(c => c.status === 'pending').length} Pendientes</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderOrders = () => {
    const filteredOrders = getFilteredOrders()
    
    return (
      <div className="space-y-4">
        {/* Header compacto móvil-first */}
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Pedidos</h2>
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
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                orderFilter === 'all' 
                  ? 'bg-primary-red text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Todos ({orders.length})
            </button>
            <button 
              onClick={() => setOrderFilter('pending')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                orderFilter === 'pending' 
                  ? 'bg-primary-yellow text-gray-900' 
                  : 'bg-primary-yellow/20 text-primary-yellow hover:bg-primary-yellow/30'
              }`}
            >
              Pendientes ({orders.filter(o => o.status === 'pending').length})
            </button>
            <button 
              onClick={() => setOrderFilter('cancelled')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                orderFilter === 'cancelled' 
                  ? 'bg-gray-600 text-white' 
                  : 'bg-gray-600/20 text-gray-400 hover:bg-gray-600/30'
              }`}
            >
              Cancelados ({orders.filter(o => o.status === 'cancelled').length})
            </button>
          </div>
        </div>

        {/* Lista de pedidos rediseñada para móvil */}
        <div className="space-y-3">
          {filteredOrders.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-600/20 rounded-lg flex items-center justify-center">
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
              <div key={order.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700/50">
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
                      className="flex-1 bg-primary-red text-white py-2 px-3 rounded-lg hover:bg-primary-red/90 transition-colors text-sm font-medium"
                    >
                      ✓ Aceptar
                    </button>
                  )}
                  {order.status === 'accepted' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className="flex-1 bg-primary-yellow text-gray-900 py-2 px-3 rounded-lg hover:bg-primary-yellow/90 transition-colors text-sm font-medium"
                    >
                      ✓ Completar
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

        {/* Modal de confirmación - mismo diseño */}
        {showClearHistoryModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl p-6 max-w-sm w-full border border-gray-700">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-primary-red/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2">
                  ¿Limpiar historial?
                </h3>
                
                <p className="text-gray-300 text-sm mb-6">
                  Se eliminarán <strong>todos los pedidos</strong> permanentemente.
                </p>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowClearHistoryModal(false)}
                    className="flex-1 bg-gray-700 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={clearOrderHistory}
                    className="flex-1 bg-primary-red text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-red/90 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }



  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gestión de Productos</h2>
        <button
          onClick={() => setShowProductModal(true)}
          className="bg-primary-red text-white px-4 py-2 rounded-lg hover:bg-primary-red/90 transition-colors"
        >
          Agregar Producto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="aspect-video relative">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
              <p className="text-gray-400 text-sm mb-3">{product.description}</p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xl font-bold text-primary-red">${product.price.toLocaleString('es-CO')}</span>
                <span className="bg-primary-yellow/20 text-primary-yellow px-2 py-1 rounded-full text-sm">
                  {product.category}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingProduct(product)
                    setSelectedImage(product.image)
                    setShowProductModal(true)
                  }}
                  className="flex-1 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderCategories = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gestión de Categorías</h2>
        <button
          onClick={() => setShowCategoryModal(true)}
          className="bg-primary-red text-white px-4 py-2 rounded-lg hover:bg-primary-red/90 transition-colors"
        >
          Agregar Categoría
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-white">{category.name}</h3>
              <button
                onClick={() => deleteCategory(category.id)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <p className="text-gray-400 text-sm">{category.description}</p>
            <div className="mt-3">
              <span 
                className="inline-block w-4 h-4 rounded-full" 
                style={{ backgroundColor: category.color }}
              ></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderCelebrations = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Gestión de Celebraciones</h2>
      
      <div className="space-y-4">
        {celebrations.map((celebration) => (
          <div key={celebration.id} className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{celebration.eventType}</h3>
                <p className="text-gray-400 text-sm">{celebration.date}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(celebration.status)}`}>
                {getStatusText(celebration.status)}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-white font-medium mb-2">Información del Cliente</h4>
                <p className="text-gray-300">{celebration.customerName}</p>
                <p className="text-gray-400 text-sm">{celebration.customerPhone}</p>
              </div>
              <div>
                <h4 className="text-white font-medium mb-2">Detalles del Evento</h4>
                <p className="text-gray-300">Invitados: {celebration.guests}</p>
              </div>
            </div>

            {celebration.notes && (
              <div className="mb-4">
                <h4 className="text-white font-medium mb-2">Notas</h4>
                <p className="text-gray-300 bg-gray-700 p-3 rounded-lg">{celebration.notes}</p>
              </div>
            )}

            <div className="flex space-x-3">
              {celebration.status === 'pending' && (
                <button
                  onClick={() => updateCelebrationStatus(celebration.id, 'confirmed')}
                  className="bg-primary-red text-white px-4 py-2 rounded-lg hover:bg-primary-red/90 transition-colors"
                >
                  Confirmar Evento
                </button>
              )}
              {celebration.status === 'confirmed' && (
                <button
                  onClick={() => updateCelebrationStatus(celebration.id, 'completed')}
                  className="bg-primary-yellow text-gray-900 px-4 py-2 rounded-lg hover:bg-primary-yellow/90 transition-colors"
                >
                  Marcar Completado
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Fondo sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-red/5 via-transparent to-primary-yellow/5 pointer-events-none" />
      
      {/* Header con logo - Igual que /home */}
      <div className="pt-4 pb-2">
        <div className="text-center">
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

      <div className="px-4 pb-24">

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

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-white">
              {editingProduct ? 'Editar Producto' : 'Agregar Producto'}
            </h3>
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
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Nombre</label>
                  <input
                    name="name"
                    type="text"
                    required
                    defaultValue={editingProduct?.name || ''}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-red"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Descripción</label>
                  <textarea
                    name="description"
                    required
                    defaultValue={editingProduct?.description || ''}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-red h-20 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Precio</label>
                  <input
                    name="price"
                    type="number"
                    required
                    min="0"
                    step="1000"
                    defaultValue={editingProduct?.price || ''}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-red"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Categoría</label>
                  <select
                    name="category"
                    required
                    defaultValue={editingProduct?.category || ''}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-red"
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Imagen</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-red"
                  />
                  {selectedImage && (
                    <div className="mt-2">
                      <img src={selectedImage} alt="Preview" className="w-20 h-20 object-cover rounded" />
                    </div>
                  )}
                </div>
                <div className="flex items-center">
                  <input
                    name="featured"
                    type="checkbox"
                    id="featured"
                    defaultChecked={editingProduct?.featured || false}
                    className="mr-2 rounded focus:ring-primary-red"
                  />
                  <label htmlFor="featured" className="text-white text-sm">Producto destacado</label>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowProductModal(false)
                    setEditingProduct(null)
                    setSelectedImage(null)
                  }}
                  className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary-red text-white py-2 rounded-lg hover:bg-primary-red/90 transition-colors"
                >
                  {editingProduct ? 'Actualizar' : 'Agregar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-white">Agregar Categoría</h3>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const categoryData = {
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                color: formData.get('color') as string,
              }
              addCategory(categoryData)
              setShowCategoryModal(false)
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Nombre</label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-red"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Descripción</label>
                  <textarea
                    name="description"
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-red h-20 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Color</label>
                  <input
                    name="color"
                    type="color"
                    defaultValue="#e61d25"
                    className="w-full bg-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-red h-10"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary-red text-white py-2 rounded-lg hover:bg-primary-red/90 transition-colors"
                >
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
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
    </div>
  )
}
