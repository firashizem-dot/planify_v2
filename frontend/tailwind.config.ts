import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Planify brand palette
        primary: {
          DEFAULT: "#EB775E",
          50:  "#FEF2EF",
          100: "#FDE4DE",
          200: "#FAC9BC",
          300: "#F6AE9A",
          400: "#F29378",
          500: "#EB775E",  // main
          600: "#D95A40",
          700: "#B84432",
          800: "#8F3427",
          900: "#66241B",
        },
        secondary: {
          DEFAULT: "#FEFFEF",
          50: "#FEFFEF",
          100: "#F9FAD6",
          200: "#F0F2A8",
          300: "#E5E87A",
          400: "#D9DC4C",
          500: "#CCCE1E",
        },
        background: "#FEFFEF",
        foreground: "#1A1A2E",
        card: "#FFFFFF",
        muted: "#F4F4F4",
        accent: "#EB775E",
        border: "#E5E7EB",
        input: "#F9FAFB",
        ring: "#EB775E",
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 12px rgba(235,119,94,0.15)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
