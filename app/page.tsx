'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleNavigateToHome = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      router.push('/home')
    }, 600)
  }



  return (
    <div className="min-h-screen bg-layer-base text-white relative overflow-hidden">
      {/* Video de fondo */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/Video1.mp4" type="video/mp4" />
        </video>
        
        {/* Gradiente que transiciona del video al fondo */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-25% via-layer-low/40 via-55% via-layer-mid/80 via-75% to-layer-base" />
      </div>
      
      {/* Contenido principal - Sistema de cajas responsive */}
      <div className={`relative z-10 h-screen w-full transition-all duration-700 ${
        isTransitioning 
          ? 'opacity-0 scale-95 -translate-y-8' 
          : isLoaded 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-4'
      }`}>
        
        {/* Contenedor principal con grid responsive */}
        <div className="h-full max-w-sm mx-auto md:max-w-3xl lg:max-w-5xl xl:max-w-7xl px-4 md:px-8 flex flex-col md:grid md:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-10 items-center justify-center py-8 md:py-12">
          
          {/* Caja 1: Logo - En mobile ocupa todo el ancho, en desktop la columna izquierda */}
          <div className="w-full md:col-span-1 lg:col-span-5 flex items-center justify-center">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 xl:w-[28rem] xl:h-[28rem]">
          <Image
            src="/Logo.png"
            alt="Cielo y Tierra Logo"
            fill
            className="object-contain relative z-10 drop-shadow-2xl"
            priority
          />
          {/* Destello de fondo */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-red/30 via-primary-yellow/30 to-primary-red/30 rounded-full blur-3xl animate-pulse opacity-40" />
            </div>
          </div>

          {/* Caja 2: CTA y Redes Sociales - En mobile va abajo, en desktop a la derecha */}
          <div className="w-full md:col-span-1 lg:col-span-7 flex flex-col gap-6 md:gap-8 justify-center">
            
            {/* Botón Ver Carta con Color Layering */}
            <div className="flex justify-center md:justify-start lg:justify-center">
              <button 
                onClick={handleNavigateToHome}
                className="group relative bg-layer-elevated text-white hover:bg-layer-high poppins-bold py-4 px-10 md:py-5 md:px-12 lg:py-6 lg:px-16 rounded-2xl transition-all duration-500 shadow-layer-lg hover:shadow-glow-red overflow-hidden"
              >
                {/* Capa base elevada */}
                <div className="absolute inset-0 bg-layer-high rounded-2xl"></div>
                
                {/* Capa de gradiente hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-red to-primary-yellow opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                
                {/* Resplandor sutil */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-red/10 to-primary-yellow/10 rounded-2xl opacity-60 group-hover:opacity-0 transition-opacity duration-500"></div>
                
                <span className="relative z-10 text-lg md:text-xl lg:text-2xl tracking-wide group-hover:scale-105 inline-block transition-transform duration-300">VER CARTA</span>
              </button>
            </div>

            {/* Redes sociales con Color Layering */}
            <div className="w-full px-4 md:px-0">
          {/* Contenedor principal - capa mid */}
          <div className="bg-layer-mid rounded-3xl p-6 md:p-8 shadow-layer-lg">
            <h3 className="text-white text-lg md:text-xl lg:text-2xl font-bold mb-5 md:mb-6 lg:mb-7 text-center poppins-bold tracking-wide">Síguenos</h3>
            
            {/* Contenedor de iconos - capa high */}
            <div className="bg-layer-high rounded-2xl p-4 md:p-6 shadow-layer-md">
              <div className="grid grid-cols-4 gap-3 md:gap-4 lg:gap-5 justify-items-center">
              {/* TikTok */}
              <a 
                href="https://www.tiktok.com/@cieloytierrarest?_t=ZS-8zmKY8f2s4t&_r=1" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-layer-elevated hover:bg-primary-red rounded-2xl flex items-center justify-center transition-all duration-500 shadow-layer-sm hover:shadow-glow-red hover:scale-110 hover:-translate-y-1"
                aria-label="TikTok"
              >
                <svg className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a 
                href="https://www.instagram.com/cieloytierrarest?igsh=MWY5dnhxM25iOHlkOQ=="
                target="_blank"
                rel="noopener noreferrer" 
                className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-layer-elevated hover:bg-primary-red rounded-2xl flex items-center justify-center transition-all duration-500 shadow-layer-sm hover:shadow-glow-red hover:scale-110 hover:-translate-y-1"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* Facebook */}
              <a 
                href="https://www.facebook.com/share/16DNHGdUWa/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer" 
                className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-layer-elevated hover:bg-primary-red rounded-2xl flex items-center justify-center transition-all duration-500 shadow-layer-sm hover:shadow-glow-red hover:scale-110 hover:-translate-y-1"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* WhatsApp */}
              <a 
                href="https://wa.me/message/YEYCHBZDZ5DMN1"
                target="_blank"
                rel="noopener noreferrer" 
                className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-layer-elevated hover:bg-primary-red rounded-2xl flex items-center justify-center transition-all duration-500 shadow-layer-sm hover:shadow-glow-red hover:scale-110 hover:-translate-y-1"
                aria-label="WhatsApp"
              >
                <svg className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.864 3.687"/>
                </svg>
              </a>
              </div>
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
