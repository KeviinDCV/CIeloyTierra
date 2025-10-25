'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import BottomNavigation from '../../components/BottomNavigation'
import { useAppData } from '../../lib/AppDataContext'
import Modal from '../../components/Modal'

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
    <div className="min-h-screen bg-layer-base text-white relative overflow-hidden pb-20 md:pb-28">
      {/* Contenedor principal responsive */}
      <div className="max-w-sm mx-auto md:max-w-2xl lg:max-w-4xl xl:max-w-6xl">
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
          <div className="mx-4 md:mx-6 lg:mx-8 mb-6">
            <div 
              className="bg-gradient-to-b from-layer-elevated to-layer-high rounded-3xl p-6 md:p-8 relative overflow-hidden cursor-pointer shadow-layer-lg hover:shadow-elevated-md transition-all duration-300"
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
            <div className="bg-layer-mid rounded-3xl p-6 text-center shadow-layer-md">
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
                      : 'bg-layer-mid text-gray-300 hover:bg-layer-high shadow-layer-sm'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-layer-mid rounded-2xl p-6 text-center shadow-layer-md">
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
              {filteredProducts.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-gradient-to-b from-layer-high to-layer-mid rounded-2xl p-4 hover:from-layer-elevated hover:to-layer-high transition-all duration-300 cursor-pointer shadow-layer-md hover:shadow-layer-lg"
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
            <div className="bg-layer-mid rounded-2xl p-6 text-center shadow-layer-md">
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

      {/* Product Detail Modal using new Modal component - IDENTICAL to /home */}
      <Modal 
        isOpen={!!selectedDish}
        onClose={() => {
          setSelectedDish(null)
          setDishQuantity(1)
        }}
        title={selectedDish?.name || ""}
        size="md"
      >
        {selectedDish && (
          <div>
            {/* Dish Image - Mobile responsive */}
            <div className="h-32 sm:h-40 md:h-48 relative rounded-lg overflow-hidden mb-3 sm:mb-4">
              <Image
                src={selectedDish.image}
                alt={selectedDish.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Price and Rating Row - Mobile responsive */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <p className="text-primary-red text-lg sm:text-xl md:text-2xl font-bold">
                ${selectedDish.price.toLocaleString('es-CO')}
              </p>
              
              {/* Rating - Smaller on mobile */}
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3 h-3 sm:w-4 sm:h-4 ${
                      i < Math.floor(selectedDish.rating) ? 'text-primary-yellow' : 'text-gray-600'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-gray-400 text-xs sm:text-sm ml-1">{selectedDish.rating}</span>
              </div>
            </div>

            {/* Description - Mobile responsive */}
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">{selectedDish.description}</p>

            {/* Category Badge - Mobile responsive */}
            <div className="flex justify-center mb-3 sm:mb-4">
              <span className="bg-primary-yellow/20 text-primary-yellow px-2 py-1 sm:px-3 rounded-full text-xs font-medium">
                {selectedDish.category}
              </span>
            </div>

            {/* Quantity Selector - Mobile responsive */}
            <div className="bg-layer-mid rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 shadow-layer-sm">
              <label className="block text-white text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-center">Cantidad</label>
              <div className="flex items-center justify-center space-x-3 sm:space-x-4">
                <button 
                  onClick={() => setDishQuantity(Math.max(1, dishQuantity - 1))}
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-layer-high rounded-lg flex items-center justify-center text-white font-bold text-lg sm:text-xl hover:bg-layer-elevated transition-colors shadow-layer-sm"
                >
                  -
                </button>
                <span className="text-white text-xl sm:text-2xl font-bold min-w-[2.5rem] sm:min-w-[3rem] text-center">
                  {dishQuantity.toString().padStart(2, '0')}
                </span>
                <button 
                  onClick={() => setDishQuantity(dishQuantity + 1)}
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-layer-high rounded-lg flex items-center justify-center text-white font-bold text-lg sm:text-xl hover:bg-layer-elevated transition-colors shadow-layer-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total Price - Mobile responsive */}
            <div className="bg-primary-red/10 border border-primary-red/20 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-xs sm:text-sm">Total:</span>
                <span className="text-primary-red text-lg sm:text-xl font-bold">
                  ${(selectedDish.price * dishQuantity).toLocaleString('es-CO')}
                </span>
              </div>
            </div>

            {/* Order Button - Mobile responsive */}
            <button 
              onClick={(event) => {
                for (let i = 0; i < dishQuantity; i++) {
                  addToCart(selectedDish)
                }
                // Visual feedback
                const button = event.target as HTMLButtonElement
                if (button) {
                  button.textContent = '✓ Agregado'
                  setTimeout(() => {
                    button.textContent = 'Agregar al Carrito'
                  }, 1000)
                }
                // Show custom toast
                showAddToCartToast(`${dishQuantity} x ${selectedDish.name} agregado al carrito 🛒`)
                // Close modal
                setTimeout(() => {
                  setSelectedDish(null)
                  setDishQuantity(1)
                }, 1500)
              }}
              className="w-full bg-primary-red hover:bg-primary-red/90 text-white py-3 sm:py-4 rounded-lg text-sm sm:text-base md:text-lg font-bold transition-colors flex items-center justify-center space-x-1 sm:space-x-2"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5-5m6 5v6a1 1 0 11-2 0v-6m2 0V9a1 1 0 112 0v4M9 9v10a1 1 0 01-2 0V9a1 1 0 012 0z" />
              </svg>
              <span>Agregar al Carrito</span>
            </button>
          </div>
        )}
      </Modal>

      {/* Customer Info Modal using new Modal component */}
      <Modal 
        isOpen={showOrderModal}
        onClose={() => {
          setShowOrderModal(false)
          setCustomerInfo({ name: '', phone: '', address: '', tempDish: null, tempQuantity: 1 })
        }}
        title={orderType === 'direct' ? 'Información de Entrega' : 'Finalizar Pedido'}
        size="md"
      >
        <div className="space-y-4">
          {orderType === 'direct' && customerInfo.tempDish && (
            <div className="bg-layer-mid rounded-lg p-4 shadow-layer-md">
              <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
                <span>🍽️</span>
                <span>Tu pedido:</span>
              </h3>
              <div className="flex justify-between items-center">
                <span className="text-gray-300 font-medium">
                  {customerInfo.tempDish.name} x{customerInfo.tempQuantity}
                </span>
                <span className="text-primary-yellow font-bold text-lg">
                  ${(customerInfo.tempDish.price * customerInfo.tempQuantity).toLocaleString('es-CO')}
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              👤 Nombre completo *
            </label>
            <input
              type="text"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-layer-high text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow transition-colors shadow-layer-sm"
              placeholder="Ingresa tu nombre completo"
              required
            />
          </div>

          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              📱 Teléfono *
            </label>
            <input
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full bg-layer-high text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow transition-colors shadow-layer-sm"
              placeholder="Ej: 300 123 4567"
              required
            />
          </div>

          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              📍 Dirección de entrega *
            </label>
            <textarea
              value={customerInfo.address}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-yellow h-20 resize-none transition-colors border border-gray-600"
              placeholder="Dirección completa con referencias (Ej: Calle 123 #45-67, Apto 301, portería azul)"
              required
            />
          </div>

          <div className="bg-layer-mid rounded-lg p-3 shadow-layer-sm">
            <p className="text-gray-300 text-sm flex items-center space-x-2">
              <span>💡</span>
              <span>Tip: Incluye referencias para facilitar la entrega</span>
            </p>
          </div>

          <button 
            onClick={submitOrder}
            disabled={!customerInfo.name || !customerInfo.phone || !customerInfo.address}
            className="w-full bg-primary-red hover:bg-primary-red/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-4 rounded-lg text-lg font-bold transition-colors mt-6 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Confirmar Pedido</span>
          </button>
        </div>
      </Modal>

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
    </div>
  )
}
