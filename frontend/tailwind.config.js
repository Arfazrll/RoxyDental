/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        softpink: {
          light: '#fbcfe8',
          DEFAULT: '#f9a8d4',
          dark: '#ec4899',
        },
      },
    },
  },
  plugins: [],
}
