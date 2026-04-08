import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "var(--bg-primary)",
          surface: "var(--bg-surface)",
          card: "var(--bg-card)"
        },
        border: {
          DEFAULT: "var(--border)",
          glow: "var(--border-glow)"
        },
        gold: {
          DEFAULT: "var(--gold)",
          light: "var(--gold-light)",
          dark: "var(--gold-dark)"
        },
        rose: {
          DEFAULT: "var(--rose)",
          light: "var(--rose-light)"
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)"
        },
        success: "var(--success)"
      },
      fontFamily: {
        display: ["var(--font-playfair)"],
        body: ["var(--font-dm-sans)"],
        mono: ["var(--font-dm-mono)"]
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(240,192,64,0.12), 0 18px 45px rgba(0,0,0,0.35)",
        card: "0 24px 80px rgba(0,0,0,0.45)"
      },
      backgroundImage: {
        "gold-radial":
          "radial-gradient(circle at top, rgba(240,192,64,0.22), transparent 45%)"
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        shimmer: "shimmer 4s linear infinite",
        pulseGlow: "pulseGlow 2.2s ease-in-out infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" }
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(240,192,64,0.08)" },
          "50%": { boxShadow: "0 0 0 16px rgba(240,192,64,0)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
