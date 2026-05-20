/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f0ff",
          100: "#e0e0ff",
          200: "#c4b5fd",
          300: "#a78bfa",
          400: "#8b5cf6",
          500: "#7c3aed",
          600: "#6d28d9",
          700: "#5b21b6",
          800: "#4c1d95",
          900: "#2e1065",
        },
        surface: {
          DEFAULT: "#0f0f17",
          50: "#1a1a2e",
          100: "#16213e",
          200: "#1e1e30",
          300: "#252538",
          400: "#2d2d42",
        },
        dark: {
          DEFAULT: "#0a0a0f",
          50: "#0d0d14",
          100: "#111118",
          200: "#141420",
          300: "#1a1a28",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(59,130,246,0.05) 100%)",
        "glow-purple":
          "radial-gradient(circle at center, rgba(124,58,237,0.15) 0%, transparent 70%)",
      },
      boxShadow: {
        "glow-sm": "0 0 15px rgba(124,58,237,0.2)",
        glow: "0 0 30px rgba(124,58,237,0.25)",
        "glow-lg": "0 0 60px rgba(124,58,237,0.3)",
        card: "0 4px 24px rgba(0,0,0,0.4)",
        "card-hover": "0 8px 40px rgba(0,0,0,0.6)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
        shimmer: "shimmer 2s linear infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        slideUp: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: 0, transform: "translateX(-10px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      borderRadius: { "2xl": "1rem", "3xl": "1.5rem" },
      backdropBlur: { xs: "2px" },
    },
  },
  plugins: [],
};
