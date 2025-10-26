import { motion } from 'framer-motion'

interface CircleBorderProps {
  color?: 'red' | 'yellow' | 'cream'
  size?: number
  borderWidth?: number
  position?: {
    top?: string
    bottom?: string
    left?: string
    right?: string
  }
  animate?: boolean
  opacity?: number
}

export default function CircleBorder({
  color = 'yellow',
  size = 150,
  borderWidth = 3,
  position = {},
  animate = true,
  opacity = 0.2
}: CircleBorderProps) {
  
  const colorMap = {
    red: '#e61d25',
    yellow: '#fdb72d',
    cream: '#f5e6d3'
  }

  const animationVariants = {
    initial: { scale: 1, opacity },
    animate: {
      scale: [1, 1.05, 1],
      opacity: [opacity, opacity * 1.5, opacity],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const style = {
    ...position,
    width: `${size}px`,
    height: `${size}px`,
    borderColor: colorMap[color],
    borderWidth: `${borderWidth}px`,
    opacity
  }

  const CircleComponent = animate ? motion.div : 'div'

  return (
    <CircleComponent
      className="absolute rounded-full border pointer-events-none"
      style={style}
      {...(animate ? { variants: animationVariants, initial: "initial", animate: "animate" } : {})}
    />
  )
}
