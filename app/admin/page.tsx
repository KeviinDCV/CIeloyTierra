'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { getDeviceId, getAdminToken, setAdminToken } from '@/lib/adminClientUtils'

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isClient, setIsClient] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

  // Set client flag first
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Check if already logged in and verify session (only on client)
  useEffect(() => {
    if (!isClient) return
    
    // Set a timeout immediately to prevent infinite loading on mobile
    const fallbackTimeout = setTimeout(() => {
      console.log('Session check timeout - showing login form')
      setCheckingSession(false)
    }, 3000) // 3 second timeout for mobile
    
    const checkSession = async () => {
      try {
        const token = getAdminToken()
        const deviceId = getDeviceId()
        
        if (!token || !deviceId) {
          clearTimeout(fallbackTimeout)
          setCheckingSession(false)
          return
        }
        
        // Set a timeout for the fetch request
        const controller = new AbortController()
        const fetchTimeout = setTimeout(() => {
          controller.abort()
        }, 2500) // Abort fetch after 2.5 seconds
        
        try {
          // Verify session with server
          const response = await fetch('/api/admin/session/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deviceId, token }),
            signal: controller.signal
          })
          
          clearTimeout(fetchTimeout)
          clearTimeout(fallbackTimeout)
          
          if (!response.ok) {
            throw new Error('Verification failed')
          }
          
          const data = await response.json()
          
          if (data.valid) {
            window.location.href = '/admin/dashboard'
            return
          } else {
            // Invalid session, remove token
            localStorage.removeItem('adminToken')
          }
        } catch (fetchError: any) {
          clearTimeout(fetchTimeout)
          clearTimeout(fallbackTimeout)
          
          // If it's an abort error, just show login form
          if (fetchError.name === 'AbortError') {
            console.log('Fetch aborted due to timeout')
          } else {
            console.error('Error verifying session:', fetchError)
          }
          // Remove token on error to allow login
          localStorage.removeItem('adminToken')
        }
      } catch (error) {
        clearTimeout(fallbackTimeout)
        console.error('Error in checkSession:', error)
        // Remove token on error to allow login
        localStorage.removeItem('adminToken')
      } finally {
        clearTimeout(fallbackTimeout)
        setCheckingSession(false)
      }
    }
    
    checkSession()
  }, [isClient])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const deviceId = getDeviceId()
      
      if (!deviceId) {
        setError('Error: No se pudo obtener el ID del dispositivo')
        setIsLoading(false)
        return
      }
      
      const response = await fetch('/api/admin/session/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
          deviceId
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Error al iniciar sesión')
        setIsLoading(false)
        return
      }

      // Save token
      setAdminToken(data.token)
      
      // Redirect to dashboard
      window.location.href = '/admin/dashboard'
    } catch (error) {
      console.error('Login error:', error)
      setError('Error de conexión. Por favor intenta de nuevo.')
      setIsLoading(false)
    }
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-layer-base flex items-center justify-center p-4 relative overflow-hidden">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-red mx-auto mb-4"></div>
          <p className="text-gray-400">Verificando sesión...</p>
        </div>
      </div>
    )
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
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full bg-layer-high rounded-lg md:rounded-xl px-3 md:px-4 py-2.5 md:py-3 lg:py-3.5 pr-10 md:pr-12 text-white text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary-red/50 transition-all duration-200 placeholder-gray-400"
                style={{ boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.5), inset 0 -1px 0 rgba(255, 255, 255, 0.03)' }}
                placeholder="Ingresa tu contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors focus:outline-none"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? (
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
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
            © 2026 Cielo y Tierra • Panel Administrativo
          </div>
        </div>
      </div>
    </div>
  )
}
