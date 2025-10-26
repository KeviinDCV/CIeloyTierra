import { motion } from 'framer-motion'

interface DiamondShapeProps {
  size?: number
  color?: 'red' | 'yellow' | 'cream' | 'black'
  filled?: boolean
  position?: {
    top?: string
    bottom?: string
    left?: string
    right?: string
  }
  animate?: boolean
  rotation?: number
  opacity?: number
}

export default function DiamondShape({
  size = 40,
  color = 'yellow',
  filled = false,
  position = {},
  animate = true,
  rotation = 45,
  opacity = 0.2
}: DiamondShapeProps) {
  
  const colorMap = {
    red: filled ? 'bg-primary-red' : 'border-primary-red',
    yellow: filled ? 'bg-primary-yellow' : 'border-primary-yellow',
    cream: filled ? 'bg-[#f5e6d3]' : 'border-[#f5e6d3]',
    black: filled ? 'bg-black' : 'border-black'
  }

  const animationVariants = {
    initial: { rotate: rotation, scale: 1 },
    animate: {
      rotate: [rotation, rotation + 360],
      scale: [1, 1.1, 1],
      transition: {
        duration: 10,
        repeat: Infinity,
        ease: "linear"
      }
    }
  }

  const DiamondComponent = animate ? motion.div : 'div'

  return (
    <DiamondComponent
      className={`
        absolute
        ${filled ? colorMap[color] : `border-2 ${colorMap[color]}`}
        pointer-events-none
      `}
      style={{
        ...position,
        width: `${size}px`,
        height: `${size}px`,
        transform: `rotate(${rotation}deg)`,
        opacity
      }}
      {...(animate ? { variants: animationVariants, initial: "initial", animate: "animate" } : {})}
    />
  )
}
