import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        void: "var(--void)",
        voidDeep: "var(--void-deep)",
        abyss: "var(--abyss)",
        abyss2: "var(--abyss-2)",
        abyss3: "var(--abyss-3)",
        star: "var(--star)",
        starSoft: "var(--star-soft)",
        starMute: "var(--star-mute)",
        starFaint: "var(--star-faint)",
        rule: "var(--rule)",
        ruleStrong: "var(--rule-strong)",
        ruleGold: "var(--rule-gold)",
        gold: "var(--gold)",
        goldDeep: "var(--gold-deep)",
        azure: "var(--azure)",
        leaf: "var(--leaf)",
        rose: "var(--rose)",
        violet: "var(--violet)",

        /* Legacy aliases so older class names keep working */
        paper: "var(--paper)",
        paper2: "var(--paper-2)",
        paperShade: "var(--paper-shade)",
        ink: "var(--ink)",
        inkSoft: "var(--ink-soft)",
        inkMute: "var(--ink-mute)",
        stamp: "var(--stamp)",
        stampMute: "var(--stamp-mute)",
        deep: "var(--deep)",
        sage: "var(--sage)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Newsreader", "Georgia", "serif"],
        serif: ["var(--font-display)", "Newsreader", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        twinkle: {
          "0%,100%": { opacity: "0.85" },
          "50%": { opacity: "0.35" },
        },
        ripple: {
          "0%": { transform: "scale(0.8)", opacity: "0.7" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
      },
      animation: {
        rise: "rise 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both",
        twinkle: "twinkle 3.2s ease-in-out infinite",
        ripple: "ripple 1.8s cubic-bezier(0.4,0,0.6,1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
