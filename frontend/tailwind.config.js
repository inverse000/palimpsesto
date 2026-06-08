/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta Palimpsesto
        carbon: {
          950: '#0F0F0F',
          900: '#1A1A1A',
          800: '#242424',
          700: '#2D2D2D',
          600: '#3A3A3A',
          500: '#4A4A4A',
        },
        ivory: {
          100: '#FDFAF5',
          200: '#F5F0E8',
          300: '#EDE8DF',
          400: '#D6D0C4',
          500: '#BDB6A8',
        },
        bronze: {
          300: '#C9A84C',
          400: '#B8922A',
          500: '#A67C1A',
          600: '#8B6914',
          700: '#6B4F0F',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        display: ['Garamond', 'Georgia', 'serif'],
        mono: ['"Courier New"', 'Courier', 'monospace'],
        sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.25s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
