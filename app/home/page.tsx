'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import BottomNavigation from '../../components/BottomNavigation'
import Modal from '../../components/Modal'
import { useAppData } from '../../lib/AppDataContext'

export default function HomePage() {
  const { getFeaturedProducts, addToCart, addCelebration } = useAppData()
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedDish, setSelectedDish] = useState<any>(null)
  const [showReservation, setShowReservation] = useState(false)
  const [reservationData, setReservationData] = useState({
    customerName: '',
    customerPhone: '',
    date: '',
    time: '',
    guests: 1,
    reason: '',
    notes: ''
  })
  const [dishQuantity, setDishQuantity] = useState(1)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const chefRecommendations = getFeaturedProducts()

  // Toast function
  const showAddToCartToast = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Stories data - images and videos
  const stories = [
    { id: 1, type: 'image', src: '/Celebracion1.jpg', title: 'Cumpleaños Especiales' },
    { id: 2, type: 'image', src: '/Celebracion2.jpg', title: 'Aniversarios Románticos' },
    { id: 3, type: 'image', src: '/Celebracion3.jpg', title: 'Reuniones Familiares' },
    { id: 4, type: 'image', src: '/Celebracion4.jpg', title: 'Celebraciones Corporativas' },
    { id: 5, type: 'image', src: '/Celebracion5.jpg', title: 'Momentos Únicos' },
    { id: 6, type: 'image', src: '/Celebracion6.jpg', title: 'Experiencias Especiales' },
    { id: 7, type: 'video', src: '/Cv1.mp4', title: 'Celebrando Juntos' },
    { id: 8, type: 'video', src: '/Cv2.mp4', title: 'Momentos de Alegría' },
    { id: 9, type: 'video', src: '/Cv3.mp4', title: 'Sabores y Sonrisas' },
    { id: 10, type: 'video', src: '/Cv4.mp4', title: 'Cielo y Tierra en Acción' }
  ]

  // Auto-advance stories every 6 seconds (optimized for Vercel loading)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStoryIndex((prev) => (prev + 1) % stories.length)
    }, 6000)

    return () => clearInterval(timer)
  }, [stories.length])

  // Handle reservation submission
  const handleReservationSubmit = () => {
    if (reservationData.customerName && reservationData.customerPhone && reservationData.date && reservationData.time && reservationData.reason) {
      addCelebration({
        customerName: reservationData.customerName,
        customerPhone: reservationData.customerPhone,
        eventType: reservationData.reason,
        date: `${reservationData.date} ${reservationData.time}`,
        guests: reservationData.guests,
        notes: reservationData.notes || `Reserva desde la app. Hora: ${reservationData.time}`,
        status: 'pending'
      })
      
      setShowReservation(false)
      setReservationData({ 
        customerName: '', 
        customerPhone: '', 
        date: '', 
        time: '', 
        guests: 1, 
        reason: '', 
        notes: '' 
      })
      showAddToCartToast('¡Reserva enviada exitosamente! Te contactaremos pronto 🎉')
    } else {
      showAddToCartToast('Por favor completa todos los campos obligatorios ⚠️')
    }
  }
  
  // Handle add to cart
  const handleAddToCart = (product: any) => {
    addToCart(product, dishQuantity)
    alert(`${product.name} agregado al carrito`)
    setSelectedDish(null)
    setDishQuantity(1)
  }



  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
        {/* Fondo sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-red/5 via-transparent to-primary-yellow/5 pointer-events-none" />
        
        <div className={`transition-all duration-700 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
        
        {/* Header con logo */}
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

        {/* Contenido principal */}
        <div className="pb-24">
          
          {/* Stories Card - Unified Events & Moments */}
          <div className="px-4 py-6 relative">
            <div className="bg-gradient-to-br from-primary-red/10 via-primary-yellow/5 to-primary-red/10 rounded-3xl relative"
                 style={{
                   maskImage: 'linear-gradient(to top, transparent 0%, black 15%)',
                   WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 15%)'
                 }}>
              
              {/* Stories Progress Indicators */}
              <div className="absolute top-4 left-4 right-4 z-20 flex space-x-1">
                {stories.map((_, index) => (
                  <div
                    key={index}
                    className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                      index === currentStoryIndex 
                        ? 'bg-white' 
                        : index < currentStoryIndex 
                          ? 'bg-primary-yellow' 
                          : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              {/* Current Story Content */}
              <div className="relative h-80 overflow-hidden rounded-3xl">
                {stories[currentStoryIndex].type === 'image' ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={stories[currentStoryIndex].src}
                      alt={stories[currentStoryIndex].title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <video
                    key={stories[currentStoryIndex].src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    <source src={stories[currentStoryIndex].src} type="video/mp4" />
                  </video>
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
                
                {/* Story Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-center">
                  <h2 className="text-white text-2xl font-bold mb-2">🎉 {stories[currentStoryIndex].title}</h2>
                  <p className="text-gray-200 text-sm">
                    Haz de tus momentos especiales una experiencia única en Cielo y Tierra
                  </p>
                </div>


              </div>
            </div>
          </div>

          {/* Recomendaciones del Chef */}
          <div className="py-6">
            <div className="px-4 mb-4">
              <h3 className="text-white text-lg font-bold">🍽️ ¡Hoy tenemos!</h3>
            </div>
            
            {chefRecommendations.length === 0 ? (
              // Empty state when no products are available
              <div className="px-4">
                <div className="bg-gray-800 rounded-2xl p-8 text-center">
                  <div className="text-6xl mb-4">🍽️</div>
                  <h4 className="text-white text-lg font-bold mb-2">¡Menú en preparación!</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Nuestro chef está preparando deliciosas opciones para ti. 
                    <br />
                    Vuelve pronto para descubrir nuestros platos del día.
                  </p>
                </div>
              </div>
            ) : chefRecommendations.length <= 4 ? (
              // Grid layout for 4 or fewer items
              <div className="px-4">
                <div className="grid grid-cols-2 gap-3">
                  {chefRecommendations.map((dish) => (
                    <div 
                      key={dish.id} 
                      className="bg-gray-800 rounded-2xl p-3 relative cursor-pointer hover:bg-gray-700 transition-colors"
                      onClick={() => setSelectedDish(dish)}
                    >
                      <div className="w-full h-24 relative mb-3">
                        <Image
                          src={dish.image}
                          alt={dish.name}
                          fill
                          className="object-contain rounded-lg"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-white text-sm font-bold leading-tight">{dish.name}</h4>
                        <p className="text-gray-400 text-xs leading-tight">{dish.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-2.5 h-2.5 ${
                                  i < Math.floor(dish.rating) ? 'text-primary-yellow' : 'text-gray-600'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="text-gray-400 text-xs ml-1">{dish.rating}</span>
                          </div>
                          <p className="text-primary-red font-bold text-sm">${dish.price.toLocaleString('es-CO')}</p>
                        </div>
                        
                        <button 
                          onClick={(event) => {
                            event.stopPropagation() // Prevent modal from opening
                            addToCart(dish)
                            // Show toast - no need for button text change since we have toast
                            showAddToCartToast(`${dish.name} agregado al carrito 🛒`)
                          }}
                          className="w-full bg-primary-red text-white py-2 rounded-lg text-xs font-medium hover:bg-primary-red/90 transition-colors"
                        >
                          Pedir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Horizontal scroll layout for more than 4 items
              <div className="overflow-x-auto">
                <div className="flex space-x-3 px-4 pb-2">
                  {chefRecommendations.map((dish) => (
                    <div 
                      key={dish.id} 
                      className="bg-gray-800 rounded-2xl p-3 relative flex-shrink-0 w-40 cursor-pointer hover:bg-gray-700 transition-colors"
                      onClick={() => setSelectedDish(dish)}
                    >
                      <div className="w-full h-24 relative mb-3">
                        <Image
                          src={dish.image}
                          alt={dish.name}
                          fill
                          className="object-contain rounded-lg"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-white text-sm font-bold leading-tight">{dish.name}</h4>
                        <p className="text-gray-400 text-xs leading-tight">{dish.description}</p>
                        
                        <div className="flex items-center space-x-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-2.5 h-2.5 ${
                                i < Math.floor(dish.rating) ? 'text-primary-yellow' : 'text-gray-600'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="text-gray-400 text-xs ml-1">{dish.rating}</span>
                        </div>
                        
                        <p className="text-primary-red font-bold text-sm text-center mb-2">${dish.price.toLocaleString('es-CO')}</p>
                        
                        <button 
                          onClick={(event) => {
                            event.stopPropagation() // Prevent modal from opening
                            addToCart(dish)
                            // Show toast - no need for button text change since we have toast
                            showAddToCartToast(`${dish.name} agregado al carrito 🛒`)
                          }}
                          className="w-full bg-primary-red text-white py-2 rounded-lg text-xs font-medium hover:bg-primary-red/90 transition-colors"
                        >
                          Pedir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Separator Line */}
          <div className="px-4 py-6">
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-700"></div>
              <div className="mx-4 flex space-x-2">
                <div className="w-2 h-2 bg-primary-yellow rounded-full"></div>
                <div className="w-2 h-2 bg-primary-red rounded-full"></div>
                <div className="w-2 h-2 bg-primary-yellow rounded-full"></div>
              </div>
              <div className="flex-grow border-t border-gray-700"></div>
            </div>
          </div>

          {/* Cards Section */}
          <div className="px-4 pb-8">
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
              {/* Celebra tus Momentos Card - Instagram Stories Style */}
              <div className="flex-shrink-0 w-80 h-52 bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform relative">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                  <Image
                    src="/Celebracion1.jpg"
                    alt="Celebración"
                    fill
                    className="object-cover opacity-40"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-red/60 via-primary-red/30 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
                </div>
                
                {/* Content Overlay */}
                <div className="relative z-10 p-4 h-full flex flex-col justify-between">
                  {/* Top Section */}
                  <div className="flex items-center justify-end">
                    <div className="flex space-x-1">
                      <div className="text-primary-yellow text-lg">🎂</div>
                      <div className="text-primary-red text-lg">💕</div>
                      <div className="text-primary-yellow text-lg">🎉</div>
                    </div>
                  </div>
                  
                  {/* Middle Section */}
                  <div className="text-center">
                    <h4 className="text-white text-lg font-bold mb-2 drop-shadow-lg">Celebra tus Momentos</h4>
                    <div className="flex justify-center space-x-4 text-xs text-white/90">
                      <span className="bg-white/20 px-2 py-1 rounded-full">Cumpleaños</span>
                      <span className="bg-white/20 px-2 py-1 rounded-full">Aniversarios</span>
                      <span className="bg-white/20 px-2 py-1 rounded-full">Corporativo</span>
                    </div>
                  </div>
                  
                  {/* Bottom Section */}
                  <button 
                    onClick={() => setShowReservation(true)}
                    className="w-full bg-white/90 backdrop-blur-sm text-gray-900 py-3 rounded-xl text-sm font-bold hover:bg-white transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Reservar Ahora</span>
                  </button>
                </div>
              </div>

              {/* Quiénes Somos Card - Business Profile Style */}
              <div className="flex-shrink-0 w-80 h-52 bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 rounded-lg hover:scale-105 transition-transform relative overflow-hidden">
                {/* Decorative Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-4 left-4 w-32 h-32 border border-primary-yellow rounded-full"></div>
                  <div className="absolute bottom-4 right-4 w-24 h-24 border border-primary-red rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-primary-yellow/30 rounded-full"></div>
                </div>
                
                <div className="relative z-10 p-4 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-yellow/20 to-primary-red/20 rounded-xl flex items-center justify-center border border-primary-yellow/30">
                        <svg className="w-6 h-6 text-primary-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-white text-base font-bold">Cielo y Tierra</h4>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-green-400 text-xs">Activo desde 2020</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-primary-yellow text-xl">⭐</div>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex space-x-4 mb-4">
                    <div className="text-center">
                      <div className="text-primary-yellow text-lg font-bold">4.9</div>
                      <div className="text-gray-400 text-xs">Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-primary-red text-lg font-bold">500+</div>
                      <div className="text-gray-400 text-xs">Eventos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-primary-yellow text-lg font-bold">100%</div>
                      <div className="text-gray-400 text-xs">Familiar</div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-300 text-xs leading-relaxed mb-4 flex-1">
                    Una familia que conecta cielo y tierra en cada experiencia culinaria. Fusionamos tradición con sabores únicos para crear momentos inolvidables.
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-primary-yellow/20 text-primary-yellow px-2 py-1 rounded-full text-xs">#TradiciónFamiliar</span>
                    <span className="bg-primary-red/20 text-primary-red px-2 py-1 rounded-full text-xs">#SaboresÚnicos</span>
                    <span className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full text-xs">#CieloyTierra</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        </div>
      </div>
      
      {/* Bottom Navigation - OUTSIDE content, fixed to viewport */}
      <BottomNavigation />

      {/* Dish Detail Modal using new Modal component */}
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
          <div className="space-y-4">
            {/* Dish Image */}
            <div className="h-48 relative rounded-lg overflow-hidden">
              <Image
                src={selectedDish.image}
                alt={selectedDish.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Price and Rating Row */}
            <div className="flex items-center justify-between">
              <p className="text-primary-red text-2xl font-bold">
                ${selectedDish.price.toLocaleString('es-CO')}
              </p>
              
              {/* Rating */}
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(selectedDish.rating) ? 'text-primary-yellow' : 'text-gray-600'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-gray-400 text-sm ml-1">{selectedDish.rating}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed">{selectedDish.description}</p>

            {/* Category Badge */}
            <div className="flex justify-center">
              <span className="bg-primary-yellow/20 text-primary-yellow px-3 py-1 rounded-full text-xs font-medium">
                {selectedDish.category}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="bg-gray-700/30 rounded-lg p-4">
              <label className="block text-white text-sm font-semibold mb-3 text-center">Cantidad</label>
              <div className="flex items-center justify-center space-x-6">
                <button 
                  onClick={() => setDishQuantity(Math.max(1, dishQuantity - 1))}
                  className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-white font-bold text-xl hover:bg-gray-600 transition-colors"
                >
                  -
                </button>
                <span className="text-white text-2xl font-bold min-w-[3rem] text-center">
                  {dishQuantity.toString().padStart(2, '0')}
                </span>
                <button 
                  onClick={() => setDishQuantity(dishQuantity + 1)}
                  className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-white font-bold text-xl hover:bg-gray-600 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total Price */}
            <div className="bg-primary-red/10 border border-primary-red/20 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Total:</span>
                <span className="text-primary-red text-xl font-bold">
                  ${(selectedDish.price * dishQuantity).toLocaleString('es-CO')}
                </span>
              </div>
            </div>

            {/* Order Button */}
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
              className="w-full bg-primary-red hover:bg-primary-red/90 text-white py-4 rounded-lg text-lg font-bold transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5-5m6 5v6a1 1 0 11-2 0v-6m2 0V9a1 1 0 112 0v4M9 9v10a1 1 0 01-2 0V9a1 1 0 012 0z" />
              </svg>
              <span>Agregar al Carrito</span>
            </button>
          </div>
        )}
      </Modal>

      {/* Reservation Modal using new Modal component */}
      <Modal 
        isOpen={showReservation}
        onClose={() => setShowReservation(false)}
        title="Reservar Celebración"
        size="md"
      >
        <div className="space-y-4">
          {/* Customer Name */}
          <div>
            <label className="block text-white text-sm font-semibold mb-2">Nombre Completo *</label>
            <input 
              type="text"
              value={reservationData.customerName}
              onChange={(e) => setReservationData({...reservationData, customerName: e.target.value})}
              placeholder="Tu nombre completo"
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-yellow placeholder-gray-400"
            />
          </div>

          {/* Customer Phone */}
          <div>
            <label className="block text-white text-sm font-semibold mb-2">Teléfono *</label>
            <input 
              type="tel"
              value={reservationData.customerPhone}
              onChange={(e) => setReservationData({...reservationData, customerPhone: e.target.value})}
              placeholder="3XX XXX XXXX"
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-yellow placeholder-gray-400"
            />
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-white text-sm font-semibold mb-2">Fecha *</label>
              <input 
                type="date"
                value={reservationData.date}
                onChange={(e) => setReservationData({...reservationData, date: e.target.value})}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-white text-sm font-semibold mb-2">Hora *</label>
              <input 
                type="time"
                value={reservationData.time}
                onChange={(e) => setReservationData({...reservationData, time: e.target.value})}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-yellow"
              />
            </div>
          </div>

          {/* Guests */}
          <div>
            <label className="block text-white text-sm font-semibold mb-2">Número de Invitados</label>
            <div className="flex items-center space-x-4">
              <button 
                type="button"
                onClick={() => setReservationData({...reservationData, guests: Math.max(1, reservationData.guests - 1)})}
                className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-white font-bold hover:bg-gray-600 transition-colors"
              >
                -
              </button>
              <span className="text-white text-lg font-bold min-w-[3rem] text-center">{reservationData.guests}</span>
              <button 
                type="button"
                onClick={() => setReservationData({...reservationData, guests: reservationData.guests + 1})}
                className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-white font-bold hover:bg-gray-600 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-white text-sm font-semibold mb-2">Tipo de Celebración *</label>
            <select
              value={reservationData.reason}
              onChange={(e) => setReservationData({...reservationData, reason: e.target.value})}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-yellow"
            >
              <option value="">Selecciona el tipo de evento</option>
              <option value="Cumpleaños">Cumpleaños</option>
              <option value="Aniversario">Aniversario</option>
              <option value="Reunión Familiar">Reunión Familiar</option>
              <option value="Evento Corporativo">Evento Corporativo</option>
              <option value="Graduación">Graduación</option>
              <option value="Baby Shower">Baby Shower</option>
              <option value="Despedida">Despedida</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-white text-sm font-semibold mb-2">Notas Adicionales</label>
            <textarea
              value={reservationData.notes}
              onChange={(e) => setReservationData({...reservationData, notes: e.target.value})}
              placeholder="Detalles especiales, alergias, decoración, etc..."
              rows={2}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-yellow placeholder-gray-400 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button 
            onClick={handleReservationSubmit}
            className="w-full bg-primary-yellow hover:bg-primary-yellow/90 text-gray-900 py-4 rounded-lg text-lg font-bold transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Confirmar Reservación</span>
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
    </>
  )
}
