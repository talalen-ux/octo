"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Eyebrow } from "./primitives";
import candles from "@/assets/aikols/market-candles.png";
import floating from "@/assets/aikols/agent-floating.png";

const STEPS = [
  { word: "Watch.", body: "Agents track the markets you pick, every tick, without blinking." },
  { word: "Read.", body: "Signals are scored and filtered, so only the strong ones get through." },
  { word: "Act.", body: "The right agent takes the trade and logs every move for you to review." },
];

/* Scroll windows for each step's copy (progress 0..1 across the section) */
const WINDOWS: { at: number[]; o: number[]; y: number[] }[] = [
  { at: [0, 0.27, 0.33], o: [1, 1, 0], y: [0, 0, -40] },
  { at: [0.33, 0.39, 0.6, 0.66], o: [0, 1, 1, 0], y: [40, 0, 0, -40] },
  { at: [0.66, 0.72, 1], o: [0, 1, 1], y: [40, 0, 0] },
];

function StepCopy({ p, i }: { p: MotionValue<number>; i: number }) {
  const w = WINDOWS[i];
  const opacity = useTransform(p, w.at, w.o);
  const y = useTransform(p, w.at, w.y);
  const s = STEPS[i];
  return (
    <motion.div className="absolute inset-0" style={{ opacity, y }} aria-hidden={i > 0 || undefined}>
      <div className="font-mono text-[12px] tracking-[0.2em] text-k-lime">
        0{i + 1} <span className="text-k-dim">/ 03</span>
      </div>
      <h3 className="mt-3 font-grotesk text-[clamp(72px,17vw,124px)] font-extrabold leading-[0.88] tracking-[-0.06em] text-white lg:mt-5 lg:text-[clamp(110px,11vw,190px)]">
        {s.word}
      </h3>
      <p className="mt-4 max-w-[30ch] text-[17px] leading-[1.5] text-k-mute lg:mt-7 lg:text-[20px]">{s.body}</p>
    </motion.div>
  );
}

function RailSegment({ p, i, label }: { p: MotionValue<number>; i: number; label: string }) {
  const fill = useTransform(p, [i / 3, (i + 1) / 3 - 0.02], [0, 1]);
  const active = useTransform(p, [i / 3 - 0.02, i / 3 + 0.02, (i + 1) / 3 - 0.02, (i + 1) / 3 + 0.02], [0.4, 1, 1, i === 2 ? 1 : 0.4]);
  return (
    <div className="flex-1">
      <div className="h-[2px] overflow-hidden rounded-full bg-white/10">
        <motion.div className="h-full origin-left bg-k-lime" style={{ scaleX: fill }} />
      </div>
      <motion.div className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white" style={{ opacity: active }}>
        {label}
      </motion.div>
    </div>
  );
}

/* ── Visuals ──────────────────────────────────────────────────────────── */

const PRICE_PATH = "M8 304 L46 282 L78 296 L112 250 L146 266 L182 214 L216 232 L252 178 L286 196 L322 138 L356 154 L392 92";

function WatchScene({ p }: { p: MotionValue<number> }) {
  const opacity = useTransform(p, [0.3, 0.38], [1, 0]);
  const draw = useTransform(p, [0.01, 0.27], [0, 1]);
  const scale = useTransform(p, [0, 0.3], [0.84, 1]);
  const dot = useTransform(p, [0.25, 0.28], [0, 1]);
  // Reveal the area fill only as far as the line has drawn (path runs left→right)
  const clipRight = useTransform(draw, (v) => `${(1 - v) * 100}%`);
  const areaClip = useMotionTemplate`inset(0 ${clipRight} 0 0)`;
  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      <div className="absolute left-1/2 top-[54%] w-[46%] -translate-x-1/2 -translate-y-1/2">
        <motion.div style={{ scale }}>
          <Image src={candles} alt="" aria-hidden sizes="320px" className="h-auto w-full opacity-90" draggable={false} />
        </motion.div>
      </div>
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
        <defs>
          <linearGradient id="k-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C8FF4F" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#C8FF4F" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={`${PRICE_PATH} L392 400 L8 400 Z`}
          fill="url(#k-area)"
          style={{ clipPath: areaClip, WebkitClipPath: areaClip }}
        />
        <motion.path
          d={PRICE_PATH}
          fill="none"
          stroke="#C8FF4F"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pathLength: draw, filter: "drop-shadow(0 0 6px rgba(200,255,79,0.7))" }}
        />
      </svg>
      <motion.span
        className="k-pulse absolute left-[98%] top-[23%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-k-lime"
        style={{ opacity: dot }}
      />
    </motion.div>
  );
}

const CARDS = [
  { c: "#FF35D2", n: -1 },
  { c: "#20E5EA", n: 0 },
  { c: "#FFD638", n: 1 },
];

