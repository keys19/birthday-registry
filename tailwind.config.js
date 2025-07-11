/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#FFD700',
          orange: '#FF8C00',
          red: '#FF4500',
          hotpink: '#FF1493',
          pink: '#FF69B4',
          peach: '#FFF4E6',
          blush: '#FFF0F5',
          ivory: '#FFFDF7',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
