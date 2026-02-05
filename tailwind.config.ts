import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#0a0a0a",
        crimson: "#e11d48",
        gold: "#fbbf24",
      },
    },
  },
  plugins: [],
};

export default config;
