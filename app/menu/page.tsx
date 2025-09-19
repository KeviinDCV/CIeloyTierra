'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState('Desayuno')
  const [isLoaded, setIsLoaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleNavigateHome = () => {
    router.push('/')
  }

  const categories = ['Desayuno', 'Almuerzo', 'Cena']
  
  const popularItems = [
    {
      id: 1,
      name: 'Steak Premium',
      description: 'Jugoso corte premium',
      price: 25.99,
      rating: 4.8,
      image: '/Logo.png'
    },
    {
      id: 2,
      name: 'Pasta Especial',
      description: 'Con salsa de la casa',
      price: 18.50,
      rating: 4.6,
      image: '/Logo.png'
    },
    {
      id: 3,
      name: 'Ensalada Celestial',
      description: 'Mix de vegetales frescos',
      price: 15.00,
      rating: 4.5,
      image: '/Logo.png'
    },
    {
      id: 4,
      name: 'Pollo Terrenal',
      description: 'Con especias secretas',
      price: 20.99,
      rating: 4.7,
      image: '/Logo.png'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden pb-20">
      {/* Fondo sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-red/5 via-transparent to-primary-yellow/5 pointer-events-none" />
      
      <div className={`transition-all duration-700 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <button 
            onClick={handleNavigateHome}
            className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-gray-400 text-sm">Nuestra Carta</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-primary-red to-primary-yellow rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">CY</span>
            </div>
          </div>
        </div>

        {/* Featured Meal Card */}
        <div className="mx-6 mb-6">
          <div className="bg-gray-800 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-red/20 to-primary-yellow/20 rounded-full -translate-y-8 translate-x-8"></div>
            
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-white text-xl font-bold mb-2">
                  Especialidad del Chef
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Sabores celestiales y terrenales
                </p>
                <div className="flex items-center">
                  <span className="text-gray-400 text-sm mr-2">solo</span>
                  <span className="text-white text-2xl font-bold">
                    $22.<span className="text-lg">99</span>
                  </span>
                </div>
              </div>
              
              <div className="w-24 h-24 relative">
                <Image
                  src="/Logo.png"
                  alt="Especialidad"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Meal Categories */}
        <div className="px-6 mb-6">
          <h3 className="text-white text-lg font-bold mb-4">Categorías</h3>
          <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-primary-red text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
            <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-700 transition-colors flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Popular Now Section */}
        <div className="px-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-bold">Popular Ahora</h3>
            <button className="text-primary-red text-sm font-medium">Ver Más</button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {popularItems.map((item) => (
              <div key={item.id} className="bg-gray-800 rounded-2xl p-4 hover:bg-gray-700 transition-colors">
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
                    ${item.price}
                  </span>
                  <button className="bg-primary-red text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-primary-red/90 transition-colors">
                    Pedir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-6 mb-8">
          <div className="bg-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-bold mb-1">Cielo y Tierra</h4>
                <p className="text-gray-400 text-sm">Sabores únicos te esperan</p>
              </div>
              <button 
                onClick={handleNavigateHome}
                className="bg-primary-red text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-primary-red/90 transition-colors"
              >
                Inicio
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center justify-around py-3">
          <button 
            onClick={handleNavigateHome}
            className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-xs">Inicio</span>
          </button>
          
          <button className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
            </svg>
            <span className="text-xs">Carrito</span>
          </button>
          
          <button className="flex flex-col items-center space-y-1 text-primary-red">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-xs">Menú</span>
          </button>
          
          <button className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-xs">Favoritos</span>
          </button>
        </div>
      </div>
    </div>
  )
}
