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
        paper: "#FCFCF7",
        ink: "#111110",
        line: "#E6E3D8",
        muted: "#6B6A62",
        lime: "#CBFF4D",
        limeDark: "#9FDA1E",
        panel: "#F1EFE4",
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
