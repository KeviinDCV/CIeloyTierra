'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import BottomNavigation from '../../components/BottomNavigation'
import { useAppData } from '../../lib/AppDataContext'

export default function MenuPage() {
  const { products, addToCart, categories } = useAppData()
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0)
  const [selectedDish, setSelectedDish] = useState<any>(null)
  const [dishQuantity, setDishQuantity] = useState(1)
  const [randomizedProducts, setRandomizedProducts] = useState<any[]>([])

  useEffect(() => {
    setIsLoaded(true)
    // Set default category to first available category
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].name)
    }
  }, [categories, selectedCategory])

  // Randomize products for carousel
  useEffect(() => {
    if (products.length > 0) {
      const shuffled = [...products].sort(() => Math.random() - 0.5)
      setRandomizedProducts(shuffled)
    }
  }, [products])

  // Auto-rotate carousel
  useEffect(() => {
    if (randomizedProducts.length > 1) {
      const interval = setInterval(() => {
        setCurrentCarouselIndex((prev) => (prev + 1) % randomizedProducts.length)
      }, 3000) // Change every 3 seconds
      
      return () => clearInterval(interval)
    }
  }, [randomizedProducts.length])

  // Get category names for the buttons
  const categoryNames = categories.map(cat => cat.name)
  
  // Filter products by selected category
  const filteredProducts = products.filter(product => 
    product.category.toLowerCase() === selectedCategory.toLowerCase()
  )
  
  // Get featured product for the hero card
  const featuredProduct = products.find(product => product.featured) || products[0]

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

        {/* Product Carousel */}
        {randomizedProducts.length > 0 ? (
          <div className="mx-6 mb-6">
            <div 
              className="bg-gray-800 rounded-3xl p-6 relative overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
              onClick={() => {
                setSelectedDish(randomizedProducts[currentCarouselIndex])
                setDishQuantity(1)
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-red/20 to-primary-yellow/20 rounded-full -translate-y-8 translate-x-8"></div>
              
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-white text-xl font-bold">
                      {randomizedProducts[currentCarouselIndex]?.name}
                    </h3>
                    <div className="ml-2 w-2 h-2 bg-primary-red rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    {randomizedProducts[currentCarouselIndex]?.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-gray-400 text-sm mr-2">desde</span>
                      <span className="text-white text-2xl font-bold">
                        ${randomizedProducts[currentCarouselIndex]?.price.toLocaleString('es-CO')}
                      </span>
                    </div>
                    
                    {/* Carousel indicators */}
                    <div className="flex space-x-1">
                      {randomizedProducts.slice(0, Math.min(5, randomizedProducts.length)).map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentCarouselIndex % Math.min(5, randomizedProducts.length)
                              ? 'bg-primary-red'
                              : 'bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="w-24 h-24 relative ml-4">
                  <Image
                    src={randomizedProducts[currentCarouselIndex]?.image || '/placeholder-food.jpg'}
                    alt={randomizedProducts[currentCarouselIndex]?.name || 'Producto'}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>
              
              {/* Click indicator */}
              <div className="absolute bottom-2 right-2 text-gray-500 text-xs">
                👆 Toca para ver más
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-6 mb-6">
            <div className="bg-gray-800 rounded-3xl p-6 text-center">
              <p className="text-gray-400 text-sm">
                No hay productos disponibles.
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Los administradores pueden agregar productos desde el panel.
              </p>
            </div>
          </div>
        )}

        {/* Meal Categories */}
        <div className="px-6 mb-6">
          <h3 className="text-white text-lg font-bold mb-4">Categorías</h3>
          {categories.length > 0 ? (
            <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    selectedCategory === category.name
                      ? 'bg-primary-red text-white shadow-lg'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-2xl p-6 text-center">
              <p className="text-gray-400 text-sm">
                No hay categorías disponibles.
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Los administradores pueden agregar categorías desde el panel.
              </p>
            </div>
          )}
        </div>

        {/* Category Products Section */}
        <div className="px-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-bold">
              {selectedCategory || 'Productos'}
            </h3>
            <button className="text-primary-red text-sm font-medium">Ver Más</button>
          </div>
          
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {filteredProducts.map((item) => (
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
                      ${item.price.toLocaleString('es-CO')}
                    </span>
                    <button 
                      onClick={() => {
                        addToCart(item)
                        // Simple feedback
                        const button = event?.target as HTMLButtonElement
                        if (button) {
                          button.textContent = '✓ Agregado'
                          setTimeout(() => {
                            button.textContent = 'Pedir'
                          }, 1000)
                        }
                      }}
                      className="bg-primary-red text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-primary-red/90 transition-colors"
                    >
                      Pedir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-2xl p-6 text-center">
              <p className="text-gray-400 text-sm">
                No hay productos disponibles en la categoría "{selectedCategory}".
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Los administradores pueden agregar productos desde el panel.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Product Detail Modal */}
      {selectedDish && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-gray-800 rounded-3xl w-full max-w-sm relative overflow-hidden animate-slideUpBounce">
            {/* Header with back button */}
            <div className="absolute top-4 left-4 z-20">
              <button 
                onClick={() => setSelectedDish(null)}
                className="w-10 h-10 bg-black/20 rounded-xl flex items-center justify-center backdrop-blur-sm"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>

            {/* Product Image */}
            <div className="h-80 relative">
              <Image
                src={selectedDish.image || '/placeholder-food.jpg'}
                alt={selectedDish.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="p-6">
              <h2 className="text-white text-2xl font-bold mb-2">{selectedDish.name}</h2>
              <p className="text-primary-red text-3xl font-bold mb-1">
                ${selectedDish.price.toLocaleString('es-CO')}
              </p>
              <p className="text-gray-400 text-sm mb-4">{selectedDish.description}</p>

              {/* Rating */}
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(selectedDish.rating) ? 'text-primary-yellow' : 'text-gray-600'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-gray-400 text-sm ml-2">{selectedDish.rating}</span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between mb-6">
                <button 
                  onClick={() => setDishQuantity(Math.max(1, dishQuantity - 1))}
                  className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-white font-bold text-xl hover:bg-gray-600 transition-colors"
                >
                  -
                </button>
                <span className="text-white text-2xl font-bold px-4">{dishQuantity.toString().padStart(2, '0')}</span>
                <button 
                  onClick={() => setDishQuantity(dishQuantity + 1)}
                  className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-white font-bold text-xl hover:bg-gray-600 transition-colors"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button 
                onClick={() => {
                  addToCart(selectedDish, dishQuantity)
                  setSelectedDish(null)
                  setDishQuantity(1)
                }}
                className="w-full bg-primary-red hover:bg-primary-red/90 text-white py-4 rounded-lg text-lg font-bold transition-colors"
              >
                Agregar al Carrito
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
