'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import BottomNavigation from '../../components/BottomNavigation'

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState('Desayuno')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

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
        <div className="flex items-center justify-center p-6">
          <div className="relative w-16 h-16">
            <Image
              src="/Logo.png"
              alt="Cielo y Tierra Logo"
              fill
              className="object-contain"
            />
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
                  <button className="bg-primary-red text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-primary-red/90 transition-colors">
                    Pedir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}
