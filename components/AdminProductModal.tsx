'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Modal from './Modal'

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
  rating: number
  featured: boolean
}

interface AdminProductModalProps {
  isOpen: boolean
  onClose: () => void
  product?: Product | null
  onSave: (product: Omit<Product, 'id'> | Product) => void
}

export default function AdminProductModal({ isOpen, onClose, product, onSave }: AdminProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: 'Entrada',
    rating: 4.5,
    featured: false
  })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        rating: product.rating,
        featured: product.featured
      })
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        image: '',
        category: 'Entrada',
        rating: 4.5,
        featured: false
      })
    }
  }, [product])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (product) {
      onSave({ ...product, ...formData })
    } else {
      onSave(formData)
    }
    
    onClose()
  }

  return (
    <Modal 
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Editar Producto' : 'Agregar Producto'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        {/* Product Name */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
            Nombre del Producto *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-white focus:outline-none focus:border-primary-red focus:ring-2 focus:ring-primary-red/20"
            placeholder="Ej: Churrasco Premium"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
            Descripción *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-white focus:outline-none focus:border-primary-red focus:ring-2 focus:ring-primary-red/20 resize-none"
            placeholder="Descripción del producto"
            rows={3}
            required
          />
        </div>

        {/* Price and Rating Row - Mobile optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
              Precio *
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-white focus:outline-none focus:border-primary-red focus:ring-2 focus:ring-primary-red/20"
              placeholder="0"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
              Calificación
            </label>
            <input
              type="number"
              value={formData.rating}
              onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-white focus:outline-none focus:border-primary-red focus:ring-2 focus:ring-primary-red/20"
              min="1"
              max="5"
              step="0.1"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
            Categoría
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-white focus:outline-none focus:border-primary-red focus:ring-2 focus:ring-primary-red/20"
          >
            <option value="Entrada">Entrada</option>
            <option value="Principal">Principal</option>
            <option value="Postre">Postre</option>
            <option value="Bebida">Bebida</option>
            <option value="Desayuno">Desayuno</option>
            <option value="Almuerzo">Almuerzo</option>
            <option value="Cena">Cena</option>
          </select>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
            URL de la Imagen
          </label>
          <input
            type="text"
            value={formData.image}
            onChange={(e) => setFormData({...formData, image: e.target.value})}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-white focus:outline-none focus:border-primary-red focus:ring-2 focus:ring-primary-red/20"
            placeholder="/imagen.jpg"
          />
          {formData.image && (
            <div className="mt-2 w-full h-24 sm:h-32 relative">
              <Image
                src={formData.image}
                alt="Preview"
                fill
                className="object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/placeholder-food.jpg'
                }}
              />
            </div>
          )}
        </div>

        {/* Featured Checkbox - Mobile optimized */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) => setFormData({...formData, featured: e.target.checked})}
            className="w-4 h-4 text-primary-red bg-gray-700 border-gray-600 rounded focus:ring-primary-red focus:ring-2"
          />
          <label htmlFor="featured" className="text-xs sm:text-sm text-gray-300">
            Producto destacado (aparece en "Hoy tenemos")
          </label>
        </div>

        {/* Action Buttons - Mobile optimized */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-3 sm:pt-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-gray-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="w-full bg-primary-red text-white py-2.5 sm:py-3 rounded-lg hover:bg-primary-red/90 transition-colors text-sm font-medium"
          >
            {product ? 'Actualizar' : 'Agregar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}