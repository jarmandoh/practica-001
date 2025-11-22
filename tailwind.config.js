/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      /* colors: {
        primary: "#2563eb",
        secondary: "#00ff95",
        dark: "#171717",
      },
      backgroundColor: {
        'dark-bg': '#111827',
        'dark-card': '#1f2937',
      },
      textColor: {
        'dark-text': '#f3f4f6',
      },
      gridTemplateColumns: {
        '15': 'repeat(15, minmax(0, 1fr))',
      }, */
    },
  },
  plugins: [],
}