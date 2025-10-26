import { motion } from 'framer-motion'

interface OrganicBlobProps {
  color?: 'red' | 'yellow' | 'cream'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  position?: {
    top?: string
    bottom?: string
    left?: string
    right?: string
  }
  animate?: boolean
  opacity?: number
}

export default function OrganicBlob({
  color = 'cream',
  size = 'md',
  position = {},
  animate = true,
  opacity = 0.1
}: OrganicBlobProps) {
  
  const colorMap = {
    red: '#e61d25',
    yellow: '#fdb72d',
    cream: '#f5e6d3'
  }

  const sizeMap = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
    xl: 'w-96 h-96'
  }

  const animationVariants = {
    initial: { scale: 1, rotate: 0 },
    animate: {
      scale: [1, 1.1, 0.9, 1],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const style = {
    ...position,
    opacity
  }

  const BlobComponent = animate ? motion.div : 'div'

  return (
    <BlobComponent
      className={`absolute ${sizeMap[size]} pointer-events-none`}
      style={style}
      {...(animate ? { variants: animationVariants, initial: "initial", animate: "animate" } : {})}
    >
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path
          fill={colorMap[color]}
          d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,73.1,42.2C64.8,55.2,53.8,66.6,40.3,73.8C26.8,81,10.8,84,-6.1,83.8C-23,83.6,-46,80.2,-61.4,70.2C-76.8,60.2,-84.6,43.6,-87.8,26.4C-91,9.2,-89.6,-8.6,-83.8,-24.2C-78,-39.8,-67.8,-53.2,-55.1,-61.1C-42.4,-69,-27.2,-71.4,-12.4,-73.6C2.4,-75.8,30.6,-83.6,44.7,-76.4Z"
          transform="translate(100 100)"
        />
      </svg>
    </BlobComponent>
  )
}
