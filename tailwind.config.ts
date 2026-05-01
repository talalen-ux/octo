import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#070912",
        bg2: "#0a0d18",
        panel: "#0f1320",
        panel2: "#141a2a",
        line: "#1d2334",
        line2: "#262d40",
        accent: "#a78bfa",
        accent2: "#22d3ee",
        ok: "#34d399",
        warn: "#fbbf24",
        err: "#f87171",
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Inter",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at 50% 0%, rgba(167,139,250,0.10), transparent 55%), radial-gradient(circle at 90% 90%, rgba(34,211,238,0.06), transparent 50%)",
        "panel-shine":
          "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))",
      },
      boxShadow: {
        soft: "0 1px 0 rgba(255,255,255,0.03) inset, 0 8px 24px rgba(0,0,0,0.35)",
        glowAccent: "0 0 0 1px rgba(167,139,250,0.35), 0 0 28px rgba(167,139,250,0.25)",
        glowAccent2:
          "0 0 0 1px rgba(34,211,238,0.35), 0 0 24px rgba(34,211,238,0.18)",
      },
      keyframes: {
        pulseRing: {
          "0%": { transform: "scale(0.85)", opacity: "0.7" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
        sheen: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(120%)" },
        },
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        breathe: {
          "0%,100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        pulseRing: "pulseRing 1.6s cubic-bezier(0.4,0,0.6,1) infinite",
        sheen: "sheen 2.4s ease-in-out infinite",
        floaty: "floaty 4s ease-in-out infinite",
        shimmer: "shimmer 2.4s linear infinite",
        breathe: "breathe 2.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
