/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Palette du projet "Assistant ALSH Créatif"
        primary: {
          DEFAULT: '#7C3AED', // violet principal
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        sky: {
          DEFAULT: '#2563EB', // bleu
        },
        sun: {
          DEFAULT: '#FACC15', // jaune
        },
        grass: {
          DEFAULT: '#22C55E', // vert
        },
        surface: '#F8FAFC', // fond clair
        ink: '#111827', // texte foncé
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(17, 24, 39, 0.08)',
        'card-hover': '0 10px 30px -4px rgba(124, 58, 237, 0.18)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
