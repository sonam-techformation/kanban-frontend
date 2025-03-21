// tailwind.config.js
module.exports = {
  content: [
    "./page/**/*.{js,ts,jsx,tsx}",
    "./component/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  dark: "class", // Enable class-based dark mode
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"), // Add Tailwind Typography plugin if needed
  ],
};
