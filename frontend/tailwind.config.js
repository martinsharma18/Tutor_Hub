/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          50: "#fcf3e2",
          100: "#f8ebd9",
          200: "#efe4d2",
          300: "#ebd2b5",
          400: "#d9b58c",
          500: "#bd9164",
          600: "#895e3c",
          700: "#784f2f",
          800: "#613d21",
          900: "#4f3018",
        },
        brand: {
          50: "#fcf3e2",
          100: "#f8ebd9",
          200: "#efe4d2",
          300: "#ebd2b5",
          400: "#d9b58c",
          500: "#bd9164",
          600: "#895e3c",
          700: "#784f2f",
          800: "#613d21",
          900: "#4f3018",
        },
        slate: {
          50: "#fcf3e2",
          100: "#efe4d2",
          200: "#ebd2b5",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#895e3c",
          900: "#613d21",
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [],
};

