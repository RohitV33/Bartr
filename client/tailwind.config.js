/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',

  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],

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

        // ✅ FIX: use CSS variables instead of fixed colors
        bartr: {
          bg: 'var(--bg)',
          surface: 'var(--surface)',
          text: 'var(--text)',
          muted: 'var(--muted)',
          card: 'var(--card)',
          border: 'var(--border)',
          sidebar: 'var(--sidebar)',
          dark: '#0f0f0f',
        },
      },
    },
  },

  plugins: [],
}