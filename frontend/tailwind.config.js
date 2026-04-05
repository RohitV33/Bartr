/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['Syne', 'sans-serif'],
        mono:    ['"DM Mono"', 'monospace'],
      },
      colors: {
        cream:    '#f2ede6',
        cream2:   '#e8e0d4',
        sand:     '#c9bba8',
        stone:    '#8a7f72',
        charcoal: '#2a2520',
        ink:      '#1a1510',
        rust:     '#b85c38',
        'rust-d': '#9c4a2a',
        sage:     '#6b7c5e',
        parchment:'#fdfaf6',
      },
    },
  },
  plugins: [],
};
