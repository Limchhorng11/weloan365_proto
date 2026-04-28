import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1f5fff",
          600: "#1a4fd4",
          50: "#eef3ff",
        },
        accent: "#00c48c",
        warn: "#ff9f1c",
        danger: "#ff4d5e",
        ink: {
          DEFAULT: "#0b0f1a",
          2: "#5a6473",
          3: "#8a93a3",
        },
        surface: {
          DEFAULT: "var(--surface)",
          2: "var(--surface-2)",
        },
        bg: "var(--bg)",
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
        text: {
          DEFAULT: "var(--text)",
          2: "var(--text-2)",
          3: "var(--text-3)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "16px",
        "2xl": "22px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(16,24,40,.06), 0 1px 3px rgba(16,24,40,.04)",
        md: "0 4px 16px rgba(16,24,40,.08)",
        lg: "0 20px 40px rgba(16,24,40,.16)",
      },
      animation: {
        "fade-in": "fadeIn .3s ease",
        "pulse-slow": "pulse 2s ease-in-out infinite",
        shake: "shake .4s",
        "sheet-up": "sheetUp .3s cubic-bezier(.32,.72,0,1) forwards",
        "toast-in": "toastIn .3s",
        scanning: "scanning 2s ease-in-out infinite",
        loading: "loading 1.5s ease-in-out infinite",
        bounce: "bounce 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        shake: {
          "0%,100%": { transform: "translateX(0)" },
          "20%,60%": { transform: "translateX(-6px)" },
          "40%,80%": { transform: "translateX(6px)" },
        },
        sheetUp: { to: { transform: "translateY(0)" } },
        toastIn: { from: { transform: "translateY(-20px)", opacity: "0" } },
        scanning: {
          "0%,100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.05)", opacity: ".7" },
        },
        loading: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(400%)" },
        },
        bounce: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
