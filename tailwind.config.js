/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#137fec",

        // BACKGROUNDS
        "background-light": "#f6f7f8",
        "background-dark": "#050505",

        // SURFACES (cards, sidebar)
        "surface-light": "#ffffff",
        "surface-dark": "#0f0f0f",

        // BORDERS
        "border-light": "#e5e7eb",
        "border-dark": "rgba(255,255,255,0.08)",

        // TEXT
        "text-primary-light": "#0f172a",
        "text-secondary-light": "#64748b",
        "text-primary-dark": "#ffffff",
        "text-secondary-dark": "#94a3b8",
      },

      fontFamily: {
        display: ["Inter", "sans-serif"],
      },

      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};
