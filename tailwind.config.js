/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        primary: {
          light: '#818cf8',
          DEFAULT: '#6366f1',
          dark: '#4f46e5',
        },
        secondary: {
          light: '#fb7185',
          DEFAULT: '#f43f5e',
          dark: '#e11d48',
        },
        accent: {
          light: '#fb923c',
          DEFAULT: '#f97316',
          dark: '#ea580c',
        },
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      transitionDuration: {
        DEFAULT: '300ms',
      },
      boxShadow: {
        card: '0 4px 12px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 12px 24px rgba(0, 0, 0, 0.05)',
        'card-dark': '0 4px 12px rgba(0, 0, 0, 0.2)',
        'card-hover-dark': '0 12px 24px rgba(0, 0, 0, 0.2)',
      },
      borderRadius: {
        card: '12px',
      },
    },
  },
  plugins: [],
}