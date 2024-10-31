/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        "background":"#F4EEE4",
        "darkbg":"#241C1A",
        "primary":"#452B01",
        "secondary":"#EBD9CD"
      }
    },
  },
  plugins: [],
}