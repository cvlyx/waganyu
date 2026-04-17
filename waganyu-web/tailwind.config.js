/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#059669",
          light: "#D1FAE5",
          mid: "#6EE7B7",
          dark: "#047857",
        },
        accent: {
          DEFAULT: "#D97706",
          light: "#FEF3C7",
        },
        surface: "#FFFFFF",
        background: "#FAFAFA",
        foreground: "#0F172A",
        muted: "#F8FAFC",
        "muted-foreground": "#64748B",
        border: "#E2E8F0",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1rem",
        "3xl": "1.25rem",
      },
      boxShadow: {
        card: "0 1px 6px 0 rgba(0,0,0,0.05)",
        elevated: "0 4px 16px 0 rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
