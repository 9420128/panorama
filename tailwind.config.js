/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gray300: '#D1D5DB',
        gray700: '#374151',
      },
    },
  },
  plugins: [],
}
