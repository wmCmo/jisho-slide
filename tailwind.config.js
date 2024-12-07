/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Zen Old Mincho', 'serif'],
        'util': ['Inter', 'sans-serif']
      },
      fontSize: {
        'display': '21em'
      },
      colors: {
        'coarse-wool': '#1B2028',
        'river-styx': '#151A21',
        'steadfast': '#4B5975',
        'only-olive': '#CCCCB5',
        'battery-charged-blue': '#23A9D5'
      },
    }
  },
  plugins: []
}
