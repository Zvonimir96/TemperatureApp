/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#FAF6F1',
        text: '#3D2C2C',
        temp: '#E07A5F',
        humi: '#81B29A',
        cold: '#6B9AC4',
        card: '#FFFFFF',
        muted: '#A89F9F',
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
