import { motion } from 'framer-motion'

interface DecorativeDotsProps {
  color?: 'red' | 'yellow' | 'cream' | 'black'
  count?: number
  size?: number
  spacing?: number
  position?: {
    top?: string
    bottom?: string
    left?: string
    right?: string
  }
  layout?: 'horizontal' | 'vertical' | 'grid'
  animate?: boolean
}

export default function DecorativeDots({
  color = 'yellow',
  count = 3,
  size = 8,
  spacing = 8,
  position = {},
  layout = 'horizontal',
  animate = false
}: DecorativeDotsProps) {
  
  const colorMap = {
    red: 'bg-primary-red',
    yellow: 'bg-primary-yellow',
    cream: 'bg-[#f5e6d3]',
    black: 'bg-black'
  }

  const layoutClass = {
    horizontal: 'flex-row',
    vertical: 'flex-col',
    grid: 'grid grid-cols-2 gap-2'
  }

  const animationVariants = {
    initial: { scale: 1 },
    animate: (i: number) => ({
      scale: [1, 1.2, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        delay: i * 0.2,
        ease: "easeInOut"
      }
    })
  }

  return (
    <div
      className={`absolute flex ${layoutClass[layout]} pointer-events-none`}
      style={{ ...position, gap: `${spacing}px` }}
    >
      {Array.from({ length: count }).map((_, i) => (
        animate ? (
          <motion.div
            key={i}
            custom={i}
            variants={animationVariants}
            initial="initial"
            animate="animate"
            className={`${colorMap[color]} rounded-full`}
            style={{ width: `${size}px`, height: `${size}px` }}
          />
        ) : (
          <div
            key={i}
            className={`${colorMap[color]} rounded-full`}
            style={{ width: `${size}px`, height: `${size}px` }}
          />
        )
      ))}
    </div>
  )
}
