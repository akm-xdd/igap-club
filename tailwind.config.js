
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'fade-in-up': 'fadeInUp 1s ease-out',
        'fade-in-up-delay': 'fadeInUp 1s ease-out 0.5s both',
        'fade-in-up-delay-2': 'fadeInUp 1s ease-out 1s both',
        'fade-in-delay': 'fadeIn 1s ease-out 1.5s both',
        'slide-up-stagger': 'slideUpStagger 0.8s ease-out both',
        'float-random': 'floatRandom 8s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeIn: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        slideUpStagger: {
          '0%': {
            opacity: '0',
            transform: 'translateY(40px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        floatRandom: {
          '0%, 100%': {
            transform: 'translateY(0px) rotate(0deg)',
          },
          '25%': {
            transform: 'translateY(-20px) rotate(5deg)',
          },
          '50%': {
            transform: 'translateY(-10px) rotate(-5deg)',
          },
          '75%': {
            transform: 'translateY(-15px) rotate(3deg)',
          },
        },
      },
    },
  },
  plugins: [],
}