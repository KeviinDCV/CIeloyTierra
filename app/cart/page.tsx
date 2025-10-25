'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import BottomNavigation from '../../components/BottomNavigation'
import { useAppData } from '../../lib/AppDataContext'

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
      <div className="min-h-screen bg-layer-base text-white pb-20">
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

        {/* Empty Cart */}
        <div className="flex flex-col items-center justify-center h-96">
          <svg className="w-24 h-24 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7H6L5 9z" />
          </svg>
          <h2 className="text-xl text-gray-400 mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-500 text-center px-8 mb-6">Agrega algunos deliciosos platos para comenzar tu pedido</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-primary-red text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-red/90 transition-colors"
          >
            Volver al Menú
          </button>
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
      <div className="min-h-screen bg-layer-base text-white pb-20">
        {/* Header */}
        <div className="relative flex items-center justify-center p-6">
          <button 
            onClick={() => setShowCheckout(false)}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-layer-mid rounded-xl flex items-center justify-center hover:bg-layer-high transition-colors shadow-layer-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="relative w-28 h-28">
            <Image
              src="/Logo.png"
              alt="Cielo y Tierra Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="bg-layer-mid rounded-2xl p-5 shadow-layer-md">
            <h2 className="text-xl font-bold mb-4 text-white">Resumen del Pedido</h2>
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2">
                  <div>
                    <span className="text-white font-medium">{item.name}</span>
                    <span className="text-gray-400 text-sm ml-2">x{item.quantity}</span>
                  </div>
                  <span className="text-primary-red font-bold">${(item.price * item.quantity).toLocaleString('es-CO')}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-4 mt-4">
              <div className="absolute left-5 right-5 h-px bg-layer-high"></div>
              <span className="text-xl font-bold text-white">Total:</span>
              <span className="text-xl font-bold text-primary-red">${getTotalPrice().toLocaleString()}</span>
            </div>
          </div>

          {/* Customer Information Form */}
          <div className="bg-layer-mid rounded-2xl p-5 shadow-layer-md">
            <h2 className="text-xl font-bold mb-5 text-white">Información de Entrega</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Nombre Completo</label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  className="w-full bg-layer-high text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-yellow transition-all shadow-layer-sm"
                  placeholder="Tu nombre completo"
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  className="w-full bg-layer-high text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-yellow transition-all shadow-layer-sm"
                  placeholder="Número de teléfono"
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Dirección de Entrega</label>
                <textarea
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                  className="w-full bg-layer-high text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-yellow transition-all shadow-layer-sm h-20 resize-none"
                  placeholder="Dirección completa para la entrega"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleCheckout}
            disabled={!customerInfo.name || !customerInfo.phone || !customerInfo.address}
            className="w-full bg-primary-red text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-red/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            Confirmar Pedido - ${getTotalPrice().toLocaleString()}
          </button>
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
    <div className="min-h-screen bg-layer-base text-white pb-20 md:pb-0">
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

      {/* Layout responsive - columna única en mobile, 2 columnas en desktop */}
      <div className="max-w-sm mx-auto md:max-w-4xl lg:max-w-6xl md:grid md:grid-cols-3 lg:grid-cols-[1fr_400px] md:gap-6 lg:gap-8 md:px-6 lg:px-8">
        
        {/* Cart Items - columna principal */}
        <div className="p-4 md:p-0 md:col-span-2 lg:col-span-1 space-y-4">
        {cart.map((item) => (
          <div key={item.id} className="bg-gradient-to-b from-layer-high to-layer-mid rounded-lg p-4 shadow-layer-md hover:shadow-layer-lg transition-all duration-300">
            <div className="flex space-x-4">
              {/* Product Image */}
              <div className="w-20 h-20 relative flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain rounded-lg"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-white">{item.name}</h3>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                <p className="text-primary-red font-bold mb-3">${item.price.toLocaleString('es-CO')}</p>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-layer-high rounded-md flex items-center justify-center hover:bg-layer-elevated transition-colors shadow-layer-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    
                    <span className="text-lg font-bold min-w-[2rem] text-center">{item.quantity}</span>
                    
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-layer-high rounded-md flex items-center justify-center hover:bg-layer-elevated transition-colors shadow-layer-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                  
                  <span className="text-lg font-bold text-primary-yellow">
                    ${(item.price * item.quantity).toLocaleString('es-CO')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>

        {/* Total and Checkout - sidebar en desktop, fixed footer en mobile */}
        <div className="fixed md:sticky bottom-20 md:bottom-auto left-0 right-0 md:left-auto md:right-auto md:top-6 md:col-span-1 bg-gradient-to-b from-layer-elevated to-layer-high backdrop-blur-sm p-4 md:p-6 md:rounded-2xl shadow-elevated-md md:h-fit">
          <h3 className="hidden md:block text-xl font-bold mb-6 text-white">Resumen del Pedido</h3>
          
          <div className="flex md:flex-col justify-between md:space-y-4 items-center md:items-stretch mb-4 md:mb-6">
            <span className="text-lg md:text-base font-bold md:font-semibold text-gray-300">Total:</span>
            <span className="text-2xl md:text-3xl font-bold text-primary-red">${getTotalPrice().toLocaleString()}</span>
          </div>
          
          <button
            onClick={() => setShowCheckout(true)}
            className="w-full bg-primary-red text-white py-3 md:py-4 rounded-lg font-bold text-lg hover:bg-primary-red/90 transition-colors shadow-layer-md hover:shadow-layer-lg"
          >
            Completar Pedido
          </button>
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
