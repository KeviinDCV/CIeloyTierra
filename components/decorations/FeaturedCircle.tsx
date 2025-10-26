import { motion } from 'framer-motion'
import Image from 'next/image'

interface FeaturedCircleProps {
  image: string
  title: string
  subtitle?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  borderColor?: 'red' | 'yellow' | 'cream'
  onClick?: () => void
}

export default function FeaturedCircle({
  image,
  title,
  subtitle,
  size = 'md',
  borderColor = 'red',
  onClick
}: FeaturedCircleProps) {
  
  const sizeMap = {
    sm: {
      container: 'w-24 h-24',
      border: 'border-[3px]',
      imageSize: 'w-20 h-20'
    },
    md: {
      container: 'w-32 h-32',
      border: 'border-[4px]',
      imageSize: 'w-28 h-28'
    },
    lg: {
      container: 'w-40 h-40',
      border: 'border-[5px]',
      imageSize: 'w-36 h-36'
    },
    xl: {
      container: 'w-48 h-48',
      border: 'border-[6px]',
      imageSize: 'w-44 h-44'
    }
  }

  const colorMap = {
    red: 'border-primary-red',
    yellow: 'border-primary-yellow',
    cream: 'border-[#f5e6d3]'
  }

  return (
    <div className="flex flex-col items-center space-y-3">
      <motion.div
        onClick={onClick}
        className={`
          ${sizeMap[size].container}
          ${colorMap[borderColor]}
          ${sizeMap[size].border}
          rounded-full
          bg-layer-elevated
          p-2
          cursor-pointer
          relative
          overflow-hidden
        `}
        whileHover={{ scale: 1.05, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        style={{
          boxShadow: '0 8px 24px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.1)'
        }}
      >
        <div className={`${sizeMap[size].imageSize} relative rounded-full overflow-hidden`}>
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/10 rounded-full pointer-events-none" />
      </motion.div>

      <div className="text-center">
        <h4 className="text-white font-bold text-sm">{title}</h4>
        {subtitle && (
          <p className="text-gray-400 text-xs">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
