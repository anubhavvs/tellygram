module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      'sm': {'min': '250px', 'max': '500px'}
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
