/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx,vue}",
    "./public/**/*.html",
    "./*.html"
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
}
