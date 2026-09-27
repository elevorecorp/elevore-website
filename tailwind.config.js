/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          950: '#041B15',
          900: '#072B22',
          850: '#0A362B',
          800: '#0E4235',
          700: '#145948',
          600: '#1A735E',
          500: '#228F75',
          100: '#E6F4F0',
          50:  '#F2F9F7',
        },
        amber: {
          300: '#F4E2B6',
          400: '#E5C378',
          500: '#D4AF37',
          600: '#C5A059',
          700: '#9C7A33',
        },
        cream: {
          bg: '#FAF8F5',
          surface: '#F4F0E8',
          border: '#E8E0D2',
        }
      }
    },
  },
  plugins: [],
}
