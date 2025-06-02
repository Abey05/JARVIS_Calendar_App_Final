/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        starkRed: '#DC2626',
        arcBlue: '#3B82F6',
        ironGold: '#F59E0B',
      },
    },
  },
  plugins: [],

  extend: {
  animation: {
    'fade-in-scale': 'fadeInScale 0.2s ease-out'
  },
  keyframes: {
    fadeInScale: {
      '0%': { opacity: '0', transform: 'scale(0.95)' },
      '100%': { opacity: '1', transform: 'scale(1)' }
    }
  }
}

}

