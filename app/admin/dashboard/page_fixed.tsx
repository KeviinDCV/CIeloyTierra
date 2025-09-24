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
  const { categories, addCategory, deleteCategory } = useAppData()
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

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      window.location.href = '/admin'
      return
    }
  }, [])

  // Function to intelligently load data from localStorage
  const loadDataFromStorage = () => {
    try {
      const savedOrders = localStorage.getItem('cieloytierra_orders')
      const savedProducts = localStorage.getItem('cieloytierra_products')
      const savedCelebrations = localStorage.getItem('cieloytierra_celebrations')

      if (savedOrders) {
        const newOrders = JSON.parse(savedOrders)
        
        // Smart merge: preserve admin status changes, only add new orders
        setOrders(currentOrders => {
          const mergedOrders = [...currentOrders]
          
          newOrders.forEach((newOrder: any) => {
            const existingIndex = mergedOrders.findIndex(order => order.id === newOrder.id)
            
            if (existingIndex === -1) {
              // New order - add it
              mergedOrders.push(newOrder)
            } else {
              // Existing order - keep admin changes but update other fields if needed
              const existing = mergedOrders[existingIndex]
              if (existing.status === 'pending' && newOrder.status === 'pending') {
                // If both are pending, safe to update (probably same order)
                mergedOrders[existingIndex] = newOrder
              }
              // Otherwise preserve the admin's status changes
            }
          })
          
          return mergedOrders
        })
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

  // Auto-refresh data every 3 seconds for real-time monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      loadDataFromStorage()
    }, 3000) // Poll every 3 seconds

    return () => clearInterval(interval)
  }, [])

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
    setOrders([])
    localStorage.setItem('cieloytierra_orders', JSON.stringify([]))
    setShowClearHistoryModal(false)
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

  const renderOrders = () => {
    const filteredOrders = getFilteredOrders()
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h2 className="text-2xl font-bold text-white">Pedidos</h2>
          
          <div className="flex items-center space-x-3">
            {/* Filter buttons */}
            <div className="flex space-x-2">
              <button 
                onClick={() => setOrderFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  orderFilter === 'all' 
                    ? 'bg-primary-red text-white' 
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                Todos ({orders.length})
              </button>
              <button 
                onClick={() => setOrderFilter('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  orderFilter === 'pending' 
                    ? 'bg-primary-yellow text-gray-900' 
                    : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                }`}
              >
                Pendientes ({orders.filter(o => o.status === 'pending').length})
              </button>
              <button 
                onClick={() => setOrderFilter('cancelled')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  orderFilter === 'cancelled' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                }`}
              >
                Cancelados ({orders.filter(o => o.status === 'cancelled').length})
              </button>
            </div>

            {/* Clear history button */}
            <button
              onClick={() => setShowClearHistoryModal(true)}
              className="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-red-600 hover:text-white transition-colors group mr-4"
              title="Borrar todo el historial de pedidos"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-400 text-lg">
                {orderFilter === 'pending' && 'No hay pedidos pendientes'}
                {orderFilter === 'cancelled' && 'No hay pedidos cancelados'}
                {orderFilter === 'all' && 'No hay pedidos registrados'}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Pedido #{order.id}</h3>
                    <p className="text-gray-400 text-sm">{new Date(order.timestamp).toLocaleString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">Información del Cliente</h4>
                    <p className="text-gray-300">{order.customerName}</p>
                    <p className="text-gray-400 text-sm">{order.customerPhone}</p>
                    <p className="text-gray-400 text-sm">{order.customerAddress}</p>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-2">Artículos</h4>
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-300">{item.name} x{item.quantity}</span>
                        <span className="text-primary-red">${(item.price * item.quantity).toLocaleString('es-CO')}</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-600 mt-2 pt-2">
                      <div className="flex justify-between font-bold">
                        <span className="text-white">Total:</span>
                        <span className="text-primary-red">${order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {order.notes && (
                  <div className="mb-4">
                    <h4 className="text-white font-medium mb-2">Notas Especiales</h4>
                    <p className="text-gray-300 bg-gray-700 p-3 rounded-lg">{order.notes}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  {/* Botones específicos por estado */}
                  {order.status === 'pending' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'accepted')}
                      className="bg-primary-red text-white px-4 py-2 rounded-lg hover:bg-primary-red/90 transition-colors font-medium"
                    >
                      Aceptar pedido
                    </button>
                  )}
                  {order.status === 'accepted' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className="bg-primary-yellow text-gray-900 px-4 py-2 rounded-lg hover:bg-primary-yellow/90 transition-colors font-medium"
                    >
                      Marcar completado
                    </button>
                  )}
                  
                  {/* Botones disponibles en todos los estados */}
                  {order.status !== 'cancelled' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                    >
                      Cancelar pedido
                    </button>
                  )}
                  
                  <button 
                    onClick={() => contactCustomer(order)}
                    className="bg-primary-yellow text-gray-900 px-4 py-2 rounded-lg hover:bg-primary-yellow/90 transition-colors font-medium flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.520.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    <span>Contactar cliente</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Clear History Confirmation Modal */}
        {showClearHistoryModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-gray-700">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">
                  ¿Borrar todo el historial?
                </h3>
                
                <p className="text-gray-300 mb-6">
                  Esta acción eliminará <strong>todos los pedidos</strong> registrados de forma permanente. 
                  No se puede deshacer.
                </p>
                
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowClearHistoryModal(false)}
                    className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={clearOrderHistory}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Sí, borrar todo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Panel Administrativo</h1>
            <p className="text-gray-400">Gestiona tu restaurante Cielo y Tierra</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg mb-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'orders' ? 'bg-primary-red text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Pedidos
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'orders' && renderOrders()}

        <BottomNavigation activeTab="" />
      </div>
    </div>
  )
}
