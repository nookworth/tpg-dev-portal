/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        beach: '#FFFAF3',
        beachDark: '#D9B59B',
        canyonLight: '#F9E9E1',
        forest: '#042E30',
        newForest: '#158481',
      },
    },
  },
  plugins: [],
};
