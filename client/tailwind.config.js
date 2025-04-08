/** @type {import('tailwindcss').Config} */

export default {
  mode: 'jit',
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        'custom-gray': '#202225',
        'custom-onyx-black' : '#353935',
        'custom-dark-purple' : '#301934',
        'licorice' : '#1B1212',
        'matte-black' : '#28282B'
      },
    },
  },
  plugins: [],
}