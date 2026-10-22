/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0806',
        panel: '#120e09',
        panel2: '#1a1409',
        gold: { DEFAULT: '#c9a24b', soft: '#e6cf8e', deep: '#9a7632', bright: '#f6e3a6' },
        cream: '#efe4c8',
        muted: '#b8a984',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Lato', 'system-ui', 'sans-serif'],
        arabic: ['Amiri', 'serif'],
        script: ['"Pinyon Script"', 'cursive'],
      },
    },
  },
  plugins: [],
};
