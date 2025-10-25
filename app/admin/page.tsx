'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isClient, setIsClient] = useState(false)

  // Set client flag first
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Check if already logged in (only on client)
  useEffect(() => {
    if (!isClient) return
    const adminToken = localStorage.getItem('adminToken')
    if (adminToken === 'cielo-tierra-admin-2024') {
      window.location.href = '/admin/dashboard'
    }
  }, [isClient])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Simple authentication (in production, this should be server-side)
    if (credentials.username === 'admin' && credentials.password === 'cieloytierra2024') {
      localStorage.setItem('adminToken', 'cielo-tierra-admin-2024')
      window.location.href = '/admin/dashboard'
    } else {
      setError('Credenciales incorrectas')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-layer-base flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements - escalan en desktop */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] bg-primary-red/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] bg-primary-yellow/5 rounded-full blur-3xl"></div>
      </div>

      {/* Login Card with modal-like styling - Sistema de cajas responsive */}
      <div 
        className="bg-gradient-to-b from-layer-elevated to-layer-high rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 w-full max-w-sm md:max-w-md lg:max-w-lg relative animate-fadeIn"
        style={{ boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 -2px 0 rgba(255, 255, 255, 0.08), 0 12px 28px rgba(0, 0, 0, 0.7), 0 6px 12px rgba(0, 0, 0, 0.5)' }}
      >
        {/* Decorative header dots - crecen proporcionalmente */}
        <div className="flex justify-center space-x-1 md:space-x-1.5 mb-6 md:mb-7">
          <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-primary-red rounded-full" style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.4)' }}></div>
          <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-primary-yellow rounded-full" style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.4)' }}></div>
          <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-primary-red rounded-full" style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.4)' }}></div>
        </div>

        {/* Logo and Title - crece proporcionalmente */}
        <div className="text-center mb-6 md:mb-8">
          <div 
            className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 mx-auto mb-4 md:mb-5 relative bg-layer-mid rounded-full p-3 md:p-4"
            style={{ boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.5), inset 0 -1px 0 rgba(255, 255, 255, 0.05), 0 2px 8px rgba(0, 0, 0, 0.4)' }}
          >
            <Image
              src="/Logo.png"
              alt="Cielo y Tierra"
              fill
              className="object-contain rounded-full"
            />
          </div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1 md:mb-2">
            Panel Administrativo
          </h1>
          <p className="text-gray-400 text-sm md:text-base font-medium">Cielo y Tierra</p>
        </div>

        {/* Login Form - reorganización con propósito */}
        <form onSubmit={handleLogin} className="space-y-4 md:space-y-5 lg:space-y-6">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-300 mb-2 md:mb-3">
              Usuario
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              className="w-full bg-layer-high rounded-lg md:rounded-xl px-3 md:px-4 py-2.5 md:py-3 lg:py-3.5 text-white text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary-red/50 transition-all duration-200 placeholder-gray-400"
              style={{ boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.5), inset 0 -1px 0 rgba(255, 255, 255, 0.03)' }}
              placeholder="Ingresa tu usuario"
              required
            />
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-300 mb-2 md:mb-3">
              Contraseña
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              className="w-full bg-layer-high rounded-lg md:rounded-xl px-3 md:px-4 py-2.5 md:py-3 lg:py-3.5 text-white text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary-red/50 transition-all duration-200 placeholder-gray-400"
              style={{ boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.5), inset 0 -1px 0 rgba(255, 255, 255, 0.03)' }}
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          {error && (
            <div 
              className="bg-gradient-to-b from-red-500/15 to-red-500/10 rounded-lg md:rounded-xl p-3 md:p-4 text-red-400 text-xs md:text-sm flex items-center space-x-2 md:space-x-3 animate-slideUpBounce"
              style={{ boxShadow: '0 -1px 0 rgba(255, 100, 100, 0.1), 0 4px 12px rgba(0, 0, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3)' }}
            >
              <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-b from-primary-red to-primary-red/90 text-white py-3 md:py-3.5 lg:py-4 rounded-lg md:rounded-xl font-bold text-sm md:text-base lg:text-lg hover:from-primary-red hover:to-primary-red/80 focus:outline-none focus:ring-2 focus:ring-primary-red/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-layer-lg hover:shadow-elevated-md transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden"
            style={{ boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 -1px 0 rgba(255, 255, 255, 0.06), 0 8px 24px rgba(0, 0, 0, 0.6)' }}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 md:h-5 md:w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Iniciando sesión...</span>
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        {/* Footer - spacing adaptativo */}
        <div className="mt-6 md:mt-8 pt-4 md:pt-6">
          <div className="h-px bg-layer-mid mb-4 md:mb-5"></div>
          <div className="text-center text-gray-500 text-xs md:text-sm">
            © 2025 Cielo y Tierra • Panel Administrativo
          </div>
        </div>
      </div>
    </div>
  )
}
