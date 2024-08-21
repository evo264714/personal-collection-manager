/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
        },
        dark: {
          bg: '#1f2937',
          text: '#d1d5db',
          card: '#374151',
          cardText: '#e5e7eb',
        },
      },
    },
  },
  plugins: [],
}
