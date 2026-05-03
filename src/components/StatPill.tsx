"use client";

import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Tone = "ink" | "stamp" | "deep" | "sage" | "gold";

const toneVar: Record<Tone, string> = {
  ink: "var(--star)",
  stamp: "var(--gold)",
  deep: "var(--azure)",
  sage: "var(--leaf)",
  gold: "var(--gold)",
};

const toneGlow: Record<Tone, string> = {
  ink: "transparent",
  stamp: "rgba(94, 234, 212,0.35)",
  deep: "rgba(94, 200, 234,0.30)",
  sage: "rgba(159, 240, 204,0.30)",
  gold: "rgba(94, 234, 212,0.35)",
};

function AnimatedNumber({ value }: { value: number }) {
  const mv = useMotionValue(value);
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const c = animate(mv, value, {
      duration: 0.7,
      ease: [0.2, 0.7, 0.2, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return c.stop;
  }, [value, mv]);
  return (
    <span
      style={{
        fontVariantNumeric: "tabular-nums",
        fontFeatureSettings: '"onum"',
      }}
    >
      {display}
    </span>
  );
}

export default function StatPill({
  label,
  value,
  tone = "ink",
  hint,
  numeral,
}: {
  label: string;
  value: number | string;
  tone?: Tone;
  hint?: string;
  numeral?: string;
}) {
  const isNumber = typeof value === "number";
  const prev = useRef<number | string>(value);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (prev.current !== value) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 750);
      prev.current = value;
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <motion.div
      animate={pulse ? { y: [0, -2, 0] } : { y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative px-4 pt-3 pb-3.5 bg-abyss"
    >
      {numeral && (
        <span className="absolute right-2.5 top-2 mono text-[9.5px] tracking-[0.2em] text-starFaint">
          {numeral}
        </span>
      )}
      <div className="label">{label}</div>
      <div
        className="display mt-1.5 leading-none"
        style={{
          fontSize: 38,
          fontWeight: 400,
          color: toneVar[tone],
          letterSpacing: "-0.02em",
          textShadow:
            tone === "ink"
              ? "none"
              : `0 0 18px ${toneGlow[tone]}`,
        }}
      >
        {isNumber ? <AnimatedNumber value={value as number} /> : value}
      </div>
      {hint && (
        <div className="mt-2 text-[11.5px] text-starMute italic display-italic leading-snug">
          {hint}
        </div>
      )}
      {pulse && (
        <span
          aria-hidden
          className="pointer-events-none absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full"
          style={{
            background: toneVar[tone],
            boxShadow: `0 0 12px ${toneVar[tone]}`,
            animation: "twinkle 0.7s ease-out",
          }}
        />
      )}
    </motion.div>
  );
}
