// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
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
};
