/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'green-dark': '#2D5A27',
        'green-sage': '#4A7C59',
        'green-leaf': '#639922',
        'blue': '#378ADD',
        'amber': '#EF9F27',
        'red': '#E24B4A',
        'bg': '#F8FAF8',
        'card': '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
