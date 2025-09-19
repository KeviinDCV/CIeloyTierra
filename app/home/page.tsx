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
          <div className="px-4 py-6">
            <h3 className="text-white text-lg font-bold mb-4">👨‍🍳 Recomendaciones de Hoy</h3>
            <div className="space-y-4">
              {chefRecommendations.map((dish) => (
                <div key={dish.id} className="bg-gray-800 rounded-2xl p-4 flex items-center space-x-4">
                  <div className="w-16 h-16 relative flex-shrink-0">
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-white text-sm font-bold mb-1">{dish.name}</h4>
                    <p className="text-gray-400 text-xs mb-2">{dish.description}</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3 h-3 ${
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
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-primary-red font-bold text-sm">${dish.price.toLocaleString()}</p>
                    <button className="bg-primary-red text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-primary-red/90 transition-colors mt-1">
                      Pedir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sobre Nosotros */}
          <div className="px-4 py-6">
            <div className="bg-gray-800 rounded-2xl p-6">
              <h3 className="text-white text-lg font-bold mb-3">🌟 Sobre Nosotros</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                En Cielo y Tierra fusionamos los sabores celestiales con la calidez terrenal. 
                Cada plato cuenta una historia, cada momento se convierte en un recuerdo especial. 
                Somos más que un restaurante, somos el lugar donde tus celebraciones cobran vida.
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-red to-primary-yellow rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">CY</span>
                </div>
                <span className="text-gray-400 text-sm">Sabores que conectan cielo y tierra</span>
              </div>
            </div>
          </div>

          {/* Reservas para Celebraciones */}
          <div className="px-4 py-6">
            <div className="bg-gradient-to-r from-primary-yellow/20 to-primary-red/20 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-primary-yellow/30 to-primary-red/30 rounded-full -translate-y-6 -translate-x-6"></div>
              
              <div className="relative z-10">
                <h3 className="text-white text-lg font-bold mb-2">🎊 Celebra tus Momentos Especiales</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Cumpleaños, aniversarios, reuniones familiares... Hacemos que cada celebración sea inolvidable.
                </p>
                <button className="bg-primary-yellow text-gray-900 px-6 py-3 rounded-lg text-sm font-bold hover:bg-primary-yellow/90 transition-colors">
                  Reservar Celebración
                </button>
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
