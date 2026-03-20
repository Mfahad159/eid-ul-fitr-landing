import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "eid-black": "#0a0f0d",
        "eid-green": "#0d3b2e",
        "eid-gold": "#c9a84c",
        "eid-gold-light": "#e8c97e",
        "eid-cream": "#f5f0e8",
        "eid-muted": "#6b7b72",
      },
      fontFamily: {
        display: ["var(--font-display)", "Cormorant Garamond", "serif"],
        body: ["var(--font-body)", "DM Sans", "sans-serif"],
        arabic: ["var(--font-arabic)", "Scheherazade New", "serif"],
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        }
      },
      animation: {
        shimmer: 'shimmer 3s linear infinite'
      }
    },
  },
  plugins: [],
};

export default config;
