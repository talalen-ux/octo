import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        paper2: "var(--paper-2)",
        paperShade: "var(--paper-shade)",
        ink: "var(--ink)",
        inkSoft: "var(--ink-soft)",
        inkMute: "var(--ink-mute)",
        rule: "var(--rule)",
        ruleStrong: "var(--rule-strong)",
        stamp: "var(--stamp)",
        stampMute: "var(--stamp-mute)",
        deep: "var(--deep)",
        gold: "var(--gold)",
        sage: "var(--sage)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontFeatureSettings: {
        oldstyle: '"onum", "ss01"',
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        sweep: {
          "0%": { clipPath: "inset(0 100% 0 0)" },
          "100%": { clipPath: "inset(0 0 0 0)" },
        },
        rule: {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        stamp: {
          "0%": {
            opacity: "0",
            transform: "rotate(-14deg) scale(1.4)",
          },
          "55%": {
            opacity: "1",
            transform: "rotate(-9deg) scale(0.92)",
          },
          "75%": {
            transform: "rotate(-7deg) scale(1.04)",
          },
          "100%": {
            opacity: "1",
            transform: "rotate(-7deg) scale(1)",
          },
        },
        cursor: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        ripple: {
          "0%": { transform: "scale(0.8)", opacity: "0.6" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
        drift: {
          "0%, 100%": { transform: "translate(0,0)" },
          "50%": { transform: "translate(0, -2px)" },
        },
        ink: {
          "0%": { strokeDashoffset: "var(--len, 200)" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      animation: {
        rise: "rise 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both",
        sweep: "sweep 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) both",
        rule: "rule 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) both",
        stamp: "stamp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        cursor: "cursor 1.05s steps(2, end) infinite",
        ripple: "ripple 1.6s cubic-bezier(0.4,0,0.6,1) infinite",
        drift: "drift 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
