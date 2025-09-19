'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import BottomNavigation from '../../components/BottomNavigation'

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Stories data - images and videos
  const stories = [
    { id: 1, type: 'image', src: '/Celebracion1.jpg', title: 'Cumpleaños Especiales' },
    { id: 2, type: 'image', src: '/Celebracion2.jpg', title: 'Aniversarios Románticos' },
    { id: 3, type: 'image', src: '/Celebracion3.jpg', title: 'Reuniones Familiares' },
    { id: 4, type: 'image', src: '/Celebracion4.jpg', title: 'Celebraciones Corporativas' },
    { id: 5, type: 'image', src: '/Celebracion5.jpg', title: 'Momentos Únicos' },
    { id: 6, type: 'image', src: '/Celebracion6.jpg', title: 'Experiencias Especiales' },
    { id: 7, type: 'video', src: '/Cv1.mp4', title: 'Celebrando Juntos' },
    { id: 8, type: 'video', src: '/Cv2.mp4', title: 'Momentos de Alegría' },
    { id: 9, type: 'video', src: '/Cv3.mp4', title: 'Sabores y Sonrisas' },
    { id: 10, type: 'video', src: '/Cv4.mp4', title: 'Cielo y Tierra en Acción' }
  ]

  // Auto-advance stories every 6 seconds (optimized for Vercel loading)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStoryIndex((prev) => (prev + 1) % stories.length)
    }, 6000)

    return () => clearInterval(timer)
  }, [stories.length])

  const chefRecommendations = [
    {
      id: 1,
      name: 'Churrasco Premium',
      description: 'Lomo de res jugoso con papas y ensalada',
      price: 30.000,
      image: '/Logo.png',
      rating: 4.9
    },
    {
      id: 2,
      name: 'Costillas BBQ',
      description: 'Costillas con salsa especial de la casa',
      price: 27.000,
      image: '/Logo.png',
      rating: 4.8
    },
    {
      id: 3,
      name: 'Tilapia Celestial',
      description: 'Pescado fresco con sancocho del día',
      price: 20.000,
      image: '/Logo.png',
      rating: 4.7
    }
  ]



  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
        {/* Fondo sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-red/5 via-transparent to-primary-yellow/5 pointer-events-none" />
        
        <div className={`transition-all duration-700 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
        
        {/* Header con logo */}
        <div className="pt-4 pb-2">
          <div className="text-center">
            <div className="relative w-28 h-28 mx-auto">
              <Image 
                src="/Logo.png" 
                alt="Cielo y Tierra Logo" 
                fill 
                className="object-contain"
                priority 
              />
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="pb-24">
          
          {/* Stories Card - Unified Events & Moments */}
          <div className="px-4 py-6 relative">
            <div className="bg-gradient-to-br from-primary-red/10 via-primary-yellow/5 to-primary-red/10 rounded-3xl relative"
                 style={{
                   maskImage: 'linear-gradient(to top, transparent 0%, black 15%)',
                   WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 15%)'
                 }}>
              
              {/* Stories Progress Indicators */}
              <div className="absolute top-4 left-4 right-4 z-20 flex space-x-1">
                {stories.map((_, index) => (
                  <div
                    key={index}
                    className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                      index === currentStoryIndex 
                        ? 'bg-white' 
                        : index < currentStoryIndex 
                          ? 'bg-primary-yellow' 
                          : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              {/* Current Story Content */}
              <div className="relative h-80 overflow-hidden rounded-3xl">
                {stories[currentStoryIndex].type === 'image' ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={stories[currentStoryIndex].src}
                      alt={stories[currentStoryIndex].title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <video
                    key={stories[currentStoryIndex].src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    <source src={stories[currentStoryIndex].src} type="video/mp4" />
                  </video>
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
                
                {/* Story Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-center">
                  <h2 className="text-white text-2xl font-bold mb-2">🎉 {stories[currentStoryIndex].title}</h2>
                  <p className="text-gray-200 text-sm mb-4">
                    Haz de tus momentos especiales una experiencia única en Cielo y Tierra
                  </p>
                  <button className="bg-primary-red text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-primary-red/90 transition-colors">
                    Ver Eventos
                  </button>
                </div>


              </div>
            </div>
          </div>

          {/* Recomendaciones del Chef */}
          <div className="py-6">
            <div className="px-4 mb-4">
              <h3 className="text-white text-lg font-bold">🍽️ ¡Hoy tenemos!</h3>
            </div>
            
            {chefRecommendations.length <= 4 ? (
              // Grid layout for 4 or fewer items
              <div className="px-4">
                <div className="grid grid-cols-2 gap-3">
                  {chefRecommendations.map((dish) => (
                    <div key={dish.id} className="bg-gray-800 rounded-2xl p-3 relative">
                      <div className="w-full h-24 relative mb-3">
                        <Image
                          src={dish.image}
                          alt={dish.name}
                          fill
                          className="object-contain rounded-lg"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-white text-sm font-bold leading-tight">{dish.name}</h4>
                        <p className="text-gray-400 text-xs leading-tight">{dish.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-2.5 h-2.5 ${
                                  i < Math.floor(dish.rating) ? 'text-primary-yellow' : 'text-gray-600'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="text-gray-400 text-xs ml-1">{dish.rating}</span>
                          </div>
                          <p className="text-primary-red font-bold text-sm">${dish.price.toLocaleString()}</p>
                        </div>
                        
                        <button className="w-full bg-primary-red text-white py-2 rounded-lg text-xs font-medium hover:bg-primary-red/90 transition-colors">
                          Pedir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Horizontal scroll layout for more than 4 items
              <div className="overflow-x-auto">
                <div className="flex space-x-3 px-4 pb-2">
                  {chefRecommendations.map((dish) => (
                    <div key={dish.id} className="bg-gray-800 rounded-2xl p-3 relative flex-shrink-0 w-40">
                      <div className="w-full h-24 relative mb-3">
                        <Image
                          src={dish.image}
                          alt={dish.name}
                          fill
                          className="object-contain rounded-lg"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-white text-sm font-bold leading-tight">{dish.name}</h4>
                        <p className="text-gray-400 text-xs leading-tight">{dish.description}</p>
                        
                        <div className="flex items-center space-x-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-2.5 h-2.5 ${
                                i < Math.floor(dish.rating) ? 'text-primary-yellow' : 'text-gray-600'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="text-gray-400 text-xs ml-1">{dish.rating}</span>
                        </div>
                        
                        <p className="text-primary-red font-bold text-sm text-center mb-2">${dish.price.toLocaleString()}</p>
                        
                        <button className="w-full bg-primary-red text-white py-2 rounded-lg text-xs font-medium hover:bg-primary-red/90 transition-colors">
                          Pedir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sobre Nosotros */}
          <div className="px-4 py-6">
            <h3 className="text-white text-lg font-bold mb-4">🌟 Sobre Nosotros</h3>
            <div className="space-y-3">
              <div className="bg-gray-800 rounded-2xl p-4 flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-red/20 to-primary-yellow/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-primary-yellow" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-white text-sm font-semibold mb-1">Sabores Celestiales</h4>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    Fusionamos los mejores ingredientes con técnicas culinarias que elevan cada plato a una experiencia única.
                  </p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-2xl p-4 flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-red/20 to-primary-yellow/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-primary-red" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-white text-sm font-semibold mb-1">Calidez Terrenal</h4>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    Cada momento se convierte en un recuerdo especial. Somos el lugar donde tus celebraciones cobran vida.
                  </p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-2xl p-4 flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-red/20 to-primary-yellow/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-primary-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-white text-sm font-semibold mb-1">Más que un Restaurante</h4>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    Somos una familia que comparte contigo los sabores que conectan cielo y tierra en cada experiencia.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Reservas para Celebraciones */}
          <div className="px-4 py-6">
            <h3 className="text-white text-lg font-bold mb-4">🎊 Celebra tus Momentos Especiales</h3>
            <div className="bg-gradient-to-r from-primary-yellow/15 to-primary-red/15 rounded-2xl overflow-hidden">
              <div className="flex">
                {/* Content Side */}
                <div className="flex-1 p-6">
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    Hacemos que cada celebración sea inolvidable con un ambiente único y atención personalizada.
                  </p>
                  
                  {/* Event Types */}
                  <div className="space-y-2 mb-5">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary-yellow rounded-full"></div>
                      <span className="text-gray-300 text-xs">Cumpleaños & Aniversarios</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary-red rounded-full"></div>
                      <span className="text-gray-300 text-xs">Reuniones Familiares</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary-yellow rounded-full"></div>
                      <span className="text-gray-300 text-xs">Eventos Corporativos</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary-red rounded-full"></div>
                      <span className="text-gray-300 text-xs">Ocasiones Especiales</span>
                    </div>
                  </div>

                  <button className="w-full bg-primary-yellow text-gray-900 py-3 rounded-lg text-sm font-bold hover:bg-primary-yellow/90 transition-colors">
                    Reservar Celebración
                  </button>
                </div>

                {/* Image Side */}
                <div className="w-32 relative">
                  <div className="absolute inset-0 bg-gradient-to-l from-primary-yellow/30 via-primary-red/20 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl opacity-20">🎉</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        </div>
      </div>
      
      {/* Bottom Navigation - OUTSIDE content, fixed to viewport */}
      <BottomNavigation activeTab="Inicio" />
    </>
  )
}
