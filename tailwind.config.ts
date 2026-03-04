import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  // FIX: Using string instead of array to match 'DarkModeStrategy'
  darkMode: "class", 
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))", // Essential for 'Zinc' theme
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      animation: {
        "pulse-slow": "pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [animate], // Requires: npm install tailwindcss-animate
};

export default config;