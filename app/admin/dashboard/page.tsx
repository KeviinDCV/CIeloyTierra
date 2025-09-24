'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

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
  const [activeTab, setActiveTab] = useState('overview')
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [celebrations, setCelebrations] = useState<Celebration[]>([])
  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newProductId, setNewProductId] = useState(3)

  // Check authentication
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    if (adminToken !== 'cielo-tierra-admin-2024') {
      window.location.href = '/admin'
    }
  }, [])

  // Load data from localStorage or start with empty arrays
  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem('cieloytierra_orders')
      const savedProducts = localStorage.getItem('cieloytierra_products')
      const savedCelebrations = localStorage.getItem('cieloytierra_celebrations')

      if (savedOrders) {
        setOrders(JSON.parse(savedOrders))
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
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    window.location.href = '/admin'
  }



  const handleSaveProduct = (productData: Omit<Product, 'id'> | Product) => {
    let updatedProducts: Product[]
    
    if ('id' in productData) {
      // Update existing product
      updatedProducts = products.map(p => p.id === productData.id ? productData : p)
    } else {
      // Add new product
      const newProduct = { ...productData, id: newProductId }
      updatedProducts = [...products, newProduct]
      setNewProductId(newProductId + 1)
    }
    
    setProducts(updatedProducts)
    localStorage.setItem('cieloytierra_products', JSON.stringify(updatedProducts))
    setEditingProduct(null)
  }

  const deleteProduct = (productId: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      const updatedProducts = products.filter(p => p.id !== productId)
      setProducts(updatedProducts)
      localStorage.setItem('cieloytierra_products', JSON.stringify(updatedProducts))
    }
  }

  const updateOrderStatus = (orderId: number, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    )
    setOrders(updatedOrders)
    localStorage.setItem('cieloytierra_orders', JSON.stringify(updatedOrders))
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
      case 'accepted': case 'confirmed': return 'text-blue-400 bg-blue-400/10'
      case 'completed': return 'text-green-400 bg-green-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente'
      case 'accepted': return 'Aceptado'
      case 'confirmed': return 'Confirmado'
      case 'completed': return 'Completado'
      default: return status
    }
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary-red/20 rounded-lg">
              <svg className="w-6 h-6 text-primary-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7H6L5 9z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-400 text-sm">Pedidos Pendientes</p>
              <p className="text-2xl font-bold text-white">{orders.filter(o => o.status === 'pending').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary-yellow/20 rounded-lg">
              <svg className="w-6 h-6 text-primary-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-400 text-sm">Ventas Hoy</p>
              <p className="text-2xl font-bold text-white">${orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-400 text-sm">Productos Activos</p>
              <p className="text-2xl font-bold text-white">{products.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-400 text-sm">Celebraciones</p>
              <p className="text-2xl font-bold text-white">{celebrations.filter(c => c.status === 'pending').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">Actividad Reciente</h3>
        <div className="space-y-3">
          {orders.slice(0, 3).map((order) => (
            <div key={order.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div>
                <p className="text-white font-medium">Nuevo pedido de {order.customerName}</p>
                <p className="text-gray-400 text-sm">${order.total.toLocaleString()}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Pedidos</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
            Todos
          </button>
          <button className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors">
            Pendientes
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
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
                    <span className="text-primary-red">${(item.price * item.quantity).toLocaleString()}</span>
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

            <div className="flex space-x-3">
              {order.status === 'pending' && (
                <button
                  onClick={() => updateOrderStatus(order.id, 'accepted')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Aceptar Pedido
                </button>
              )}
              {order.status === 'accepted' && (
                <button
                  onClick={() => updateOrderStatus(order.id, 'completed')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Marcar Completado
                </button>
              )}
              <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                Contactar Cliente
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

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
          <div key={product.id} className="bg-gray-800 rounded-lg p-4">
            <div className="w-full h-32 relative mb-3">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <h3 className="text-white font-bold mb-1">{product.name}</h3>
            <p className="text-gray-400 text-sm mb-2">{product.description}</p>
            <div className="flex justify-between items-center mb-3">
              <span className="text-primary-red font-bold">${product.price.toLocaleString()}</span>
              <span className="text-primary-yellow text-sm">★ {product.rating}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-400 text-xs">{product.category}</span>
              {product.featured && (
                <span className="bg-primary-yellow/20 text-primary-yellow px-2 py-1 rounded text-xs font-medium flex items-center">
                  🍽️ Plato del Día
                </span>
              )}
            </div>
            <div className="space-y-2">
              <button
                onClick={() => {
                  const updatedProduct = { ...product, featured: !product.featured }
                  handleSaveProduct(updatedProduct)
                }}
                className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                  product.featured 
                    ? 'bg-primary-yellow/20 text-primary-yellow hover:bg-primary-yellow/30' 
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                }`}
              >
                {product.featured ? '🍽️ Quitar de Hoy' : '🍽️ Poner en Hoy'}
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingProduct(product)
                    setShowProductModal(true)
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  Editar
                </button>
                <button 
                  onClick={() => deleteProduct(product.id)}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
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

  const renderCelebrations = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Celebraciones y Eventos</h2>
      
      <div className="space-y-4">
        {celebrations.map((celebration) => (
          <div key={celebration.id} className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{celebration.eventType}</h3>
                <p className="text-gray-400 text-sm">Cliente: {celebration.customerName}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(celebration.status)}`}>
                {getStatusText(celebration.status)}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-white font-medium mb-2">Detalles del Evento</h4>
                <p className="text-gray-300">Fecha: {celebration.date}</p>
                <p className="text-gray-300">Invitados: {celebration.guests} personas</p>
                <p className="text-gray-300">Teléfono: {celebration.customerPhone}</p>
              </div>
              <div>
                <h4 className="text-white font-medium mb-2">Notas Especiales</h4>
                <p className="text-gray-300 bg-gray-700 p-3 rounded-lg">{celebration.notes}</p>
              </div>
            </div>

            <div className="flex space-x-3">
              {celebration.status === 'pending' && (
                <button
                  onClick={() => updateCelebrationStatus(celebration.id, 'confirmed')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Confirmar Evento
                </button>
              )}
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Contactar Cliente
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 relative">
              <Image
                src="/logo.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold font-['Pacifico']">Panel Administrativo</h1>
              <p className="text-gray-400 text-sm">Cielo y Tierra</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="flex space-x-0 overflow-x-auto">
          {[
            { id: 'overview', label: 'Resumen', icon: '📊' },
            { id: 'orders', label: 'Pedidos', icon: '🛍️' },
            { id: 'products', label: 'Productos', icon: '🍽️' },
            { id: 'celebrations', label: 'Celebraciones', icon: '🎉' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-red text-primary-red bg-gray-700'
                  : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'celebrations' && renderCelebrations()}
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingProduct ? 'Editar Producto' : 'Agregar Producto'}
              </h2>
              <button
                onClick={() => {
                  setShowProductModal(false)
                  setEditingProduct(null)
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target as HTMLFormElement)
              const productData = {
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                price: Number(formData.get('price')),
                image: formData.get('image') as string,
                category: formData.get('category') as string,
                rating: Number(formData.get('rating')),
                featured: formData.has('featured')
              }
              
              if (editingProduct) {
                handleSaveProduct({ ...editingProduct, ...productData })
              } else {
                handleSaveProduct(productData)
              }
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre del Producto *
                </label>
                <input
                  name="name"
                  type="text"
                  defaultValue={editingProduct?.name || ''}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-red"
                  placeholder="Ej: Churrasco Premium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción *
                </label>
                <textarea
                  name="description"
                  defaultValue={editingProduct?.description || ''}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-red h-20 resize-none"
                  placeholder="Descripción del producto"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Precio *
                  </label>
                  <input
                    name="price"
                    type="number"
                    defaultValue={editingProduct?.price || ''}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-red"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Calificación
                  </label>
                  <input
                    name="rating"
                    type="number"
                    defaultValue={editingProduct?.rating || '4.5'}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-red"
                    min="1"
                    max="5"
                    step="0.1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Categoría
                </label>
                <select
                  name="category"
                  defaultValue={editingProduct?.category || 'Entrada'}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-red"
                >
                  <option value="Entrada">Entrada</option>
                  <option value="Principal">Principal</option>
                  <option value="Postre">Postre</option>
                  <option value="Bebida">Bebida</option>
                  <option value="Desayuno">Desayuno</option>
                  <option value="Almuerzo">Almuerzo</option>
                  <option value="Cena">Cena</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL de la Imagen
                </label>
                <input
                  name="image"
                  type="text"
                  defaultValue={editingProduct?.image || ''}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-red"
                  placeholder="/imagen.jpg"
                />
              </div>

              <div className="bg-gray-700 rounded-lg p-3">
                <div className="flex items-center">
                  <input
                    name="featured"
                    type="checkbox"
                    defaultChecked={editingProduct?.featured || false}
                    className="mr-3 w-4 h-4 text-primary-red bg-gray-600 border-gray-500 rounded focus:ring-primary-red focus:ring-2"
                  />
                  <div>
                    <label className="text-sm font-medium text-white">
                      🍽️ Plato del Día de Hoy
                    </label>
                    <p className="text-xs text-gray-400 mt-1">
                      Aparecerá en la sección "¡Hoy tenemos!" del menú principal
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowProductModal(false)
                    setEditingProduct(null)
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
    </div>
  )
}
