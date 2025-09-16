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
  const [activeCategory, setActiveCategory] = useState('desayunos')

  useEffect(() => {
    // Animación de entrada después de montar el componente
    const timer = setTimeout(() => {
      setIsPageLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Estructura completa del menú real
  const menuCategories = {
    desayunos: {
      name: 'Desayunos',
      sections: {
        especiales: {
          name: 'Especiales',
          dishes: [
            { id: 1, name: 'Huevos americanos', description: 'Huevos fritos con tocineta y tostadas', price: '9.500', ingredients: ['Huevos', 'Tocineta', 'Pan tostado', 'Mantequilla'] },
            { id: 2, name: 'Huevos napolitanos', description: 'Huevos con salsa napolitana y queso', price: '9.500', ingredients: ['Huevos', 'Salsa napolitana', 'Queso', 'Albahaca'] },
            { id: 3, name: 'Huevos rancheros', description: 'Huevos sobre tortilla con salsa ranchera', price: '8.000', ingredients: ['Huevos', 'Tortilla', 'Salsa ranchera', 'Aguacate'] },
            { id: 4, name: 'Huevos queso y tocineta', description: 'Revueltos con queso y tocineta crujiente', price: '9.000', ingredients: ['Huevos', 'Queso', 'Tocineta', 'Cebollín'] },
            { id: 5, name: 'Omeleth ranchero', description: 'Omelette estilo ranchero con vegetales', price: '9.000', ingredients: ['Huevos', 'Pimentón', 'Cebolla', 'Tomate'] },
            { id: 6, name: 'Omeleth jamón y queso', description: 'Clásico omelette con jamón y queso derretido', price: '8.000', ingredients: ['Huevos', 'Jamón', 'Queso', 'Hierbas'] }
          ]
        },
        caseros: {
          name: 'Caseros',
          dishes: [
            { id: 7, name: 'Pericos + Arepa', description: 'Huevos pericos tradicionales con arepa', price: '6.000', ingredients: ['Huevos', 'Tomate', 'Cebolla', 'Arepa'] },
            { id: 8, name: 'Cacerola + arepa', description: 'Cacerola de huevos con arepa fresca', price: '5.000', ingredients: ['Huevos', 'Arepa', 'Sal', 'Aceite'] },
            { id: 9, name: 'Rancheros + arepa', description: 'Huevos rancheros con arepa casera', price: '6.000', ingredients: ['Huevos', 'Arepa', 'Salsa', 'Cilantro'] },
            { id: 10, name: 'Revueltos + arepa', description: 'Huevos revueltos con arepa', price: '5.000', ingredients: ['Huevos', 'Arepa', 'Mantequilla', 'Sal'] },
            { id: 11, name: 'Calentado + cacerola', description: 'Calentado tradicional con cacerola', price: '9.000', ingredients: ['Arroz', 'Frijol', 'Huevo', 'Arepa'] },
            { id: 12, name: 'Calentado + pericos', description: 'Calentado con huevos pericos', price: '10.000', ingredients: ['Arroz', 'Frijol', 'Huevos pericos', 'Arepa'] },
            { id: 13, name: 'Calentado + carne', description: 'Calentado con carne desmechada', price: '10.000', ingredients: ['Arroz', 'Frijol', 'Carne', 'Arepa'] },
            { id: 14, name: 'Carne de res + patacón y arepa', description: 'Carne jugosa con patacón y arepa', price: '10.000', ingredients: ['Carne de res', 'Patacón', 'Arepa', 'Guacamole'] }
          ]
        }
      }
    },
    asados: {
      name: 'Asados',
      dishes: [
        { id: 15, name: 'Punta de Anca', description: 'Delicioso corte de res a la parrilla, con papa cocinada, maduro y ensalada', price: '32k', ingredients: ['Carne de res premium', 'Papa cocinada', 'Plátano maduro', 'Ensalada'] },
        { id: 16, name: 'Churrasco', description: 'Lomo de res jugoso y tierno acompañado de papa cocinada, maduro y ensalada', price: '30k', ingredients: ['Lomo de res', 'Papa cocinada', 'Plátano maduro', 'Ensalada'] },
        { id: 17, name: 'Filete de Pollo', description: 'Acompañado de papas a la francesa y ensalada', price: '25k', ingredients: ['Pechuga de pollo', 'Papas francesas', 'Ensalada', 'Salsa especial'] }
      ]
    },
    menu_especial: {
      name: 'Menu Especial',
      dishes: [
        { id: 18, name: 'Sancocho de Gallina', description: 'Acompañado de gallina a la criolla o asada. Arroz blanco y ensalada', price: '20k', ingredients: ['Gallina criolla', 'Verduras', 'Arroz blanco', 'Ensalada'] },
        { id: 19, name: 'Tilapia Frita', description: 'Acompañado de sancocho del día, Tostada de plátano, arroz, ensalada y limonada', price: '20k', ingredients: ['Tilapia fresca', 'Sancocho', 'Patacón', 'Arroz', 'Ensalada'] }
      ]
    },
    cielitos: {
      name: 'Cielitos',
      dishes: [
        { id: 20, name: 'Costillas BBQ', description: 'Acompañadas de papas a la francesa, ensalada y salsa de la casa', price: '27k', ingredients: ['Costillas de cerdo', 'Salsa BBQ', 'Papas francesas', 'Ensalada'] },
        { id: 21, name: 'Chuleta Valluna', description: 'Acompañada de papas a la francesa y ensalada', price: '20k', ingredients: ['Chuleta de cerdo', 'Papas francesas', 'Ensalada', 'Salsa criolla'] },
        { id: 22, name: 'Filete de Pollo en Salsa de Queso', description: 'Acompañado de papas a la francesa y ensalada', price: '26k', ingredients: ['Filete de pollo', 'Salsa de queso', 'Papas francesas', 'Ensalada'] }
      ]
    },
    bebidas: {
      name: 'Bebidas',
      dishes: [
        { id: 23, name: 'Gaseosa Personal', description: 'Refrescante bebida gaseosa', price: '4k', ingredients: ['Bebida carbonatada'] },
        { id: 24, name: 'Gatorade', description: 'Bebida hidratante deportiva', price: '5k', ingredients: ['Bebida isotónica'] },
        { id: 25, name: 'Jugo Hit', description: 'Jugo de frutas natural', price: '4k', ingredients: ['Jugo de frutas'] },
        { id: 26, name: 'Agua', description: 'Agua purificada', price: '3k', ingredients: ['Agua mineral'] },
        { id: 27, name: 'Cerveza Aguila', description: 'Cerveza nacional premium', price: '6k', ingredients: ['Cerveza'] },
        { id: 28, name: 'Cerveza Poker', description: 'Cerveza tradicional', price: '6k', ingredients: ['Cerveza'] },
        { id: 29, name: 'Cerveza Heineken', description: 'Cerveza importada premium', price: '6k', ingredients: ['Cerveza premium'] }
      ]
    },
    jugos: {
      name: 'Jugos Naturales',
      dishes: [
        { id: 30, name: 'Mora', description: 'Jugo natural de mora fresca', price: '6k', ingredients: ['Mora natural', 'Agua', 'Azúcar'] },
        { id: 31, name: 'Mango', description: 'Jugo natural de mango', price: '6k', ingredients: ['Mango natural', 'Agua', 'Azúcar'] },
        { id: 32, name: 'Maracuya', description: 'Jugo natural de maracuyá', price: '6k', ingredients: ['Maracuyá natural', 'Agua', 'Azúcar'] },
        { id: 33, name: 'En Leche', description: 'Jugos naturales preparados con leche', price: '8k', ingredients: ['Fruta natural', 'Leche', 'Azúcar'] }
      ]
    },
    micheladas: {
      name: 'Micheladas',
      dishes: [
        { id: 34, name: 'Soda', description: 'Michelada con soda', price: '7k', ingredients: ['Soda', 'Limón', 'Sal', 'Especias'] },
        { id: 35, name: 'Cerveza', description: 'Michelada con cerveza', price: '8k', ingredients: ['Cerveza', 'Limón', 'Sal', 'Especias'] }
      ]
    }
  }

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

  const renderCategoryContent = () => {
    const category = menuCategories[activeCategory as keyof typeof menuCategories]
    
    if (!category) return null

    // Para desayunos que tiene subcategorías
    if (activeCategory === 'desayunos' && 'sections' in category) {
      return (
        <div className="space-y-4">
          {Object.entries(category.sections).map(([sectionKey, section]) => 
            renderSectionCard(section.name, section.dishes)
          )}
        </div>
      )
    }

    // Para categorías simples sin subcategorías
    if ('dishes' in category) {
      return (
        <div>
          {renderSectionCard(category.name, category.dishes)}
        </div>
      )
    }

    return null
  }

  const renderSectionCard = (sectionName: string, dishes: Dish[]) => (
    <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-md rounded-xl border border-gray-700/30 p-4 shadow-lg hover:border-primary-red/20 transition-all duration-300">
      {/* Header de la sección */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-700/40">
        <h3 className="text-sm dm-sans-bold bg-gradient-to-r from-primary-red to-primary-yellow bg-clip-text text-transparent">
          {sectionName}
        </h3>
        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-primary-red to-primary-yellow opacity-60"></div>
      </div>

      {/* Lista de platos delicada */}
      <div className="space-y-2">
        {dishes.map((dish) => (
          <div
            key={dish.id}
            onClick={() => openDishModal(dish)}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-800/30 cursor-pointer transition-all duration-200 group"
          >
            <div className="flex-1 min-w-0">
              <h4 className="text-xs dm-sans-semibold text-gray-200 group-hover:text-primary-yellow transition-colors duration-200 truncate">
                {dish.name}
              </h4>
              <p className="text-xs text-gray-400 dm-sans leading-tight mt-0.5 line-clamp-1">
                {dish.description}
              </p>
            </div>
            <div className="flex items-center space-x-2 ml-3">
              <span className="text-xs dm-sans-bold text-primary-yellow">
                ${dish.price}
              </span>
              <svg className="w-3 h-3 text-gray-500 group-hover:text-primary-red transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  )



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
          <Link href="/" className="group p-2">
            <svg className="w-6 h-6 text-primary-red group-hover:text-primary-yellow transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </Link>
          
          <h1 className="text-2xl dm-sans-bold bg-gradient-to-r from-primary-red to-primary-yellow bg-clip-text text-transparent">
            Nuestra Carta
          </h1>
          
          <div className="w-8" />
        </div>
      </div>

      {/* Navegación de categorías */}
      <div className="relative z-10 px-4 py-3">
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {Object.entries(menuCategories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs dm-sans-semibold transition-all duration-300 ${
                activeCategory === key
                  ? 'bg-gradient-to-r from-primary-red to-primary-yellow text-white shadow-lg'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Renderización dinámica según categoría */}
      <div className="relative z-10 px-4 pb-20">
        {renderCategoryContent()}
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
