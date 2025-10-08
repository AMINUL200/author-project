// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        snel: ['"Snell Roundhand"', "sans-serif"],
      },
      colors: {
        brand: "#7C3AED", // you can add your own colors too
      },
    },
  },
  plugins: [],
};
