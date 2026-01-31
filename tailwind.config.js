/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: '#f8b31d',
      },
      fontFamily: {
        bebasneue: ['Bebas Neue', 'sans-serif'],
        oswald: ['Oswald', 'sans-serif'],
        cursive: ['Pacifico', 'cursive'],
      },
    },
  },
  plugins: [],
}
