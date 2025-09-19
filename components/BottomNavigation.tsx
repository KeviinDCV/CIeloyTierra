'use client'

import { useRouter, usePathname } from 'next/navigation'

interface BottomNavigationProps {
  activeTab?: string
}

export default function BottomNavigation({ activeTab }: BottomNavigationProps) {
  const router = useRouter()
  const pathname = usePathname()

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
        // TODO: Create cart page
        console.log('Navigate to cart')
        break
      case 'Menú':
        router.push('/menu')
        break
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm border-t border-gray-700 z-[9999] shadow-lg">
      <div className="flex items-center justify-around py-3">
        <button 
          onClick={() => handleNavigate('Inicio')}
          className={`flex flex-col items-center space-y-1 transition-colors ${
            currentTab === 'Inicio' ? 'text-primary-red' : 'text-gray-400 hover:text-white'
          }`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span className="text-xs">Inicio</span>
        </button>
        
        <button 
          onClick={() => handleNavigate('Carrito')}
          className={`flex flex-col items-center space-y-1 transition-colors ${
            currentTab === 'Carrito' ? 'text-primary-red' : 'text-gray-400 hover:text-white'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7H6L5 9z" />
          </svg>
          <span className="text-xs">Carrito</span>
        </button>
        
        <button 
          onClick={() => handleNavigate('Menú')}
          className={`flex flex-col items-center space-y-1 transition-colors ${
            currentTab === 'Menú' ? 'text-primary-red' : 'text-gray-400 hover:text-white'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-xs">Menú</span>
        </button>
      </div>
    </div>
  )
}
