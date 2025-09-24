'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import BottomNavigation from '../../components/BottomNavigation'
import { useAppData } from '../../lib/AppDataContext'

export default function MenuPage() {
  const { products, addToCart, categories } = useAppData()
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0)
  const [selectedDish, setSelectedDish] = useState<any>(null)
  const [dishQuantity, setDishQuantity] = useState(1)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [orderType, setOrderType] = useState<'direct' | 'cart'>('direct')
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    tempDish: null as any,
    tempQuantity: 1
  })
  const [randomizedProducts, setRandomizedProducts] = useState<any[]>([])
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // Toast function
  const showAddToCartToast = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  // Order functions
  const handleDirectOrder = (dish: any, quantity: number) => {
    setSelectedDish(null)
    setDishQuantity(1)
    setOrderType('direct')
    setShowOrderModal(true)
    // Store the dish info for the order
    setCustomerInfo(prev => ({
      ...prev,
      tempDish: dish,
      tempQuantity: quantity
    }))
  }

  const handleCartCheckout = () => {
    setOrderType('cart')
    setShowOrderModal(true)
  }

  const submitOrder = () => {
    // Get existing orders from localStorage
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    
    // Create new order
    const newOrder = {
      id: Date.now().toString(),
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      customerAddress: customerInfo.address,
      items: orderType === 'direct' 
        ? [{ 
            ...customerInfo.tempDish, 
            quantity: customerInfo.tempQuantity,
            total: customerInfo.tempDish.price * customerInfo.tempQuantity
          }]
        : JSON.parse(localStorage.getItem('cart') || '[]'),
      total: orderType === 'direct' 
        ? customerInfo.tempDish.price * customerInfo.tempQuantity
        : JSON.parse(localStorage.getItem('cart') || '[]').reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0),
      status: 'Realizado',
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString('es-CO')
    }

    // Save order
    existingOrders.push(newOrder)
    localStorage.setItem('orders', JSON.stringify(existingOrders))

    // Clear cart if it was a cart order
    if (orderType === 'cart') {
      localStorage.setItem('cart', JSON.stringify([]))
    }

    // Reset states
    setShowOrderModal(false)
    setCustomerInfo({ name: '', phone: '', address: '', tempDish: null, tempQuantity: 1 })
    
    // Show success message or redirect
    alert('¡Pedido realizado con éxito!')
  }

  useEffect(() => {
    setIsLoaded(true)
    // Set default category to first available category
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].name)
    }
  }, [categories, selectedCategory])

  // Randomize 7 products for natural rotation
  useEffect(() => {
    if (products.length > 0) {
      const shuffled = [...products].sort(() => Math.random() - 0.5)
      const selected7 = shuffled.slice(0, Math.min(7, shuffled.length))
      setRandomizedProducts(selected7)
    }
  }, [products])

  // Auto-rotate with natural timing (slower, more moderate)
  useEffect(() => {
    if (randomizedProducts.length > 1) {
      const interval = setInterval(() => {
        setCurrentCarouselIndex((prev) => (prev + 1) % randomizedProducts.length)
      }, 6000) // Change every 6 seconds for moderate timing
      
      return () => clearInterval(interval)
    }
  }, [randomizedProducts.length])

  // Get category names for the buttons
  const categoryNames = categories.map(cat => cat.name)
  
  // Filter products by selected category
  const filteredProducts = products.filter(product => 
    product.category.toLowerCase() === selectedCategory.toLowerCase()
  )
  
  // Get featured product for the hero card
  const featuredProduct = products.find(product => product.featured) || products[0]

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden pb-20">
      {/* CSS Animations for natural transitions */}
      <style jsx>{`
        @keyframes fadeInSlide {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
      
      {/* Fondo sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-red/5 via-transparent to-primary-yellow/5 pointer-events-none" />
      
      <div className={`transition-all duration-700 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-center p-6">
          <div className="relative w-28 h-28">
            <Image
              src="/Logo.png"
              alt="Cielo y Tierra Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Featured Dish Display with Natural Transitions */}
        {randomizedProducts.length > 0 ? (
          <div className="mx-6 mb-6">
            <div 
              className="bg-gray-800 rounded-3xl p-6 relative overflow-hidden cursor-pointer"
              onClick={() => {
                setSelectedDish(randomizedProducts[currentCarouselIndex])
                setDishQuantity(1)
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-red/20 to-primary-yellow/20 rounded-full -translate-y-8 translate-x-8 transition-opacity duration-700"></div>
              
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 
                      key={`name-${currentCarouselIndex}`}
                      className="text-white text-xl font-bold transition-all duration-700 ease-in-out transform"
                      style={{
                        animation: 'fadeInSlide 0.7s ease-in-out'
                      }}
                    >
                      {randomizedProducts[currentCarouselIndex]?.name}
                    </h3>
                    <div className="ml-2 w-2 h-2 bg-primary-red rounded-full animate-pulse"></div>
                  </div>
                  <p 
                    key={`desc-${currentCarouselIndex}`}
                    className="text-gray-400 text-sm mb-4 transition-all duration-700 ease-in-out"
                    style={{
                      animation: 'fadeInSlide 0.7s ease-in-out 0.1s both'
                    }}
                  >
                    {randomizedProducts[currentCarouselIndex]?.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div 
                      key={`price-${currentCarouselIndex}`}
                      className="flex items-center transition-all duration-700 ease-in-out"
                      style={{
                        animation: 'fadeInSlide 0.7s ease-in-out 0.2s both'
                      }}
                    >
                      <span className="text-gray-400 text-sm mr-2">desde</span>
                      <span className="text-white text-2xl font-bold">
                        ${randomizedProducts[currentCarouselIndex]?.price.toLocaleString('es-CO')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div 
                  key={`image-${currentCarouselIndex}`}
                  className="w-32 h-32 relative ml-4 transition-all duration-700 ease-in-out"
                  style={{
                    animation: 'fadeInScale 0.7s ease-in-out 0.3s both'
                  }}
                >
                  <Image
                    src={randomizedProducts[currentCarouselIndex]?.image || '/placeholder-food.jpg'}
                    alt={randomizedProducts[currentCarouselIndex]?.name || 'Producto'}
                    fill
                    className="object-contain rounded-lg transition-all duration-500"
                  />
                </div>
              </div>
              
              {/* Click indicator */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-gray-500 text-xs opacity-70">
                👆 Toca para ver más
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-6 mb-6">
            <div className="bg-gray-800 rounded-3xl p-6 text-center">
              <p className="text-gray-400 text-sm">
                No hay productos disponibles.
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Los administradores pueden agregar productos desde el panel.
              </p>
            </div>
          </div>
        )}

        {/* Meal Categories */}
        <div className="px-6 mb-6">
          <h3 className="text-white text-lg font-bold mb-4">Categorías</h3>
          {categories.length > 0 ? (
            <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    selectedCategory === category.name
                      ? 'bg-primary-red text-white shadow-lg'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-2xl p-6 text-center">
              <p className="text-gray-400 text-sm">
                No hay categorías disponibles.
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Los administradores pueden agregar categorías desde el panel.
              </p>
            </div>
          )}
        </div>

        {/* Category Products Section */}
        <div className="px-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-bold">
              {selectedCategory || 'Productos'}
            </h3>
            <button className="text-primary-red text-sm font-medium">Ver Más</button>
          </div>
          
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {filteredProducts.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-gray-800 rounded-2xl p-4 hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedDish(item)
                    setDishQuantity(1)
                  }}
                >
                  <div className="w-full h-20 relative mb-3">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                  
                  <h4 className="text-white text-sm font-bold mb-1">
                    {item.name}
                  </h4>
                  <p className="text-gray-400 text-xs mb-2">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(item.rating) ? 'text-primary-yellow' : 'text-gray-600'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-primary-red font-bold text-sm">
                      ${item.price.toLocaleString('es-CO')}
                    </span>
                    <button 
                      onClick={(event) => {
                        event.stopPropagation() // Prevent modal from opening
                        addToCart(item)
                        // Show toast - no need for button text change since we have toast
                        showAddToCartToast(`${item.name} agregado al carrito 🛒`)
                      }}
                      className="bg-primary-red text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-primary-red/90 transition-colors"
                    >
                      Pedir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-2xl p-6 text-center">
              <p className="text-gray-400 text-sm">
                No hay productos disponibles en la categoría "{selectedCategory}".
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Los administradores pueden agregar productos desde el panel.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Product Detail Modal */}
      {selectedDish && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-gray-800 rounded-3xl w-full max-w-sm relative overflow-hidden animate-slideUpBounce">
            {/* Header with back button */}
            <div className="absolute top-4 left-4 z-20">
              <button 
                onClick={() => setSelectedDish(null)}
                className="w-10 h-10 bg-black/20 rounded-xl flex items-center justify-center backdrop-blur-sm"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>

            {/* Product Image */}
            <div className="h-80 relative">
              <Image
                src={selectedDish.image || '/placeholder-food.jpg'}
                alt={selectedDish.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="p-6">
              <h2 className="text-white text-2xl font-bold mb-2">{selectedDish.name}</h2>
              <p className="text-primary-red text-3xl font-bold mb-1">
                ${selectedDish.price.toLocaleString('es-CO')}
              </p>
              <p className="text-gray-400 text-sm mb-4">{selectedDish.description}</p>

              {/* Rating */}
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(selectedDish.rating) ? 'text-primary-yellow' : 'text-gray-600'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-gray-400 text-sm ml-2">{selectedDish.rating}</span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between mb-6">
                <button 
                  onClick={() => setDishQuantity(Math.max(1, dishQuantity - 1))}
                  className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-white font-bold text-xl hover:bg-gray-600 transition-colors"
                >
                  -
                </button>
                <span className="text-white text-2xl font-bold px-4">{dishQuantity.toString().padStart(2, '0')}</span>
                <button 
                  onClick={() => setDishQuantity(dishQuantity + 1)}
                  className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-white font-bold text-xl hover:bg-gray-600 transition-colors"
                >
                  +
                </button>
              </div>

              {/* Action Button */}
              <div>
                <button 
                  onClick={() => {
                    addToCart(selectedDish, dishQuantity)
                    setSelectedDish(null)
                    setDishQuantity(1)
                    showAddToCartToast(`${selectedDish.name} agregado al carrito 🛒`)
                  }}
                  className="w-full bg-primary-red hover:bg-primary-red/90 text-white py-4 rounded-lg text-lg font-bold transition-colors"
                >
                  Pedir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Info Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-gray-800 rounded-3xl w-full max-w-md relative overflow-hidden animate-slideUpBounce">
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-white text-xl font-bold">
                  {orderType === 'direct' ? 'Información de Entrega' : 'Finalizar Pedido'}
                </h2>
                <button 
                  onClick={() => {
                    setShowOrderModal(false)
                    setCustomerInfo({ name: '', phone: '', address: '', tempDish: null, tempQuantity: 1 })
                  }}
                  className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              {orderType === 'direct' && customerInfo.tempDish && (
                <div className="bg-gray-700 rounded-lg p-4 mb-4">
                  <h3 className="text-white font-bold mb-2">Tu pedido:</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">
                      {customerInfo.tempDish.name} x{customerInfo.tempQuantity}
                    </span>
                    <span className="text-primary-red font-bold">
                      ${(customerInfo.tempDish.price * customerInfo.tempQuantity).toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-primary-red transition-colors"
                  placeholder="Ingresa tu nombre"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-primary-red transition-colors"
                  placeholder="Ej: 300 123 4567"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Dirección de entrega *
                </label>
                <textarea
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-primary-red transition-colors h-20 resize-none"
                  placeholder="Dirección completa con referencias"
                  required
                />
              </div>

              <button 
                onClick={submitOrder}
                disabled={!customerInfo.name || !customerInfo.phone || !customerInfo.address}
                className="w-full bg-primary-red hover:bg-primary-red/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-4 rounded-lg text-lg font-bold transition-colors mt-6"
              >
                Confirmar Pedido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile-Optimized Toast */}
      {showToast && (
        <div className="fixed top-6 left-4 right-4 z-50 animate-slideDown">
          <div className="bg-black/90 rounded-xl px-4 py-3 shadow-2xl backdrop-blur-sm">
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
