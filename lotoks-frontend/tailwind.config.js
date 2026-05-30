/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0B1D3A',
        gold: '#C9A44B',
        teal: '#1D7A7A',
        red: '#D14B4B',
      },
      fontFamily: {
        heading: ['Lexend', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}