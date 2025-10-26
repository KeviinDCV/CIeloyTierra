/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-red': '#e61d25',
        'primary-yellow': '#fdb72d',
        'primary-green': '#38a169',
        'primary-black': '#000000',
        'accent-cream': '#f5e6d3',  // Nuevo: Color crema para decoraciones
        'accent-orange': '#ff6b35', // Nuevo: Naranja intenso
        gray: {
          900: '#111111', // Negro suave para variaciones
          800: '#1f1f1f',
        },
        // Color Layering System - Base to Elevated
        'layer': {
          'base': '#0a0a0a',      // Más profundo (fondo)
          'low': '#141414',       // +0.1 luminosidad
          'mid': '#1e1e1e',       // +0.2 luminosidad  
          'high': '#282828',      // +0.3 luminosidad
          'elevated': '#323232',  // Más elevado (elementos importantes)
        },
      },
      fontFamily: {
        'sans': ['Poppins', 'system-ui', 'sans-serif'],
        'display': ['Poppins', 'system-ui', 'sans-serif'],
        'elegant': ['Poppins', 'system-ui', 'sans-serif'],
        'title': ['Pacifico', 'cursive'],
        pacifico: ['Pacifico', 'cursive'],
        poppins: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        // Dual-layer shadows - Light from above concept
        'layer-sm': '0 -1px 0 rgba(255, 255, 255, 0.03), 0 2px 8px rgba(0, 0, 0, 0.4)',
        'layer-md': '0 -1px 0 rgba(255, 255, 255, 0.05), 0 4px 16px rgba(0, 0, 0, 0.5)',
        'layer-lg': '0 -2px 0 rgba(255, 255, 255, 0.06), 0 8px 24px rgba(0, 0, 0, 0.6)',
        'layer-xl': '0 -2px 0 rgba(255, 255, 255, 0.08), 0 12px 32px rgba(0, 0, 0, 0.7)',
        
        // Elevated shadows (for floating elements like navbar)
        'elevated-sm': '0 -1px 0 rgba(255, 255, 255, 0.08), 0 4px 12px rgba(0, 0, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3)',
        'elevated-md': '0 -2px 0 rgba(255, 255, 255, 0.1), 0 8px 20px rgba(0, 0, 0, 0.6), 0 4px 8px rgba(0, 0, 0, 0.4)',
        'elevated-lg': '0 -2px 0 rgba(255, 255, 255, 0.12), 0 12px 28px rgba(0, 0, 0, 0.7), 0 6px 12px rgba(0, 0, 0, 0.5)',
        
        // Inset shadows (sunken effect)
        'inset-sm': 'inset 0 2px 4px rgba(0, 0, 0, 0.4), inset 0 -1px 0 rgba(255, 255, 255, 0.02)',
        'inset-md': 'inset 0 3px 6px rgba(0, 0, 0, 0.5), inset 0 -1px 0 rgba(255, 255, 255, 0.03)',
        
        // Glow effects
        'glow-red': '0 0 20px rgba(230, 29, 37, 0.3), 0 0 40px rgba(230, 29, 37, 0.15)',
        'glow-yellow': '0 0 20px rgba(253, 183, 45, 0.3), 0 0 40px rgba(253, 183, 45, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-subtle': 'pulseSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
