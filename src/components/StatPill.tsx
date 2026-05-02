"use client";

import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Tone = "ink" | "stamp" | "deep" | "sage" | "gold";

const toneVar: Record<Tone, string> = {
  ink: "var(--ink)",
  stamp: "var(--stamp)",
  deep: "var(--deep)",
  sage: "var(--sage)",
  gold: "var(--gold)",
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
      className="mono"
      style={{
        fontFeatureSettings: '"tnum" 1, "lnum" 1',
        fontVariantNumeric: "tabular-nums",
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
      const t = setTimeout(() => setPulse(false), 700);
      prev.current = value;
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <motion.div
      animate={pulse ? { y: [0, -2, 0] } : { y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative px-1 py-3 border-l border-ink/40 first:border-l-0 first:pl-0"
    >
      {numeral && (
        <span
          className="absolute right-2 top-1 mono small-caps text-[9px] text-inkMute"
        >
          {numeral}
        </span>
      )}
      <div className="mono small-caps text-[9.5px] text-inkSoft mb-1">
        {label}
      </div>
      <div
        className="display leading-none"
        style={{
          fontVariationSettings: '"opsz" 144, "WONK" 1',
          fontSize: 42,
          color: toneVar[tone],
          letterSpacing: "-0.02em",
        }}
      >
        {isNumber ? <AnimatedNumber value={value as number} /> : value}
      </div>
      {hint && (
        <div className="mt-1.5 text-[11px] text-inkMute italic leading-snug">
          {hint}
        </div>
      )}
      {pulse && (
        <span
          aria-hidden
          className="pointer-events-none absolute -top-1 -right-1 w-2 h-2 rounded-full bg-stamp animate-ripple"
        />
      )}
    </motion.div>
  );
}
