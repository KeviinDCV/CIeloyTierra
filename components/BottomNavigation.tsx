'use client'

import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

interface BottomNavigationProps {
  activeTab?: string
  onAdminTabChange?: (tab: string) => void
  adminActiveTab?: string
}

export default function BottomNavigation({ activeTab, onAdminTabChange, adminActiveTab }: BottomNavigationProps) {
  const router = useRouter()
  const pathname = usePathname()

  const isAdminPage = pathname.includes('/admin/dashboard')

  const getActiveTab = () => {
    if (activeTab) return activeTab
    
    // Auto-detect based on current path
    if (pathname === '/home') return 'Inicio'
    if (pathname === '/cart') return 'Carrito'
    if (pathname === '/menu') return 'Menú'
    return 'Inicio'
  }

  const currentTab = getActiveTab()

  const handleNavigate = (tab: string) => {
    switch (tab) {
      case 'Inicio':
        router.push('/home')
        break
      case 'Carrito':
        router.push('/cart')
        break
      case 'Menú':
        router.push('/menu')
        break
    }
  }

  const handleLogout = () => {
    // Remove admin token (matches the key used in login)
    localStorage.removeItem('adminToken')
    
    // Show confirmation and redirect
    setTimeout(() => {
      router.push('/admin')
    }, 100)
  }

  const handleAdminTabChange = (tab: string) => {
    if (onAdminTabChange) {
      onAdminTabChange(tab)
    }
  }

  if (isAdminPage) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-layer-elevated/98 backdrop-blur-md z-[9999] shadow-elevated-lg md:left-1/2 md:-translate-x-1/2 md:bottom-4 md:max-w-4xl lg:max-w-5xl md:rounded-2xl">
        <div className="flex items-center justify-around py-2.5 md:py-4 md:px-6 lg:px-8 relative">
          <button 
            onClick={() => handleAdminTabChange('overview')}
            className={`flex flex-col items-center space-y-1 transition-colors relative z-10 ${
              adminActiveTab === 'overview' ? 'text-primary-red' : 'text-gray-400 hover:text-white'
            }`}
          >
            {adminActiveTab === 'overview' && (
              <motion.div
                layoutId="admin-active-tab"
                className="absolute inset-0 bg-primary-red/10 rounded-xl -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs md:text-sm">Resumen</span>
          </button>
          
          <button 
            onClick={() => handleAdminTabChange('orders')}
            className={`flex flex-col items-center space-y-1 transition-colors relative z-10 ${
              adminActiveTab === 'orders' ? 'text-primary-red' : 'text-gray-400 hover:text-white'
            }`}
          >
            {adminActiveTab === 'orders' && (
              <motion.div
                layoutId="admin-active-tab"
                className="absolute inset-0 bg-primary-red/10 rounded-xl -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7H6L5 9z" />
            </svg>
            <span className="text-xs md:text-sm">Pedidos</span>
          </button>
          
          <button 
            onClick={() => handleAdminTabChange('products')}
            className={`flex flex-col items-center space-y-1 transition-colors relative z-10 ${
              adminActiveTab === 'products' ? 'text-primary-red' : 'text-gray-400 hover:text-white'
            }`}
          >
            {adminActiveTab === 'products' && (
              <motion.div
                layoutId="admin-active-tab"
                className="absolute inset-0 bg-primary-red/10 rounded-xl -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <span className="text-xs md:text-sm">Productos</span>
          </button>
          
          <button 
            onClick={() => handleAdminTabChange('categories')}
            className={`flex flex-col items-center space-y-1 transition-colors relative z-10 ${
              adminActiveTab === 'categories' ? 'text-primary-red' : 'text-gray-400 hover:text-white'
            }`}
          >
            {adminActiveTab === 'categories' && (
              <motion.div
                layoutId="admin-active-tab"
                className="absolute inset-0 bg-primary-red/10 rounded-xl -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span className="text-xs md:text-sm">Categorías</span>
          </button>

          <button 
            onClick={() => handleAdminTabChange('celebrations')}
            className={`flex flex-col items-center space-y-1 transition-colors relative z-10 ${
              adminActiveTab === 'celebrations' ? 'text-primary-red' : 'text-gray-400 hover:text-white'
            }`}
          >
            {adminActiveTab === 'celebrations' && (
              <motion.div
                layoutId="admin-active-tab"
                className="absolute inset-0 bg-primary-red/10 rounded-xl -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4M5 9h14a1 1 0 011 1v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7a1 1 0 011-1z" />
            </svg>
            <span className="text-xs md:text-sm">Eventos</span>
          </button>
          
          <button 
            onClick={handleLogout}
            className="flex flex-col items-center space-y-1 transition-colors text-red-400 hover:text-red-300"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-xs md:text-sm">Salir</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-layer-elevated/98 backdrop-blur-md z-[9999] shadow-elevated-lg md:left-1/2 md:-translate-x-1/2 md:bottom-4 md:max-w-md md:rounded-2xl">
      <div className="flex items-center justify-around py-3.5 md:py-4 md:px-4 relative">
        <button 
          onClick={() => handleNavigate('Inicio')}
          className={`flex flex-col items-center space-y-1 transition-colors relative z-10 ${
            currentTab === 'Inicio' ? 'text-primary-red' : 'text-gray-400 hover:text-white'
          }`}
        >
          {currentTab === 'Inicio' && (
            <motion.div
              layoutId="menu-active-tab"
              className="absolute inset-0 bg-primary-red/10 rounded-xl -z-10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span className="text-xs">Inicio</span>
        </button>
        
        <button 
          onClick={() => handleNavigate('Carrito')}
          className={`flex flex-col items-center space-y-1 transition-colors relative z-10 ${
            currentTab === 'Carrito' ? 'text-primary-red' : 'text-gray-400 hover:text-white'
          }`}
        >
          {currentTab === 'Carrito' && (
            <motion.div
              layoutId="menu-active-tab"
              className="absolute inset-0 bg-primary-red/10 rounded-xl -z-10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7H6L5 9z" />
          </svg>
          <span className="text-xs">Carrito</span>
        </button>
        
        <button 
          onClick={() => handleNavigate('Menú')}
          className={`flex flex-col items-center space-y-1 transition-colors relative z-10 ${
            currentTab === 'Menú' ? 'text-primary-red' : 'text-gray-400 hover:text-white'
          }`}
        >
          {currentTab === 'Menú' && (
            <motion.div
              layoutId="menu-active-tab"
              className="absolute inset-0 bg-primary-red/10 rounded-xl -z-10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-xs">Menú</span>
        </button>
      </div>
    </div>
  )
}
