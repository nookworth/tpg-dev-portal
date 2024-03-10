/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        beachDark: '#D9B59B',
        forest: '#042E30',
        newForest: '#158481',
      },
    },
  },
  plugins: [],
};
