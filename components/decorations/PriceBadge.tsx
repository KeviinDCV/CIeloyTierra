import { motion } from 'framer-motion'

interface PriceBadgeProps {
  price: number
  size?: 'sm' | 'md' | 'lg'
  color?: 'red' | 'yellow'
  currency?: string
  animate?: boolean
}

export default function PriceBadge({
  price,
  size = 'md',
  color = 'red',
  currency = '$',
  animate = true
}: PriceBadgeProps) {
  
  const sizeMap = {
    sm: {
      container: 'w-12 h-12',
      text: 'text-sm',
      border: 'border-2'
    },
    md: {
      container: 'w-16 h-16',
      text: 'text-lg',
      border: 'border-[3px]'
    },
    lg: {
      container: 'w-20 h-20',
      text: 'text-xl',
      border: 'border-4'
    }
  }

  const colorMap = {
    red: {
      bg: 'bg-primary-red',
      border: 'border-primary-red'
    },
    yellow: {
      bg: 'bg-primary-yellow',
      border: 'border-primary-yellow'
    }
  }

  const animationVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.1,
      rotate: [0, -5, 5, 0],
      transition: {
        duration: 0.3
      }
    }
  }

  const BadgeComponent = animate ? motion.div : 'div'

  return (
    <BadgeComponent
      className={`
        ${sizeMap[size].container}
        ${colorMap[color].bg}
        rounded-full
        flex items-center justify-center
        font-bold
        ${sizeMap[size].text}
        text-white
        shadow-lg
        relative
      `}
      {...(animate ? {
        variants: animationVariants,
        initial: "initial",
        whileHover: "hover"
      } : {})}
      style={{
        boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,0.4)'
      }}
    >
      <span className="font-poppins">
        {currency}{price}
      </span>
      {/* Decorative ring */}
      <div 
        className={`
          absolute inset-0 rounded-full
          ${colorMap[color].border}
          ${sizeMap[size].border}
          opacity-30
        `}
        style={{ transform: 'scale(1.2)' }}
      />
    </BadgeComponent>
  )
}
