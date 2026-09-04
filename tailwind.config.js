/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./content/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0A0B09",
        surface: "#141610",
        surface2: "#1B1E15",
        line: "#262920",
        ink: "#F3F5EC",
        muted: "#9CA095",
        lime: "#CBFF4D",
        limeInk: "#10130A",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        page: "1120px",
      },
    },
  },
  plugins: [],
};
