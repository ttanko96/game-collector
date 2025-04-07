/** @type {import('tailwindcss').Config} */

export default {
  mode: 'jit',
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        'custom-gray': '#202225'
      },
    },
  },
  plugins: [],
}