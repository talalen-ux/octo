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
      duration: 0.6,
      ease: [0.2, 0.7, 0.2, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return c.stop;
  }, [value, mv]);
  return (
    <span style={{ fontVariantNumeric: "tabular-nums" }}>{display}</span>
  );
}

export default function StatPill({
  label,
  value,
  tone = "ink",
  hint,
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
      const t = setTimeout(() => setPulse(false), 600);
      prev.current = value;
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <motion.div
      animate={pulse ? { y: [0, -1, 0] } : { y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative px-4 py-3 bg-paper2"
    >
      <div className="small-caps text-[10px] text-inkMute mb-1.5">
        {label}
      </div>
      <div
        className="display leading-none"
        style={{
          fontSize: 26,
          fontWeight: 600,
          color: toneVar[tone],
          letterSpacing: "-0.02em",
        }}
      >
        {isNumber ? <AnimatedNumber value={value as number} /> : value}
      </div>
      {hint && (
        <div className="mt-1.5 text-[11px] text-inkMute leading-snug">
          {hint}
        </div>
      )}
    </motion.div>
  );
}
