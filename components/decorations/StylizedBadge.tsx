import { motion } from 'framer-motion'

interface StylizedBadgeProps {
  text: string
  accentText?: string
  variant?: 'special' | 'best' | 'new' | 'promo'
  size?: 'sm' | 'md' | 'lg'
}

export default function StylizedBadge({
  text,
  accentText,
  variant = 'special',
  size = 'md'
}: StylizedBadgeProps) {
  
  const sizeMap = {
    sm: {
      container: 'px-3 py-1.5',
      textSize: 'text-xs',
      accentSize: 'text-sm'
    },
    md: {
      container: 'px-4 py-2',
      textSize: 'text-sm',
      accentSize: 'text-lg'
    },
    lg: {
      container: 'px-6 py-3',
      textSize: 'text-base',
      accentSize: 'text-xl'
    }
  }

  const variantMap = {
    special: {
      bg: 'bg-black',
      border: 'border-primary-red',
      accentColor: 'text-primary-red',
      textColor: 'text-white',
      icon: '⭐'
    },
    best: {
      bg: 'bg-black',
      border: 'border-primary-yellow',
      accentColor: 'text-primary-yellow',
      textColor: 'text-white',
      icon: '👑'
    },
    new: {
      bg: 'bg-primary-red',
      border: 'border-primary-yellow',
      accentColor: 'text-primary-yellow',
      textColor: 'text-white',
      icon: '✨'
    },
    promo: {
      bg: 'bg-primary-yellow',
      border: 'border-black',
      accentColor: 'text-black',
      textColor: 'text-black',
      icon: '🔥'
    }
  }

  return (
    <motion.div
      className={`
        ${variantMap[variant].bg}
        ${variantMap[variant].border}
        border-2
        ${sizeMap[size].container}
        rounded-xl
        inline-flex items-center justify-center space-x-2
        font-bold
        relative
        overflow-hidden
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
      }}
    >
      {/* Decorative lines */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 flex space-x-0.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`w-0.5 h-3 ${variantMap[variant].accentColor} opacity-50`} />
        ))}
      </div>

      <span className={`${sizeMap[size].textSize} ${variantMap[variant].textColor} uppercase tracking-wider`}>
        {text}
      </span>
      
      {accentText && (
        <span className={`${sizeMap[size].accentSize} ${variantMap[variant].accentColor} italic font-title`}>
          {accentText}
        </span>
      )}

      <span className="text-base">{variantMap[variant].icon}</span>

      {/* Decorative lines */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-0.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`w-0.5 h-3 ${variantMap[variant].accentColor} opacity-50`} />
        ))}
      </div>

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      />
    </motion.div>
  )
}
