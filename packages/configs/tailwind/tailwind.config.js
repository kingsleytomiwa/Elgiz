module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontSize: {
      h1: [
        "64px",
        {
          lineHeight: "110%",
          fontWeight: "600",
        },
      ],
      h2: "18px",
    },
    extend: {
      boxShadow: {
        sm: "0px 0px 2px rgba(36, 26, 4, 0.25)",
        section: "0px 0px 10px rgba(36, 26, 4, 0.1)",
        menu: "0px 0px 2px rgba(0, 0, 0, 0.25)",
      },
      colors: {
        blue: {
          300: "#BAD7E9",
          400: "#2B3467",
          500: "#1D4F91",
        },
        gray: {
          100: "#FDFFF1",
          200: "#D1D1D1",
          400: "#343A40",
          500: "#A6A6A6",
          600: "#D9D9D9",
        },
        red: {
          400: "#EB455F",
          700: "#E11403",
        },
      },
      spacing: {
        3.5: "14px",
        5.5: "22px",
        7.5: "30px",
      },
      borderRadius: {
        "2xl": "22px",
      },
      maxWidth: {
        200: "200px",
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.grey.900"),
          },
        },
      }),
    },
  },
};
