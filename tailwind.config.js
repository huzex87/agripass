import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Use 'dark' class on <html> for dark mode
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#181F48",
          secondary: "#F28439",
          tertiary: "#F2F2F2",
        },
      },
    },
  },
  plugins: [],
  daisyui: {
    themes: false,
    darkTheme: "dark",
    base: true,
  },
};
