'use client'

import { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  showCloseButton?: boolean
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true 
}: ModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Size classes
  const sizeClasses = {
    sm: 'w-full max-w-sm',
    md: 'w-full max-w-md',
    lg: 'w-full max-w-lg'
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Mobile-first overlay - full screen on small devices */}
      <div className="h-full overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-2 sm:p-4">
          {/* Modal Container - Truly responsive */}
          <div 
            className={`
              w-full
              ${size === 'sm' ? 'max-w-xs sm:max-w-sm' : ''}
              ${size === 'md' ? 'max-w-sm sm:max-w-md' : ''}
              ${size === 'lg' ? 'max-w-md sm:max-w-lg' : ''}
              bg-gray-800 
              rounded-lg sm:rounded-xl 
              shadow-2xl 
              border border-gray-700/50 
              overflow-hidden 
              animate-slideUpBounce
              max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-2rem)]
              my-2 sm:my-4
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Compact Header */}
            <div className="flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3 border-b border-gray-700/50 bg-gray-800/80 backdrop-blur-sm">
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                {/* Smaller decorative dots */}
                <div className="flex space-x-1 flex-shrink-0">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-red rounded-full"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-yellow rounded-full"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-red/50 rounded-full"></div>
                </div>
                <h2 className="text-white text-sm sm:text-base font-bold truncate">{title}</h2>
              </div>
              
              {showCloseButton && (
                <button 
                  onClick={onClose}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-700/50 flex items-center justify-center hover:bg-gray-600/50 transition-colors group flex-shrink-0 ml-2"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Responsive Content with proper mobile spacing */}
            <div className="px-3 py-3 sm:px-4 sm:py-4 overflow-y-auto max-h-[calc(100vh-8rem)] sm:max-h-[calc(100vh-10rem)]">
              <div className="space-y-3 sm:space-y-4">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Custom CSS animations (to be added to global styles or inline)
const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUpBounce {
    0% {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    80% {
      opacity: 1;
      transform: translateY(-2px) scale(1.02);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.2s ease-out;
  }

  .animate-slideUpBounce {
    animation: slideUpBounce 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
`
