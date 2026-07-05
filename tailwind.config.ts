import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0A",
        surface: "#141414",
        "surface-hover": "#1C1C1C",
        border: "#2A2A2A",
        "neon-red": "#FE2C55",
        "neon-cyan": "#25F4EE",
        muted: "#A1A1AA",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 1.5s infinite",
        "spin-slow": "spin 1.2s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        neon: "0 0 20px rgba(254, 44, 85, 0.3)",
        "neon-cyan": "0 0 20px rgba(37, 244, 238, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
