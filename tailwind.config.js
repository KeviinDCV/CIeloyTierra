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
        'primary-black': '#000000',
        gray: {
          900: '#111111', // Negro suave para variaciones
          800: '#1f1f1f',
        }
      },
      fontFamily: {
        'sans': ['DM Sans', 'system-ui', 'sans-serif'],
        'display': ['DM Sans', 'system-ui', 'sans-serif'],
        'elegant': ['DM Sans', 'system-ui', 'sans-serif'],
        'title': ['Pacifico', 'cursive'],
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
