import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-blue": "rgb(var(--blue-rgb) / <alpha-value>)",
        "brand-purple": "rgb(var(--purple-rgb) / <alpha-value>)",
        ink: "rgb(var(--ink-rgb) / <alpha-value>)",
        slate: "rgb(var(--slate-rgb) / <alpha-value>)",
        bg: "rgb(var(--bg-rgb) / <alpha-value>)",
        success: "rgb(var(--success-rgb) / <alpha-value>)",
        caution: "rgb(var(--caution-rgb) / <alpha-value>)",
        danger: "rgb(var(--danger-rgb) / <alpha-value>)",
      },
      backgroundImage: {
        "grad-primary": "linear-gradient(135deg, var(--blue), var(--purple))",
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "var(--font-inter)",
          "-apple-system",
          "sans-serif",
        ],
      },
      borderRadius: {
        card: "24px",
        btn: "16px",
        modal: "24px",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
      keyframes: {
        "modal-in": {
          "0%": { opacity: "0", transform: "scale(0.95) translateY(8px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "sheet-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-6px)" },
          "40%": { transform: "translateX(6px)" },
          "60%": { transform: "translateX(-4px)" },
          "80%": { transform: "translateX(4px)" },
        },
      },
      animation: {
        "modal-in": "modal-in 280ms cubic-bezier(0.32, 0.72, 0, 1)",
        "sheet-up": "sheet-up 320ms cubic-bezier(0.32, 0.72, 0, 1)",
        "fade-in": "fade-in 200ms ease-out",
        "fade-up": "fade-up 600ms cubic-bezier(0.32, 0.72, 0, 1) both",
        shake: "shake 400ms ease-in-out",
      },
    },
  },
  plugins: [],
};
export default config;
