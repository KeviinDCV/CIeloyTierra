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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-red/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-yellow/5 rounded-full blur-3xl"></div>
      </div>

      {/* Login Card with modal-like styling */}
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-sm shadow-2xl border border-gray-700/50 relative animate-fadeIn">
        {/* Decorative header dots */}
        <div className="flex justify-center space-x-1 mb-6">
          <div className="w-2 h-2 bg-primary-red rounded-full"></div>
          <div className="w-2 h-2 bg-primary-yellow rounded-full"></div>
          <div className="w-2 h-2 bg-primary-red rounded-full"></div>
        </div>

        {/* Logo and Title */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 relative bg-gray-700/50 rounded-full p-3">
            <Image
              src="/Logo.png"
              alt="Cielo y Tierra"
              fill
              className="object-contain rounded-full"
            />
          </div>
          <h1 className="text-xl font-bold text-white mb-1">
            Panel Administrativo
          </h1>
          <p className="text-gray-400 text-sm font-medium">Cielo y Tierra</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-2">
              Usuario
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary-red/60 focus:bg-gray-700/70 transition-all duration-200 placeholder-gray-400"
              placeholder="Ingresa tu usuario"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary-red/60 focus:bg-gray-700/70 transition-all duration-200 placeholder-gray-400"
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-xs flex items-center space-x-2 animate-slideUpBounce">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-red text-white py-2.5 rounded-lg font-medium text-sm hover:bg-primary-red/90 focus:outline-none focus:ring-2 focus:ring-primary-red/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-700/50">
          <div className="text-center text-gray-500 text-xs">
            © 2025
          </div>
        </div>
      </div>
    </div>
  )
}
