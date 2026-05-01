"use client";

import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Tone = "default" | "ok" | "warn" | "err" | "accent" | "accent2";

const toneStyles: Record<Tone, { ring: string; text: string; glow: string }> = {
  default: { ring: "ring-line", text: "text-slate-100", glow: "" },
  ok: { ring: "ring-ok/40", text: "text-ok", glow: "shadow-[0_0_20px_-8px_rgba(52,211,153,0.6)]" },
  warn: { ring: "ring-warn/40", text: "text-warn", glow: "shadow-[0_0_20px_-8px_rgba(251,191,36,0.6)]" },
  err: { ring: "ring-err/40", text: "text-err", glow: "shadow-[0_0_20px_-8px_rgba(248,113,113,0.6)]" },
  accent: { ring: "ring-accent/40", text: "text-accent", glow: "shadow-[0_0_20px_-8px_rgba(167,139,250,0.7)]" },
  accent2: { ring: "ring-accent2/40", text: "text-accent2", glow: "shadow-[0_0_20px_-8px_rgba(34,211,238,0.6)]" },
};

function AnimatedNumber({ value }: { value: number }) {
  const mv = useMotionValue(value);
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const controls = animate(mv, value, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return controls.stop;
  }, [value, mv]);
  return <span className="tabular-nums">{display}</span>;
}

export default function StatPill({
  label,
  value,
  tone = "default",
  hint,
  icon,
}: {
  label: string;
  value: number | string;
  tone?: Tone;
  hint?: string;
  icon?: React.ReactNode;
}) {
  const style = toneStyles[tone];
  const isNumber = typeof value === "number";
  const prevRef = useRef<number | string>(value);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (prevRef.current !== value) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 500);
      prevRef.current = value;
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      animate={pulse ? { scale: [1, 1.04, 1] } : { scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`relative overflow-hidden card card-hover px-3 py-3 ring-1 ${style.ring} ${pulse ? style.glow : ""}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="label">{label}</span>
        {icon && <span className={style.text}>{icon}</span>}
      </div>
      <div className={`mt-1 text-2xl font-semibold leading-tight ${style.text}`}>
        {isNumber ? <AnimatedNumber value={value as number} /> : value}
      </div>
      {hint && (
        <div className="mt-0.5 text-[10px] text-slate-500 truncate">{hint}</div>
      )}
    </motion.div>
  );
}
