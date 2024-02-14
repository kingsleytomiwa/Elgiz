/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: "475px",
      lg: "1440",
      ...defaultTheme.screens,
    },
    extend: {
      fontFamily: {
        primary: ["Raleway"],
        secondary: ["Montserrat"],
        golos: ["Golos UI"],
        roboto: ["Roboto", " sans-serif"],
        inter: ["Inter","sans-serif"],
      },
      colors: {
        blue: {
          500: "#2B3467",
        },
      },
    },
  },

  plugins: [require("@tailwindcss/forms")],
};
