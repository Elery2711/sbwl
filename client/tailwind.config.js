/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: "GothanRounded",
        sec: "Bahnschrift",
        titles: "GothamRoundedBook",
      },
    },
  },
  plugins: [],
}