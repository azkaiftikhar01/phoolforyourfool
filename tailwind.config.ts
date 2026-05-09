import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        brand: {
          pink: "#FFB3BA",
          peach: "#FFCBA4",
          coral: "#FF9999",
          orange: "#FFD4A3",
          cream: "#F8F6F3",
          ink: "#4A4A4A",
          rose: "#F47B89",
          deep: "#2E2A26",
        },
        background: "#F8F6F3",
        foreground: "#2E2A26",
        muted: {
          DEFAULT: "#EFE9E2",
          foreground: "#7A7167",
        },
        border: "#EADFD3",
        ring: "#FF9999",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(74, 74, 74, 0.18)",
        card: "0 4px 20px -8px rgba(255, 153, 153, 0.25)",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #FFB3BA 0%, #FFCBA4 50%, #FFD4A3 100%)",
        "hero-soft":
          "linear-gradient(180deg, rgba(255,203,164,0.45) 0%, rgba(248,246,243,0) 70%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "fade-up": "fade-up 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
