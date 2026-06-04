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
        grotesk: ['Space Grotesk', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        // Keep aliases so existing classes still work
        syne: ['Space Grotesk', 'sans-serif'],
        jakarta: ['Inter', 'sans-serif'],
        sora: ['Space Grotesk', 'sans-serif'],
        dm: ['Inter', 'sans-serif'],
      },

      colors: {
        yellow: {
          300: 'var(--text)',
          400: 'var(--text)',
        },

        bartr: {
          bg: 'var(--bg)',
          surface: 'var(--surface)',
          text: 'var(--text)',
          muted: 'var(--muted)',
          card: 'var(--card)',
          border: 'var(--border)',
          sidebar: 'var(--sidebar)',
          dark: 'var(--text)',
        },
      },
    },
  },

  plugins: [],
}