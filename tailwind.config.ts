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
        primary: "#067bf9",
        "background-light": "#f5f7f8",
        "background-dark": "#0f1923",
        whatsapp: "#25D366",
        "glass-border": "rgba(255, 255, 255, 0.4)",
        "glass-bg": "rgba(255, 255, 255, 0.3)",
        "glass-input": "rgba(255, 255, 255, 0.5)",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
        "3xl": "2.5rem",
        full: "9999px",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        glow: "0 0 15px rgba(6, 123, 249, 0.3)",
        "input-focus": "0 0 0 4px rgba(6, 123, 249, 0.15)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
export default config;

