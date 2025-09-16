'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

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
  const router = useRouter()
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPageLoaded, setIsPageLoaded] = useState(true)
  const [activeCategory, setActiveCategory] = useState('desayunos')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'detailed' | 'simple'>('detailed')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isViewModeChanging, setIsViewModeChanging] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  useEffect(() => {
    // Asegurar que inicie con loading para mostrar skeletons
    setIsLoading(true)
    
    // Duración de skeletons loading
    const loadingTimer = setTimeout(() => {
      setIsLoading(false)
    }, 1800)

    return () => {
      clearTimeout(loadingTimer)
    }
  }, [])

  // Cleanup effect para restaurar scroll si el componente se desmonta
  useEffect(() => {
    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = 'unset'
    }
  }, [])

  // Haptic Feedback function
  const triggerHapticFeedback = () => {
    try {
      // Vibración suave para dispositivos móviles
      if ('vibrate' in navigator) {
        navigator.vibrate(50)
      }
      
      // Haptic feedback alternativo para iOS usando AudioContext
      if (typeof window !== 'undefined' && 'webkitAudioContext' in window) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext
        const audioContext = new AudioContext()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime)
        gainNode.gain.setValueAtTime(0.01, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05)
        
        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.05)
      }
    } catch (error) {
      // Haptic feedback not available, silently fail
    }
  }

  // Swipe gesture detection
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe || isRightSwipe) {
      const categories = Object.keys(menuCategories)
      const currentIndex = categories.indexOf(activeCategory)
      
      let newIndex = currentIndex
      
      if (isLeftSwipe && currentIndex < categories.length - 1) {
        newIndex = currentIndex + 1
      } else if (isRightSwipe && currentIndex > 0) {
        newIndex = currentIndex - 1
      }
      
      if (newIndex !== currentIndex) {
        changeCategory(categories[newIndex])
      }
    }
  }

  // Smooth category transition with haptic feedback
  const changeCategory = (newCategory: string) => {
    if (newCategory === activeCategory || isTransitioning) return
    
    // Trigger haptic feedback
    triggerHapticFeedback()
    
    // Start transition animation
    setIsTransitioning(true)
    
    // Change category after brief delay for smooth animation
    setTimeout(() => {
      setActiveCategory(newCategory)
      
      // Auto-center the active category in scroll
      setTimeout(() => {
        centerActiveCategory(newCategory)
      }, 50)
    }, 150)
    
    // End transition
    setTimeout(() => {
      setIsTransitioning(false)
    }, 300)
  }

  // Auto-center active category in horizontal scroll
  const centerActiveCategory = (categoryKey: string) => {
    const scrollContainer = document.getElementById('category-scroll')
    if (!scrollContainer) return
    
    const categoryButton = scrollContainer.querySelector(`button[data-category="${categoryKey}"]`)
    if (!categoryButton) return
    
    const containerWidth = scrollContainer.offsetWidth
    const buttonLeft = (categoryButton as HTMLElement).offsetLeft
    const buttonWidth = (categoryButton as HTMLElement).offsetWidth
    
    const targetScrollLeft = buttonLeft - (containerWidth / 2) + (buttonWidth / 2)
    
    scrollContainer.scrollTo({
      left: Math.max(0, targetScrollLeft),
      behavior: 'smooth'
    })
  }

  // Cambiar modo de vista con loading
  const changeViewMode = (newMode: 'detailed' | 'simple') => {
    if (newMode === viewMode || isViewModeChanging) return
    
    setIsViewModeChanging(true)
    
    // Mostrar skeletons por un momento para suavizar la transición
    setTimeout(() => {
      setViewMode(newMode)
      
      // Quitar skeletons después de mostrar el nuevo contenido
      setTimeout(() => {
        setIsViewModeChanging(false)
      }, 800)
    }, 150)
  }

  // Estructura completa del menú real
  const menuCategories = {
    desayunos: {
      name: 'Desayunos',
      sections: {
        especiales: {
          name: 'Especiales',
          dishes: [
            { id: 1, name: 'Huevos americanos', description: 'Huevos fritos con tocineta y tostadas', price: '9.500', image: '/Desayuno.png', ingredients: ['Huevos', 'Tocineta', 'Pan tostado', 'Mantequilla'] },
            { id: 2, name: 'Huevos napolitanos', description: 'Huevos con salsa napolitana y queso', price: '9.500', image: '/Desayuno.png', ingredients: ['Huevos', 'Salsa napolitana', 'Queso', 'Albahaca'] },
            { id: 3, name: 'Huevos rancheros', description: 'Huevos sobre tortilla con salsa ranchera', price: '8.000', image: '/Desayuno.png', ingredients: ['Huevos', 'Tortilla', 'Salsa ranchera', 'Aguacate'] },
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
        { id: 15, name: 'Punta de Anca', description: 'Delicioso corte de res a la parrilla, con papa cocinada, maduro y ensalada', price: '32k', image: '/Asados.png', ingredients: ['Carne de res premium', 'Papa cocinada', 'Plátano maduro', 'Ensalada'] },
        { id: 16, name: 'Churrasco', description: 'Lomo de res jugoso y tierno acompañado de papa cocinada, maduro y ensalada', price: '30k', image: '/Asados.png', ingredients: ['Lomo de res', 'Papa cocinada', 'Plátano maduro', 'Ensalada'] },
        { id: 17, name: 'Filete de Pollo', description: 'Acompañado de papas a la francesa y ensalada', price: '25k', image: '/Asados.png', ingredients: ['Pechuga de pollo', 'Papas francesas', 'Ensalada', 'Salsa especial'] }
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
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden'
    // Asegurar que el modal aparezca en el viewport actual
    document.body.style.position = 'fixed'
    document.body.style.top = `-${window.scrollY}px`
    document.body.style.width = '100%'
  }

  const closeDishModal = () => {
    setIsAnimating(true)
    // Restaurar todas las propiedades del body
    const scrollY = document.body.style.top
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    document.body.style.overflow = 'unset'
    // Restaurar posición de scroll
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY || '0') * -1)
    }
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
          {Object.entries(category.sections).map(([sectionKey, section]) => (
            <div key={sectionKey}>
              {renderSectionCard(section.name, section.dishes)}
            </div>
          ))}
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

  const getSectionImage = (sectionName: string) => {
    // Solo mostramos imágenes que realmente existen
    const availableImages: { [key: string]: string } = {
      'Asados': '/Asados.png',
      'Desayunos': '/Desayuno.png',
      'Especiales': '/Desayuno.png', // Usar Desayuno.png para subcategoría Especiales
      'Caseros': '/Desayuno.png'     // Usar Desayuno.png para subcategoría Caseros
      // Otras imágenes se añadirán cuando estén disponibles
    }
    return availableImages[sectionName] || null
  }

  // Filtrar platos por búsqueda
  const filterDishesBySearch = (dishes: Dish[]) => {
    if (!searchQuery.trim()) return dishes
    return dishes.filter(dish => 
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.ingredients.some(ingredient => 
        ingredient.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  }

  // Loading skeletons específicos para cada vista
  const SkeletonCardGrid = () => (
    <div className="mb-6">
      {/* Título de sección skeleton */}
      <div className="h-6 bg-gray-700 rounded w-32 mb-4 px-2 shimmer"></div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-md rounded-xl border border-gray-700/30 p-3 shadow-lg animate-pulse">
            {/* Imagen skeleton */}
            <div className="w-full h-24 bg-gradient-to-br from-gray-700 to-gray-600 rounded-lg mb-3 shimmer"></div>
            {/* Título skeleton */}
            <div className="h-3 bg-gray-600 rounded w-3/4 mb-1 shimmer"></div>
            {/* Precio skeleton */}
            <div className="flex items-center justify-between mt-2">
              <div className="h-4 bg-primary-yellow/60 rounded w-1/3 shimmer"></div>
              <div className="w-3 h-3 bg-gray-600 rounded shimmer"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const SkeletonListItems = () => (
    <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-md rounded-xl border border-gray-700/30 p-4 shadow-lg animate-pulse">
      {/* Header de sección skeleton */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-700/40">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-gray-700 rounded-lg shimmer"></div>
          <div className="h-4 bg-gray-700 rounded w-24 shimmer"></div>
        </div>
        <div className="w-4 h-4 bg-gray-700 rounded-full shimmer"></div>
      </div>
      
      {/* Items de lista skeleton */}
      <div className="space-y-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded-lg">
            <div className="flex-1">
              {/* Nombre del plato skeleton */}
              <div className="h-3 bg-gray-600 rounded w-32 mb-1 shimmer"></div>
              {/* Descripción skeleton */}
              <div className="h-2 bg-gray-700 rounded w-48 shimmer"></div>
            </div>
            <div className="flex items-center space-x-2 ml-3">
              {/* Precio skeleton */}
              <div className="h-3 bg-primary-yellow/60 rounded w-12 shimmer"></div>
              {/* Icono skeleton */}
              <div className="w-3 h-3 bg-gray-600 rounded shimmer"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const SkeletonSectionCard = () => (
    <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-md rounded-xl border border-gray-700/30 p-4 shadow-lg animate-pulse">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-700/40">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-gray-700 rounded-lg shimmer"></div>
          <div className="h-4 bg-gray-700 rounded w-24 shimmer"></div>
        </div>
        <div className="w-4 h-4 bg-gray-700 rounded-full shimmer"></div>
      </div>
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-2">
            <div className="flex-1">
              <div className="h-3 bg-gray-700 rounded w-32 mb-1 shimmer"></div>
              <div className="h-2 bg-gray-700 rounded w-48 shimmer"></div>
            </div>
            <div className="h-3 bg-gray-700 rounded w-12 shimmer"></div>
          </div>
        ))}
      </div>
    </div>
  )

  const SkeletonTabs = () => (
    <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide animate-pulse">
      {[...Array(7)].map((_, i) => (
        <div key={i} className="flex-shrink-0 h-8 bg-gray-700 rounded-full w-20 shimmer"></div>
      ))}
    </div>
  )

  // Vista Lista (actual - solo nombre y precio)
  const renderListView = (sectionName: string, dishes: Dish[]) => {
    const sectionImage = getSectionImage(sectionName)
    const filteredDishes = filterDishesBySearch(dishes)
    
    if (searchQuery.trim() && filteredDishes.length === 0) {
      return null
    }
    
    return (
      <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-md rounded-xl border border-gray-700/30 p-4 shadow-lg hover:border-primary-red/20 transition-all duration-300">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-700/40">
          <div className="flex items-center space-x-3">
            {sectionImage && (
              <div className="relative w-6 h-6 rounded-lg overflow-hidden bg-gradient-to-br from-gray-700 to-gray-600 flex-shrink-0">
                <Image
                  src={sectionImage}
                  alt={sectionName}
                  fill
                  className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary-red/20 to-primary-yellow/20"></div>
              </div>
            )}
            <h3 className="text-sm dm-sans-bold bg-gradient-to-r from-primary-red to-primary-yellow bg-clip-text text-transparent">
              {sectionName}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            {searchQuery.trim() && (
              <span className="text-xs text-primary-yellow dm-sans-semibold">
                {filteredDishes.length}
              </span>
            )}
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-primary-red to-primary-yellow opacity-60"></div>
          </div>
        </div>

        <div className="space-y-2">
          {filteredDishes.map((dish) => (
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
  }

  // Vista Cards (cuadros grandes con imágenes de platos)
  const renderCardsView = (sectionName: string, dishes: Dish[]) => {
    const filteredDishes = filterDishesBySearch(dishes)
    
    if (searchQuery.trim() && filteredDishes.length === 0) {
      return null
    }
    
    return (
      <div className="mb-6">
        <h3 className="text-lg dm-sans-bold bg-gradient-to-r from-primary-red to-primary-yellow bg-clip-text text-transparent mb-4 px-2">
          {sectionName}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredDishes.map((dish) => (
            <div
              key={dish.id}
              onClick={() => openDishModal(dish)}
              className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-md rounded-xl border border-gray-700/30 p-3 shadow-lg hover:border-primary-red/30 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl group"
            >
              {/* Imagen del plato */}
              <div className="relative w-full h-24 mb-3 rounded-lg overflow-hidden bg-gradient-to-br from-gray-700 to-gray-600">
                {dish.image ? (
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-red/20 to-primary-yellow/20">
                    <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11,13.5V21.5C11,22.6 10.1,23.5 9,23.5C7.9,23.5 7,22.6 7,21.5V13.5C7,12.4 7.9,11.5 9,11.5C10.1,11.5 11,12.4 11,13.5M13,1.5V21.5C13,22.6 13.9,23.5 15,23.5C16.1,23.5 17,22.6 17,21.5V1.5C17,0.4 16.1,-0.5 15,-0.5C13.9,-0.5 13,0.4 13,1.5M1,9.5V21.5C1,22.6 1.9,23.5 3,23.5C4.1,23.5 5,22.6 5,21.5V9.5C5,8.4 4.1,7.5 3,7.5C1.9,7.5 1,8.4 1,9.5M19,5.5V21.5C19,22.6 19.9,23.5 21,23.5C22.1,23.5 23,22.6 23,21.5V5.5C23,4.4 22.1,3.5 21,3.5C19.9,3.5 19,4.4 19,5.5Z"/>
                    </svg>
                  </div>
                )}
                {/* Gradiente overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              {/* Info del plato */}
              <div className="space-y-1">
                <h4 className="text-xs dm-sans-semibold text-gray-200 group-hover:text-primary-yellow transition-colors duration-200 line-clamp-2 leading-tight">
                  {dish.name}
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm dm-sans-bold text-primary-yellow">
                    ${dish.price}
                  </span>
                  <svg className="w-3 h-3 text-gray-500 group-hover:text-primary-red transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Función principal que elige entre vistas  
  const renderSectionCard = (sectionName: string, dishes: Dish[]) => {
    return viewMode === 'detailed' 
      ? renderCardsView(sectionName, dishes)
      : renderListView(sectionName, dishes)
  }



  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Logo de fondo fijo - marca de agua real */}
      <div 
        className="pointer-events-none"
        style={{ 
          position: 'fixed',
          top: '50vh',
          left: '50vw',
          transform: 'translate(-50%, -50%)',
          width: '320px',
          height: '320px',
          opacity: 0.18,
          zIndex: 1
        }}
      >
        <Image
          src="/Logo.png"
          alt="Cielo y Tierra"
          width={320}
          height={320}
          className="object-contain filter grayscale brightness-50"
          priority
        />
        {/* Efecto de glow muy sutil */}
        <div 
          className="absolute inset-0 bg-gradient-radial from-primary-red/5 via-transparent to-transparent"
          style={{ pointerEvents: 'none' }}
        ></div>
      </div>
      
      {/* Contenido principal que flota sobre el logo */}
      <div className={`relative transition-all duration-700 ${
        isPageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`} style={{ zIndex: 10 }}>
        {/* Header */}
        <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800/50">
          <div className="safe-area-inset-top">
            <div className="flex items-center justify-between p-4">
              <Link href="/" className="group p-2">
                <svg className="w-6 h-6 text-primary-red group-hover:text-primary-yellow transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                </svg>
              </Link>
              
              <div className="flex flex-col items-center flex-1 space-y-2">
                <h1 className="text-2xl dm-sans-bold bg-gradient-to-r from-primary-red to-primary-yellow bg-clip-text text-transparent">
                  Nuestra Carta
                </h1>
                
                <div className="flex items-center space-x-3">
                  {/* Toggle de vista premium */}
                  <div className="flex items-center bg-gray-800/60 border border-gray-700/50 rounded-full p-1">
                    <button
                      onClick={() => changeViewMode('detailed')}
                      disabled={isViewModeChanging}
                      className={`flex items-center px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                        viewMode === 'detailed'
                          ? 'bg-primary-red text-white shadow-lg'
                          : 'text-gray-400 hover:text-gray-200'
                      } ${isViewModeChanging ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                      </svg>
                      Cards
                    </button>
                    <button
                      onClick={() => changeViewMode('simple')}
                      disabled={isViewModeChanging}
                      className={`flex items-center px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                        viewMode === 'simple'
                          ? 'bg-primary-red text-white shadow-lg'
                          : 'text-gray-400 hover:text-gray-200'
                      } ${isViewModeChanging ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                      </svg>
                      Lista
                    </button>
                  </div>
                  
                  {/* Búsqueda inteligente */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar platos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-32 h-7 bg-gray-800/60 border border-gray-700/50 rounded-full px-3 py-1 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary-red/50 focus:bg-gray-800/80 transition-all duration-300 dm-sans"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      {searchQuery.trim() ? (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="w-4 h-4 rounded-full bg-gray-600 hover:bg-primary-red flex items-center justify-center transition-colors duration-200"
                        >
                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                          </svg>
                        </button>
                      ) : (
                        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Espacio en blanco para balancear el layout */}
              <div className="w-10"></div>
            </div>
          </div>
        </div>

      {/* Navegación de categorías premium */}
      <div className="relative z-10 py-3">
        {isLoading ? (
          <div className="px-4">
            <SkeletonTabs />
          </div>
        ) : (
          <div className="relative">
            {/* Gradientes de fade para indicar scroll */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none"></div>
            
            {/* Container de categorías con scroll mejorado */}
            <div 
              id="category-scroll"
              className="flex space-x-2 overflow-x-auto pb-2 px-4 scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {Object.entries(menuCategories).map(([key, category]) => (
                <button
                  key={key}
                  data-category={key}
                  onClick={() => changeCategory(key)}
                  disabled={isTransitioning}
                  className={`flex-shrink-0 px-3 py-1 rounded-full text-xs dm-sans-medium whitespace-nowrap transition-all duration-300 ${
                    activeCategory === key
                      ? 'bg-gradient-to-r from-primary-red to-primary-yellow text-white shadow-md'
                      : 'bg-gray-800/40 text-gray-400 hover:text-white hover:bg-gray-700/60'
                  } ${isTransitioning ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'}`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contenido del menú con swipe gestures */}
      <div 
        id="menu-content" 
        className="px-4 pb-8"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {isLoading || isViewModeChanging ? (
          <div className="space-y-4">
            {viewMode === 'detailed' ? (
              <SkeletonCardGrid />
            ) : (
              <SkeletonListItems />
            )}
          </div>
        ) : (
          <div className={`transition-all duration-300 ${
            isTransitioning 
              ? 'opacity-0 transform translate-x-2 scale-98' 
              : 'opacity-100 transform translate-x-0 scale-100'
          }`}>
            {renderCategoryContent()}
          </div>
        )}
      </div>

      {/* Modal de detalles del plato */}
      {isModalOpen && selectedDish && (
        <div 
          className={`z-[60] ${isAnimating ? 'modal-overlay-exit' : 'modal-overlay-enter'}`}
          style={{ 
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 60
          }}
        >
          {/* Overlay */}
          <div 
            className="bg-black/80 backdrop-blur-sm"
            onClick={closeDishModal}
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%' 
            }}
          />
          
          {/* Modal */}
          <div 
            className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 max-w-sm w-full border border-gray-700/50 shadow-2xl ${isAnimating ? 'modal-content-exit' : 'modal-content-enter'}`}
            style={{ 
              position: 'relative',
              maxHeight: '85vh',
              overflowY: 'auto',
              zIndex: 61,
              transform: 'translate3d(0, 0, 0)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={closeDishModal}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-700/80 hover:bg-primary-red/80 transition-colors duration-300 flex items-center justify-center shadow-lg backdrop-blur-sm border border-gray-600/50"
              style={{ zIndex: 70 }}
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
            
            {/* Contenido del modal */}
            <div className="space-y-4">
              {/* Imagen del producto */}
              <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gradient-to-br from-gray-700 to-gray-600 mb-4">
                {selectedDish.image ? (
                  <Image
                    src={selectedDish.image}
                    alt={selectedDish.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-red/20 to-primary-yellow/20">
                    <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11,13.5V21.5C11,22.6 10.1,23.5 9,23.5C7.9,23.5 7,22.6 7,21.5V13.5C7,12.4 7.9,11.5 9,11.5C10.1,11.5 11,12.4 11,13.5M13,1.5V21.5C13,22.6 13.9,23.5 15,23.5C16.1,23.5 17,22.6 17,21.5V1.5C17,0.4 16.1,-0.5 15,-0.5C13.9,-0.5 13,0.4 13,1.5M1,9.5V21.5C1,22.6 1.9,23.5 3,23.5C4.1,23.5 5,22.6 5,21.5V9.5C5,8.4 4.1,7.5 3,7.5C1.9,7.5 1,8.4 1,9.5M19,5.5V21.5C19,22.6 19.9,23.5 21,23.5C22.1,23.5 23,22.6 23,21.5V5.5C23,4.4 22.1,3.5 21,3.5C19.9,3.5 19,4.4 19,5.5Z"/>
                    </svg>
                  </div>
                )}
                {/* Gradiente overlay para mejor contraste */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              
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
    </div>
  )
}
