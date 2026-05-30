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
        primary: "#d97757",
        blue: "#6a9bcc",
        olive: "#788c5d",

        "background-light": "#faf9f5",
        "background-dark": "#141413",

        "surface-light": "#fffdf8",
        "surface-dark": "#1b1a18",

        "border-light": "#e8e6dc",
        "border-dark": "rgba(250,249,245,0.12)",

        "text-primary-light": "#141413",
        "text-secondary-light": "#7b786f",
        "text-primary-dark": "#faf9f5",
        "text-secondary-dark": "#b0aea5",
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
