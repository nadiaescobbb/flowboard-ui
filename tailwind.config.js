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
        primary: "#c76f4f",
        blue: "#6f8fa5",
        olive: "#76865a",

        "background-light": "#fbf7ee",
        "background-dark": "#15130f",

        "surface-light": "#fffaf0",
        "surface-dark": "#1b1915",

        "border-light": "#ded4c3",
        "border-dark": "rgba(250,249,245,0.12)",

        "text-primary-light": "#15130f",
        "text-secondary-light": "#716a5d",
        "text-primary-dark": "#fbf7ee",
        "text-secondary-dark": "#b9b0a1",
      },

      fontFamily: {
        display: ["Poppins", "Arial", "sans-serif"],
        body: ["Lora", "Georgia", "serif"],
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
