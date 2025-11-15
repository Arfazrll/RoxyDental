/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        softpink: {
          light: '#F9C5D1',
          DEFAULT: '#FF5E8A',
          dark: '#E54E7A',
        },
        lavender: {
          light: '#E3D7FF',
          DEFAULT: '#C4A3FF',
          dark: '#A275FF',
        },
        neutralgray: {
          light: '#F5F5F5',
          DEFAULT: '#E5E7EB',
          dark: '#9CA3AF',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0,0,0,0.05)',
        glowPink: '0 4px 12px rgba(255, 94, 138, 0.4)',
        glowPurple: '0 4px 12px rgba(147, 51, 234, 0.4)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
