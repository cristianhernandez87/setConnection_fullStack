/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Dejamos lista nuestra paleta base Dark/Neon
        'set-dark': '#0f0f11',
        'set-surface': '#1a1a1f',
        'set-neon': '#00ff9d',
      }
    },
  },
  plugins: [],
}