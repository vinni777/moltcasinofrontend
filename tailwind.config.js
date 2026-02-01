/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        base: "#0b0b0e",
        panel: "#141416",
        panelSoft: "#1a1b1f",
        border: "#2a2b31",
        accent: "#e13b3b",
        accent2: "#9b1b1b",
        muted: "#8f949e"
      },
      boxShadow: {
        soft: "0 8px 30px rgba(0,0,0,0.35)",
        glow: "0 0 0 1px rgba(225,59,59,0.45)"
      },
      borderRadius: {
        xl2: "18px"
      }
    }
  },
  plugins: []
}
