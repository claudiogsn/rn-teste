/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,tsx}", "./components/**/*.{js,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        primary: "#0B46AC",
        tertiary: "#08A794",
        secondary: "#EBEBEB",
        fourth: "#191F2A",

        background: "#EBEBEB",
        card: "#FFFFFF",
        foreground: "#191F2A",
        muted: "#6B7280",
        border: "rgba(25,31,42,0.12)",
      },
      borderRadius: {
        xl: "16px",
      },
    },
  },
  plugins: [],
};
