/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
      colors: {
        yellow: {
          300: '#f5c842',
          400: '#e6b800',
        },
        bartr: {
          bg: '#f7f6f2',
          dark: '#0f0f0f',
          card: '#ffffff',
        },
      },
    },
  },
  plugins: [],
}
