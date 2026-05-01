import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0d14",
        panel: "#0f1320",
        panel2: "#141a2a",
        line: "#1f2638",
        accent: "#8b5cf6",
        accent2: "#22d3ee",
        ok: "#10b981",
        warn: "#f59e0b",
        err: "#ef4444",
      },
      fontFamily: {
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      keyframes: {
        pulseRing: {
          "0%": { transform: "scale(0.95)", opacity: "0.7" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
      },
      animation: {
        pulseRing: "pulseRing 1.4s cubic-bezier(0.4,0,0.6,1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
