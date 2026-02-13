const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0AA8B7',
          light: '#81D7DC',
          dark: '#0A5E64',
        },
        background: {
          DEFAULT: '#050607',
        },
        surface: {
          DEFAULT: '#0B0F10',
        },
        text: {
          DEFAULT: '#F5F7F8',
          muted: '#A7B0B7',
        },
        border: 'rgba(255,255,255,0.08)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};