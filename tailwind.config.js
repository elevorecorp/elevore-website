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
          950: '#041E17',
          900: '#072B22',
          800: '#0B3B2F',
          700: '#0F4C3D',
          600: '#145E4C',
          500: '#1C7B65',
        },
        amber: {
          400: '#E5C158',
          500: '#D4AF37',
          600: '#B8860B',
        }
      }
    },
  },
  plugins: [],
}
