/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#07111f",
        mist: "#d9f1ff",
        rain: "#2f6fed",
        dawn: "#f4b266",
        moss: "#1f7a5c"
      },
      fontFamily: {
        sans: ["'Space Grotesk'", "system-ui", "sans-serif"],
        display: ["'Clash Display'", "'Space Grotesk'", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 20px 60px rgba(47, 111, 237, 0.22)"
      },
      backgroundImage: {
        hero: "radial-gradient(circle at top left, rgba(244,178,102,0.24), transparent 28%), radial-gradient(circle at top right, rgba(47,111,237,0.24), transparent 32%), linear-gradient(180deg, #07111f 0%, #0d1d35 100%)"
      }
    }
  },
  plugins: []
};
