'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Dish {
  id: number
  name: string
  description: string
  price: string
  image?: string
  ingredients: string[]
}

type Category = {
  id: string
  name: string
  dishes: Dish[]
}

export default function MenuPage() {
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPageLoaded, setIsPageLoaded] = useState(false)

  useEffect(() => {
    // Animación de entrada después de montar el componente
    const timer = setTimeout(() => {
      setIsPageLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Datos de prueba - después será manejado por Notion
  const asadosDishes: Dish[] = [
    {
      id: 1,
      name: 'Punta de Anca',
      description: 'Jugoso corte de carne asado a la parrilla con condimentos especiales',
      price: '32k',
      image: '/dishes/punta-anca.jpg', // Placeholder - después será real
      ingredients: ['Carne de res premium', 'Sal de mar', 'Pimienta negra', 'Hierbas aromáticas'],
    },
    {
      id: 2,
      name: 'Churrasco',
      description: 'Clásico churrasco argentino con chimichurri casero',
      price: '30k',
      image: '/dishes/churrasco.jpg', // Placeholder
      ingredients: ['Carne de res', 'Chimichurri', 'Sal parrillera', 'Ajo'],
    },
    {
      id: 3,
      name: 'Filete de Pollo',
      description: 'Tierno filete de pollo grillado con especias secretas',
      price: '25k',
      image: '/dishes/filete-pollo.jpg', // Placeholder
      ingredients: ['Pechuga de pollo', 'Especias secretas', 'Aceite de oliva', 'Limón'],
    }
  ]

  const openDishModal = (dish: Dish) => {
    setSelectedDish(dish)
    setIsModalOpen(true)
    setIsAnimating(false)
  }

  const closeDishModal = () => {
    setIsAnimating(true)
    // Esperar a que termine la animación antes de cerrar
    setTimeout(() => {
      setIsModalOpen(false)
      setSelectedDish(null)
      setIsAnimating(false)
    }, 300)
  }

  return (
    <div className={`min-h-screen bg-black text-white relative overflow-hidden transition-all duration-700 ${
      isPageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
    }`}>
      {/* Logo de fondo más visible */}
      <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-80 h-80 opacity-15 rotate-12">
          <Image
            src="/Logo.png"
            alt="Logo Background"
            fill
            className="object-contain filter brightness-75"
          />
        </div>
      </div>

      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800/50">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center space-x-2 group">
            <svg className="w-6 h-6 text-primary-red group-hover:text-primary-yellow transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors duration-300 font-elegant">Volver</span>
          </Link>
          
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10">
              <Image src="/Logo.png" alt="Logo" fill className="object-contain" />
            </div>
            <h1 className="text-lg font-display font-semibold bg-gradient-to-r from-primary-red to-primary-yellow bg-clip-text text-transparent">
              Nuestra Carta
            </h1>
          </div>
          
          <div className="w-8" />
        </div>
      </div>

      {/* Título de la categoría */}
      <div className="relative z-10 pt-6 pb-4">
        <h2 className="text-4xl font-display font-bold text-center bg-gradient-to-r from-primary-red to-primary-yellow bg-clip-text text-transparent mb-2">
          Asados
        </h2>
        <p className="text-center text-gray-400 font-elegant text-sm">
          Carnes premium a la parrilla
        </p>
      </div>

      {/* Scroll horizontal de platos */}
      <div className="relative z-10 px-4 pb-20">
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide custom-scrollbar">
          {asadosDishes.map((dish, index) => (
            <div
              key={dish.id}
              onClick={() => openDishModal(dish)}
              className="flex-shrink-0 w-64 bg-gradient-to-b from-gray-900/90 to-gray-800/90 rounded-2xl overflow-hidden shadow-2xl border border-gray-700/30 backdrop-blur-sm cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-primary-red/20 hover:border-primary-red/50 group"
            >
              {/* Imagen del plato */}
              <div className="relative h-40 bg-gradient-to-br from-gray-700 to-gray-800 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Placeholder para imagen */}
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-red/30 to-primary-yellow/30 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-primary-red" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.1 13.34l2.83-2.83L12.93 12l2.83-2.83-1.41-1.41L11.52 10.6 8.69 7.76 6.35 10.1l1.75 3.24zM13 2L3 6v2.17l10 5.83V22h2V6l8-4h-10z"/>
                    </svg>
                  </div>
                </div>
                {/* Indicador de hover */}
                <div className="absolute top-3 right-3 w-8 h-8 bg-primary-red/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 z-20">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              </div>
              
              {/* Información del plato */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-display font-semibold text-white group-hover:text-primary-yellow transition-colors duration-300">
                    {dish.name}
                  </h3>
                  <span className="text-xl font-bold text-primary-yellow">
                    ${dish.price}
                  </span>
                </div>
                <p className="text-gray-400 text-xs font-elegant leading-relaxed mb-3 line-clamp-2">
                  {dish.description}
                </p>
                
                {/* Call to action sutil */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-elegant">
                    Toca para detalles
                  </span>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary-red to-primary-yellow flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Indicador de scroll */}
        <div className="flex justify-center mt-4">
          <div className="flex space-x-2">
            {asadosDishes.map((_, index) => (
              <div key={index} className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-red to-primary-yellow opacity-70"></div>
            ))}
          </div>
          <p className="text-xs text-gray-500 font-elegant ml-4">← Desliza para ver más →</p>
        </div>
      </div>

      {/* Modal de detalles del plato */}
      {isModalOpen && selectedDish && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isAnimating ? 'modal-overlay-exit' : 'modal-overlay-enter'}`}>
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeDishModal}
          />
          
          {/* Modal */}
          <div className={`relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 max-w-sm w-full border border-gray-700/50 shadow-2xl ${isAnimating ? 'modal-content-exit' : 'modal-content-enter'}`}>
            {/* Botón cerrar */}
            <button
              onClick={closeDishModal}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-700/50 hover:bg-primary-red/50 transition-colors duration-300 flex items-center justify-center"
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
            
            {/* Contenido del modal */}
            <div className="space-y-4">
              {/* Título y precio */}
              <div className="text-center">
                <h2 className="text-2xl font-display font-bold bg-gradient-to-r from-primary-red to-primary-yellow bg-clip-text text-transparent mb-2">
                  {selectedDish.name}
                </h2>
                <span className="text-3xl font-bold text-primary-yellow">${selectedDish.price}</span>
              </div>
              
              {/* Descripción */}
              <div>
                <h3 className="text-lg font-elegant font-semibold text-white mb-2">Descripción</h3>
                <p className="text-gray-300 font-elegant leading-relaxed">{selectedDish.description}</p>
              </div>
              
              {/* Ingredientes */}
              {selectedDish.ingredients && (
                <div>
                  <h3 className="text-lg font-elegant font-semibold text-white mb-2">Ingredientes</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDish.ingredients.map((ingredient, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300 font-elegant border border-gray-600/50"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Botón de acción */}
              <button className="w-full bg-gradient-to-r from-primary-red to-primary-yellow hover:from-primary-yellow hover:to-primary-red text-white font-elegant font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                Agregar al Pedido
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer espaciado */}
      <div className="h-20" />
    </div>
  )
}
