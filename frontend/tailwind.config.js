/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        // True indigo as primary accent (trust + education)
        primary: {
          50:  "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        // Warm amber for highlights/CTA
        brand: {
          50:  "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        // Dark sidebar color
        sidebar: {
          DEFAULT: "#0f172a",
          hover:   "#1e293b",
          active:  "#1e293b",
          border:  "#1e293b",
          text:    "#94a3b8",
          "text-active": "#f8fafc",
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