function SignalCard({ p, c, n }: { p: MotionValue<number>; c: string; n: number }) {
  const spread = useTransform(p, [0.36, 0.5], [0, 1]);
  const pick = useTransform(p, [0.5, 0.58], [0, 1]);
  const chosen = n === 0;
  const x = useTransform(spread, (v) => `${n * v * 112}%`);
  const rotate = useTransform(spread, (v) => n * v * 8);
  const y = useTransform([spread, pick], ([s, k]: number[]) => `${Math.abs(n) * s * 7 - (chosen ? k * 12 : 0)}%`);
  const scale = useTransform(pick, (k) => (chosen ? 1 + k * 0.1 : 1 - k * 0.04));
  const opacity = useTransform(pick, (k) => (chosen ? 1 : 1 - k * 0.65));
  const glow = useTransform(pick, (k) => (chosen ? `0 30px 80px -20px ${c}${Math.round(k * 140).toString(16).padStart(2, "0")}` : "none"));
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -ml-[15%] -mt-[24%] aspect-[0.62] w-[30%] rounded-[22px] border border-white/[0.09] bg-gradient-to-b from-[#161816] to-[#0A0B0A]"
      style={{ x, y, rotate, scale, opacity, boxShadow: glow, zIndex: chosen ? 2 : 1 }}
    >
      <span className="absolute inset-x-[22%] top-1/2 h-[6%] -translate-y-1/2 rounded-full" style={{ background: c, boxShadow: `0 0 22px ${c}` }} />
      <span className="absolute left-[12%] top-[10%] h-1 w-[22%] rounded-full bg-white/10" />
      <span className="absolute bottom-[10%] left-[12%] h-1 w-[40%] rounded-full bg-white/[0.06]" />
    </motion.div>
  );
}

function ReadScene({ p }: { p: MotionValue<number> }) {
  const opacity = useTransform(p, [0.32, 0.4, 0.62, 0.7], [0, 1, 1, 0]);
  const pick = useTransform(p, [0.52, 0.6], [0, 1]);
  const chipY = useTransform(pick, [0, 1], [12, 0]);
  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      {CARDS.map((k) => (
        <SignalCard key={k.c} p={p} c={k.c} n={k.n} />
      ))}
      <div className="absolute left-1/2 top-[12%] z-10 -translate-x-1/2">
        <motion.div
          className="whitespace-nowrap rounded-full border border-[#20E5EA]/40 bg-[#20E5EA]/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#20E5EA]"
          style={{ opacity: pick, y: chipY }}
        >
          Signal accepted
        </motion.div>
      </div>
    </motion.div>
  );
}

function ActScene({ p }: { p: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const opacity = useTransform(p, [0.66, 0.73], [0, 1]);
  const x = useTransform(p, [0.66, 0.82], ["70%", "0%"]);
  const y = useTransform(p, [0.66, 0.82], ["24%", "0%"]);
  const rotate = useTransform(p, [0.66, 0.82], [20, -5]);
  const lines = useTransform(p, [0.68, 0.8, 0.88], [0, 1, 0]);
  const chip = useTransform(p, [0.82, 0.9], [0, 1]);
  const chipY = useTransform(chip, [0, 1], [14, 0]);
  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      {[30, 46, 62].map((top, i) => (
        <motion.span
          key={top}
          className="absolute right-[8%] h-[2px] origin-right rounded-full bg-gradient-to-l from-k-lime to-transparent"
          style={{ top: `${top}%`, width: `${44 - i * 8}%`, scaleX: lines, opacity: lines }}
        />
      ))}
      <motion.div className="absolute left-[24%] top-[12%] w-[50%]" style={{ x, y, rotate }}>
        <motion.div
          animate={reduce ? undefined : { y: [0, -10, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image src={floating} alt="" aria-hidden sizes="340px" className="h-auto w-full" draggable={false} />
        </motion.div>
      </motion.div>
      <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2">
        <motion.div
          className="flex items-center gap-3 whitespace-nowrap rounded-full border border-white/[0.1] bg-[#0E100E]/90 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white"
          style={{ opacity: chip, y: chipY }}
        >
          <span className="k-pulse relative h-2 w-2 rounded-full bg-k-lime" />
          Position opened <span className="text-k-dim">·</span> <span className="text-k-mute">logged</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Story() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 130, damping: 30, mass: 0.3, restDelta: 0.0005 });

  return (
    <section id="how" ref={ref} className="relative h-[320vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_70%_50%,#000_10%,transparent_70%)]"
        />
        <div className="relative mx-auto flex h-full max-w-[1440px] flex-col gap-4 px-5 pb-6 pt-24 sm:px-8 lg:flex-row lg:items-center lg:gap-10 lg:px-14 lg:py-0">
          {/* Copy */}
          <div className="relative shrink-0 lg:w-[46%]">
            <Eyebrow>How it works</Eyebrow>
            <div className="mt-6 flex max-w-[460px] gap-3 lg:mt-10">
              {["Watch", "Read", "Act"].map((l, i) => (
                <RailSegment key={l} p={p} i={i} label={l} />
              ))}
            </div>
            <div className="relative mt-8 h-[230px] sm:h-[250px] lg:mt-14 lg:h-[400px]">
              {STEPS.map((_, i) => (
                <StepCopy key={i} p={p} i={i} />
              ))}
            </div>
          </div>

          {/* Stage */}
          <div className="relative min-h-0 flex-1 lg:h-full">
            <div className="absolute inset-0 grid place-items-center">
              <div className="relative aspect-square w-[min(100%,52svh,640px)] lg:w-[min(100%,72svh,640px)]">
                <span
                  aria-hidden
                  className="absolute inset-[8%] rounded-full opacity-60 blur-[90px]"
                  style={{ background: "radial-gradient(closest-side, rgba(200,255,79,0.2), transparent)" }}
                />
                <WatchScene p={p} />
                <ReadScene p={p} />
                <ActScene p={p} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
