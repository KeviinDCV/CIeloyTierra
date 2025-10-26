'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import BottomNavigation from '../../components/BottomNavigation'
import { useAppData } from '../../lib/AppDataContext'
import { OrganicBlob, CircleBorder, DecorativeDots, StylizedBadge, DiamondShape, PriceBadge } from '../../components/decorations'

export default function CartPage() {
  const { cart, updateCartQuantity, removeFromCart, clearCart, getCartTotal, addOrder } = useAppData()
  const [showCheckout, setShowCheckout] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  })
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // Toast function
  const showSuccessToast = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 4000) // Mostrar un poco más tiempo para que el usuario lea el mensaje
  }

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id)
      return
    }
    updateCartQuantity(id, newQuantity)
  }

  const removeItem = (id: number) => {
    removeFromCart(id)
  }

  const getTotalPrice = () => {
    return getCartTotal()
  }

  const handleCheckout = async () => {
    try {
      // Create order data
      const orderData = {
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerAddress: customerInfo.address,
        items: cart,
        total: getTotalPrice(),
        status: 'pending' as const,
        notes: customerInfo.notes
      }
      
      // Add order to Supabase
      await addOrder(orderData)
      
      // Reset cart and form
      clearCart()
      setCustomerInfo({ name: '', phone: '', address: '', notes: '' })
      setShowCheckout(false)
      
      // Show success toast
      showSuccessToast('¡Pedido enviado exitosamente! 🍽️ Te contactaremos pronto')
    } catch (error) {
      console.error('Error al enviar pedido:', error)
      showSuccessToast('Error al enviar el pedido. Por favor intenta de nuevo ⚠️')
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-layer-base text-white pb-20 relative overflow-hidden">
        {/* Decoraciones de fondo */}
        <OrganicBlob 
          color="cream" 
          size="lg" 
          position={{ top: '10%', right: '-12%' }} 
          opacity={0.08}
        />
        <OrganicBlob 
          color="yellow" 
          size="md" 
          position={{ bottom: '20%', left: '-10%' }} 
          opacity={0.06}
        />
        <CircleBorder 
          color="red" 
          size={140} 
          position={{ top: '35%', right: '10%' }} 
          opacity={0.12}
        />
        <DiamondShape 
          size={35} 
          color="yellow" 
          position={{ top: '20%', left: '15%' }} 
          rotation={45}
          opacity={0.15}
        />
        
        {/* Header */}
        <div className="relative flex items-center justify-center p-6">
          <DecorativeDots 
            color="yellow" 
            count={3} 
            position={{ top: '20px', left: 'calc(50% - 30px)' }} 
            spacing={6}
          />
          <div className="relative w-28 h-28">
            <Image
              src="/Logo.png"
              alt="Cielo y Tierra Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Empty Cart */}
        <div className="flex flex-col items-center justify-center h-96 px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-red/20 to-primary-yellow/20 rounded-full blur-2xl scale-150"></div>
            <div className="relative bg-layer-mid rounded-3xl p-8 shadow-layer-lg">
              <svg className="w-24 h-24 text-gray-600 mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7H6L5 9z" />
              </svg>
            </div>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-2xl font-bold text-white mb-2 mt-6"
          >
            Tu carrito está vacío
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-gray-400 text-center px-8 mb-6"
          >
            Agrega algunos deliciosos platos para comenzar tu pedido
          </motion.p>
          
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="bg-primary-red text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-red/90 transition-all shadow-layer-lg hover:shadow-glow-red flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Volver al Menú</span>
          </motion.button>
        </div>

        <BottomNavigation activeTab="Carrito" />

        {/* Success Toast */}
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

  if (showCheckout) {
    return (
      <div className="min-h-screen bg-layer-base text-white pb-20 relative overflow-hidden">
        {/* Decoraciones de fondo */}
        <OrganicBlob 
          color="cream" 
          size="lg" 
          position={{ top: '8%', right: '-12%' }} 
          opacity={0.08}
        />
        <OrganicBlob 
          color="yellow" 
          size="md" 
          position={{ bottom: '15%', left: '-10%' }} 
          opacity={0.06}
        />
        <CircleBorder 
          color="red" 
          size={150} 
          position={{ top: '30%', right: '8%' }} 
          opacity={0.12}
        />
        <DiamondShape 
          size={35} 
          color="yellow" 
          position={{ top: '18%', left: '12%' }} 
          rotation={45}
          opacity={0.15}
        />
        
        {/* Header */}
        <div className="relative flex items-center justify-center p-6">
          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowCheckout(false)}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-layer-mid rounded-xl flex items-center justify-center hover:bg-layer-high transition-colors shadow-layer-md hover:shadow-layer-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          
          <DecorativeDots 
            color="yellow" 
            count={3} 
            position={{ top: '20px', left: 'calc(50% - 30px)' }} 
            spacing={6}
          />
          
          <div className="relative w-28 h-28">
            <Image
              src="/Logo.png"
              alt="Cielo y Tierra Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-4 md:space-y-6 max-w-lg mx-auto relative z-10">
          {/* Order Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="bg-gradient-to-br from-layer-elevated to-layer-high rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-layer-lg relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-primary-red/15 to-primary-yellow/15 rounded-full -translate-y-8 translate-x-8"></div>
            
            <div className="hidden md:block">
              <DecorativeDots 
                color="yellow" 
                count={2} 
                size={4}
                position={{ top: '12px', right: '12px' }} 
                layout="horizontal"
                spacing={3}
              />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h2 className="text-lg md:text-xl font-bold text-white">Resumen del Pedido</h2>
                <StylizedBadge text="PEDIDO" variant="best" size="sm" />
              </div>
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 bg-layer-base/30 rounded-xl px-2.5 md:px-3 gap-2">
                  <div className="flex items-center space-x-1.5 md:space-x-2 flex-1 min-w-0">
                    <div className="w-1.5 h-1.5 bg-primary-yellow rounded-full flex-shrink-0"></div>
                    <div className="min-w-0">
                      <span className="text-white font-medium text-sm md:text-base truncate block">{item.name}</span>
                      <span className="text-gray-400 text-xs md:text-sm">x{item.quantity}</span>
                    </div>
                  </div>
                  <div className="bg-primary-red/20 border border-primary-red/30 rounded-lg px-2 py-0.5 md:py-1 flex-shrink-0">
                    <span className="text-primary-red font-bold text-xs md:text-sm whitespace-nowrap">${(item.price * item.quantity).toLocaleString('es-CO')}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-3 md:pt-4 mt-3 md:mt-4 border-t border-layer-base/50 gap-2">
              <span className="text-lg md:text-xl font-bold text-white">Total:</span>
              <div className="bg-gradient-to-r from-primary-red to-primary-yellow rounded-lg md:rounded-xl px-3 md:px-4 py-1.5 md:py-2 shadow-glow-red">
                <span className="text-xl md:text-2xl font-bold text-white">${getTotalPrice().toLocaleString()}</span>
              </div>
            </div>
            </div>
          </motion.div>

          {/* Customer Information Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="bg-gradient-to-br from-layer-elevated to-layer-high rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-layer-lg relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-primary-yellow/15 to-primary-red/15 rounded-full -translate-y-8 translate-x-8"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4 md:mb-5">
                <h2 className="text-lg md:text-xl font-bold text-white">Información de Entrega</h2>
                <svg className="w-5 h-5 md:w-6 md:h-6 text-primary-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="flex items-center space-x-2 text-white text-sm font-semibold mb-2">
                  <svg className="w-4 h-4 text-primary-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Nombre Completo</span>
                </label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  className="w-full bg-layer-base/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:bg-layer-base transition-all shadow-layer-sm border border-layer-base/50"
                  placeholder="Tu nombre completo"
                />
              </div>
              
              <div>
                <label className="flex items-center space-x-2 text-white text-sm font-semibold mb-2">
                  <svg className="w-4 h-4 text-primary-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Teléfono</span>
                </label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  className="w-full bg-layer-base/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:bg-layer-base transition-all shadow-layer-sm border border-layer-base/50"
                  placeholder="Número de teléfono"
                />
              </div>
              
              <div>
                <label className="flex items-center space-x-2 text-white text-sm font-semibold mb-2">
                  <svg className="w-4 h-4 text-primary-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Dirección de Entrega</span>
                </label>
                <textarea
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                  className="w-full bg-layer-base/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:bg-layer-base transition-all shadow-layer-sm h-24 resize-none border border-layer-base/50"
                  placeholder="Dirección completa para la entrega"
                />
              </div>
              
              {/* Tip badge */}
              <div className="bg-layer-base/40 border border-primary-yellow/20 rounded-xl p-3">
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-primary-yellow flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-300 text-xs">
                    Por favor incluye referencias para facilitar la entrega (color de puerta, edificio, etc.)
                  </p>
                </div>
              </div>
            </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCheckout}
            disabled={!customerInfo.name || !customerInfo.phone || !customerInfo.address}
            className="w-full bg-gradient-to-r from-primary-red to-primary-yellow text-white py-3 md:py-4 rounded-lg md:rounded-xl font-bold text-sm md:text-lg hover:shadow-glow-red transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-layer-lg flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="truncate">Confirmar Pedido - ${getTotalPrice().toLocaleString()}</span>
          </motion.button>
        </div>

        <BottomNavigation activeTab="Carrito" />

        {/* Success Toast */}
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

  return (
    <div className="min-h-screen bg-layer-base text-white pb-24 md:pb-8 relative overflow-hidden">
      {/* Decoraciones de fondo - Organic Blobs */}
      <OrganicBlob 
        color="cream" 
        size="lg" 
        position={{ top: '5%', right: '-15%' }} 
        opacity={0.08}
      />
      <OrganicBlob 
        color="yellow" 
        size="md" 
        position={{ top: '45%', left: '-10%' }} 
        opacity={0.06}
      />
      
      {/* Círculos decorativos */}
      <CircleBorder 
        color="red" 
        size={160} 
        position={{ top: '25%', right: '5%' }} 
        opacity={0.12}
      />
      <CircleBorder 
        color="yellow" 
        size={100} 
        position={{ bottom: '15%', left: '8%' }} 
        opacity={0.1}
      />
      
      {/* Diamantes decorativos */}
      <DiamondShape 
        size={40} 
        color="yellow" 
        position={{ top: '15%', left: '10%' }} 
        rotation={45}
        opacity={0.15}
      />
      <DiamondShape 
        size={30} 
        color="red" 
        position={{ top: '60%', right: '12%' }} 
        rotation={25}
        opacity={0.12}
      />
      
      {/* Header */}
      <div className="relative flex items-center justify-center p-6">
        <DecorativeDots 
          color="yellow" 
          count={3} 
          position={{ top: '20px', left: 'calc(50% - 30px)' }} 
          spacing={6}
        />
        <div className="relative w-28 h-28">
          <Image
            src="/Logo.png"
            alt="Cielo y Tierra Logo"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Layout responsive - columna única en mobile, 2 columnas en desktop */}
      <div className="max-w-sm mx-auto md:max-w-4xl lg:max-w-6xl md:grid md:grid-cols-3 lg:grid-cols-[1fr_400px] md:gap-6 lg:gap-8 md:px-6 lg:px-8 relative z-10">
        
        {/* Cart Items - columna principal */}
        <div className="px-4 pt-4 pb-32 md:p-0 md:pb-0 md:col-span-2 lg:col-span-1 space-y-4">
        {cart.map((item, index) => (
          <motion.div 
            key={item.id} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="bg-gradient-to-br from-layer-elevated via-layer-high to-layer-mid rounded-2xl p-3 md:p-4 shadow-layer-lg hover:shadow-elevated-md transition-all duration-300 relative overflow-hidden group"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-primary-red/10 to-primary-yellow/10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-300"></div>
            
            <DecorativeDots 
              color="yellow" 
              count={2} 
              size={3}
              position={{ top: '8px', left: '8px' }} 
              layout="horizontal"
              spacing={3}
            />
            
            <div className="flex space-x-3 md:space-x-4 relative z-10">
              {/* Product Image */}
              <div className="w-20 h-20 md:w-24 md:h-24 relative flex-shrink-0">
                {/* Círculo decorativo detrás de la imagen */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-accent-cream/15 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain rounded-lg relative z-10 drop-shadow-lg"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1 md:mb-2">
                  <div className="flex items-center space-x-1 md:space-x-2 flex-1 min-w-0">
                    <h3 className="font-bold text-white text-sm md:text-lg truncate">{item.name}</h3>
                    <div className="w-1.5 h-1.5 bg-primary-yellow rounded-full animate-pulse flex-shrink-0"></div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="w-7 h-7 md:w-8 md:h-8 bg-layer-base/50 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-500/20 transition-all duration-200 shadow-layer-sm flex-shrink-0 ml-2"
                  >
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <p className="text-gray-400 text-xs mb-2 line-clamp-1">{item.description}</p>
                
                {/* Price badge */}
                <div className="flex items-center mb-2 md:mb-3">
                  <div className="bg-primary-red/20 border border-primary-red/30 rounded-lg px-2 md:px-3 py-0.5 md:py-1">
                    <span className="text-primary-red font-bold text-xs md:text-sm">${item.price.toLocaleString('es-CO')}</span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 md:space-x-3 bg-layer-base/40 rounded-xl px-1.5 md:px-2 py-1 md:py-1.5 shadow-inner">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 md:w-8 md:h-8 bg-layer-elevated rounded-lg flex items-center justify-center hover:bg-primary-red hover:scale-110 transition-all duration-200 shadow-layer-sm text-white font-bold"
                    >
                      <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    
                    <span className="text-base md:text-lg font-bold min-w-[1.5rem] md:min-w-[2rem] text-center text-white">{item.quantity}</span>
                    
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 md:w-8 md:h-8 bg-layer-elevated rounded-lg flex items-center justify-center hover:bg-primary-red hover:scale-110 transition-all duration-200 shadow-layer-sm text-white font-bold"
                    >
                      <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Total badge with styled badge */}
                  <div className="flex flex-col md:flex-row items-end md:items-center md:space-x-1">
                    <span className="text-[10px] md:text-xs text-gray-400 leading-none mb-0.5 md:mb-0">Total:</span>
                    <div className="bg-gradient-to-r from-primary-yellow to-primary-red rounded-lg px-2 md:px-3 py-1 md:py-1.5 shadow-glow-yellow">
                      <span className="text-white font-bold text-xs md:text-base whitespace-nowrap">
                        ${(item.price * item.quantity).toLocaleString('es-CO')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        </div>

        {/* Total and Checkout - Card flotante */}
        <div className="fixed md:sticky bottom-24 md:bottom-auto left-4 right-4 md:left-auto md:right-auto md:top-6 md:col-span-1">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="bg-gradient-to-b from-layer-elevated to-layer-high backdrop-blur-sm shadow-layer-lg rounded-2xl relative overflow-hidden"
          >
            {/* Decoración - solo desktop */}
            <div className="hidden md:block absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-red/20 to-primary-yellow/20 rounded-full -translate-y-8 translate-x-8"></div>
            
            {/* Contenido - se reorganiza según el espacio */}
            <div className="p-4 md:p-6 relative z-10">
              
              {/* Header - solo desktop, prioridad baja */}
              <div className="hidden md:block mb-6">
                <h3 className="text-xl font-bold text-white mb-4">Resumen del Pedido</h3>
                <div className="bg-layer-base/40 rounded-xl p-3 border border-accent-cream/10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Total de items:</span>
                    <span className="text-white font-bold text-lg">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </div>
                </div>
              </div>
              
              {/* Total - siempre visible, se expande verticalmente en desktop */}
              <div className="flex items-center justify-between mb-4 md:flex-col md:items-stretch md:space-y-2">
                <span className="text-lg font-bold text-white md:text-base md:font-semibold md:text-gray-300">Total:</span>
                <span className="text-2xl md:text-3xl font-bold text-primary-red md:text-center">${getTotalPrice().toLocaleString()}</span>
              </div>
              
              {/* Botón - siempre visible, mismo peso */}
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full bg-primary-red text-white py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-primary-red/90 transition-colors shadow-layer-lg"
              >
                Completar Pedido
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <BottomNavigation activeTab="Carrito" />

      {/* Success Toast */}
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
