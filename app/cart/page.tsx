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

  const handleCheckout = () => {
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
    
    // Add order to admin panel
    addOrder(orderData)
    
    // Reset cart and form
    clearCart()
    setCustomerInfo({ name: '', phone: '', address: '', notes: '' })
    setShowCheckout(false)
    
    // Show success message
    alert('¡Pedido enviado exitosamente! Te contactaremos pronto.')
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white pb-20">
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
      </div>
    )
  }

  if (showCheckout) {
    return (
      <div className="min-h-screen bg-gray-900 text-white pb-20">
        {/* Header */}
        <div className="bg-gray-800 p-4 shadow-lg flex items-center">
          <button 
            onClick={() => setShowCheckout(false)}
            className="mr-4"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 flex justify-center">
            <div className="relative w-28 h-28">
              <Image
                src="/Logo.png"
                alt="Cielo y Tierra Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-bold mb-3 text-primary-yellow">Resumen del Pedido</h2>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                <div>
                  <span className="text-sm">{item.name}</span>
                  <span className="text-gray-400 text-xs ml-2">x{item.quantity}</span>
                </div>
                <span className="text-primary-red font-bold">${(item.price * item.quantity).toLocaleString('es-CO')}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-700">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-lg font-bold text-primary-red">${getTotalPrice().toLocaleString()}</span>
            </div>
          </div>

          {/* Customer Information Form */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-bold mb-4 text-primary-yellow">Información de Contacto</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre Completo *</label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-red"
                  placeholder="Tu nombre completo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Teléfono *</label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-red"
                  placeholder="Número de teléfono"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Dirección de Entrega *</label>
                <textarea
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-red h-20 resize-none"
                  placeholder="Dirección completa para la entrega"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Notas Especiales</label>
                <textarea
                  value={customerInfo.notes}
                  onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-red h-16 resize-none"
                  placeholder="Instrucciones especiales o comentarios"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleCheckout}
            disabled={!customerInfo.name || !customerInfo.phone || !customerInfo.address}
            className="w-full bg-primary-red text-white py-4 rounded-lg font-bold text-lg hover:bg-primary-red/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirmar Pedido - ${getTotalPrice().toLocaleString()}
          </button>
        </div>

        <BottomNavigation activeTab="Carrito" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Header */}
      <div className="bg-gray-800 p-4 shadow-lg">
        <h1 className="text-2xl font-bold text-center font-['Pacifico']">Carrito</h1>
      </div>

      {/* Cart Items */}
      <div className="p-4 space-y-4">
        {cart.map((item) => (
          <div key={item.id} className="bg-gray-800 rounded-lg p-4">
            <div className="flex space-x-4">
              {/* Product Image */}
              <div className="w-20 h-20 relative flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover rounded-lg"
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
                      className="w-8 h-8 bg-gray-700 rounded-md flex items-center justify-center hover:bg-gray-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    
                    <span className="text-lg font-bold min-w-[2rem] text-center">{item.quantity}</span>
                    
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-gray-700 rounded-md flex items-center justify-center hover:bg-gray-600 transition-colors"
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

      {/* Total and Checkout */}
      <div className="fixed bottom-20 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold">Total:</span>
          <span className="text-2xl font-bold text-primary-red">${getTotalPrice().toLocaleString()}</span>
        </div>
        
        <button
          onClick={() => setShowCheckout(true)}
          className="w-full bg-primary-red text-white py-3 rounded-lg font-bold text-lg hover:bg-primary-red/90 transition-colors"
        >
          Proceder al Pago
        </button>
      </div>

      <BottomNavigation activeTab="Carrito" />
    </div>
  )
}
