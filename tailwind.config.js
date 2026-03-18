/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0a0a0f',
          800: '#13131a',
          700: '#1c1c26'
        },
        neon: {
          blue: '#3b82f6',
          purple: '#8b5cf6',
          cyan: '#06b6d4'
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave': 'wave 1.5s ease-in-out infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'scale(1)', opacity: 0.8 },
          '50%': { transform: 'scale(1.1)', opacity: 1 },
        }
      }
    },
  },
  plugins: [],
}
