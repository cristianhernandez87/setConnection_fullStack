/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      // 🔥 1. Definimos las fuentes Roboto
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        condensed: ['"Roboto Condensed"', 'sans-serif'],
      },
      // 🔥 2. Colores sólidos para los bloques Bento (Como en la imagen)
      colors: {
        bento: {
          cyan: '#00E5FF',    // Para stats de reproducciones
          yellow: '#CCFF00',  // Para botones de acción y stats de IA
          dark: '#111111',    // Para bloques de fondo negro mate
          card: '#F8F9FA',    // Para tarjetas grises ultra-claras
        }
      },
      // 🔥 3. Espaciado entre letras ultra-apretado para el look editorial Apple
      letterSpacing: {
        'ultra-tight': '-0.04em',
      },
      // 🔥 4. Bordes hiper-redondeados para las tarjetas
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.5rem',
      }
    },
  },
  plugins: [],
}