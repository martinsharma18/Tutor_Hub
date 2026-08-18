/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Royal gold/brass range for primary (admin, login, active states)
        primary: {
          50:  "#fdf3e3",
          100: "#ebd7b4",
          200: "#e2c99a",
          300: "#d4bc93",
          400: "#b08866",
          500: "#8b5e3c",
          600: "#774f32",
          700: "#6e4a2e",
          800: "#553720",
          900: "#3b2a1a",
        },
        // Complementary bright gold for brand accent
        brand: {
          50:  "#f7ede0",
          100: "#f5ede0",
          200: "#ebd7b4",
          300: "#d4bc93",
          400: "#b08866",
          500: "#8b5e3c",
          600: "#774f32",
          700: "#6e4a2e",
          800: "#553720",
          900: "#3b2a1a",
        },
        // Overrides Tailwind's standard orange to make all orange elements gold
        orange: {
          50:  "#fdf3e3",
          100: "#f5ede0",
          200: "#ebd7b4",
          300: "#d4bc93",
          400: "#b08866",
          500: "#8b5e3c", // main gold/accent
          600: "#774f32", // dark gold
          700: "#6e4a2e",
          800: "#553720",
          900: "#3b2a1a",
        },
        // Overrides Tailwind's standard amber for bright gold highlights
        amber: {
          50:  "#fdf8f2",
          100: "#f5ede0",
          200: "#ebd7b4",
          300: "#d4bc93",
          400: "#a37d5f",
          500: "#8b5e3c", // bright gold
          600: "#774f32",
          700: "#6e4a2e",
          800: "#553720",
          900: "#3b2a1a",
        },
        // Warm taupe/cream slate override to shift all backgrounds/texts/borders to match teacherdata theme
        slate: {
          50:  "#faf8f5",
          100: "#f2e8d9", // --border-light
          200: "#e8d9c4", // --border
          300: "#d6c5af",
          400: "#b8a090", // --text-subtle
          500: "#8a7060", // --text-muted
          600: "#70594a",
          700: "#554336",
          800: "#3b2a1a", // --text-main
          900: "#22180f",
          950: "#0f0b07",
        },
        // Dark sidebar color matching the deep bronze/brown values
        sidebar: {
          DEFAULT: "#22180f",
          hover:   "#3b2a1a",
          active:  "#3b2a1a",
          border:  "#3b2a1a",
          text:    "#b8a090",
          "text-active": "#faf8f5",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      animation: {
        "fade-in":      "fadeIn 0.3s ease-in-out",
        "slide-up":     "slideUp 0.35s cubic-bezier(0.16,1,0.3,1)",
        "slide-down":   "slideDown 0.35s cubic-bezier(0.16,1,0.3,1)",
        "scale-in":     "scaleIn 0.2s ease-out",
        "bounce-subtle":"bounceSubtle 0.6s ease-in-out",
        "pulse-slow":   "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)",    opacity: "1" },
        },
        slideDown: {
          "0%":   { transform: "translateY(-12px)", opacity: "0" },
          "100%": { transform: "translateY(0)",     opacity: "1" },
        },
        scaleIn: {
          "0%":   { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)",    opacity: "1" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-4px)" },
        },
      },
      boxShadow: {
        "card":   "0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)",
        "card-md":"0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)",
        "card-lg":"0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.07)",
        "sidebar": "4px 0 24px 0 rgb(0 0 0 / 0.15)",
      },
    },
  },
  plugins: [],
};
