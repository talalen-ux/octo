"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useSpring,
  type Variants,
} from "framer-motion";

export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Wordmark ─────────────────────────────────────────────────────────── */
/* Rebuilt from brand_wordmark.svg so the chevron can draw itself in.      */

export function Wordmark({
  size = 34,
  intro = false,
  delay = 0,
}: {
  size?: number;
  intro?: boolean;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const play = intro && !reduce;
  return (
    <span className="inline-flex select-none items-center gap-[0.3em]" style={{ fontSize: size }}>
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 65 65"
        aria-hidden
        initial={play ? { scale: 0.3, opacity: 0, rotate: -18 } : false}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 17, delay }}
      >
        <rect width="65" height="65" rx="16" fill="#C8FF4F" />
        <motion.path
          d="M18 47 L32.5 22 L47 47"
          fill="none"
          stroke="#090A09"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={play ? { pathLength: 0 } : false}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.75, ease: [0.65, 0, 0.35, 1], delay: delay + 0.25 }}
        />
        <motion.circle
          cx="32.5"
          cy="47"
          r="4"
          fill="#090A09"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          initial={play ? { scale: 0 } : false}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 520, damping: 14, delay: delay + 0.85 }}
        />
      </motion.svg>
      <motion.span
        className="font-grotesk font-extrabold leading-none tracking-[-0.035em] text-white"
        style={{ fontSize: "0.7em" }}
        initial={play ? { opacity: 0, x: -10, filter: "blur(6px)" } : false}
        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7, ease: EASE_OUT, delay: delay + 0.35 }}
      >
        AIKOLs
      </motion.span>
    </span>
  );
}

/* ── Masked line reveal ───────────────────────────────────────────────── */
/* Each line slides up out of its own clipping box. The padding/negative   */
/* margin pair gives descenders (g, y, commas) room without moving layout. */

export function MaskLines({
  lines,
  as = "h2",
  className,
  delay = 0,
  stagger = 0.1,
  inView = false,
}: {
  lines: ReactNode[];
  as?: "h1" | "h2";
  className?: string;
  delay?: number;
  stagger?: number;
  inView?: boolean;
}) {
  const reduce = useReducedMotion();
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const line: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.6 } } }
    : {
        hidden: { y: "112%", rotate: 4 },
        show: { y: "0%", rotate: 0, transition: { duration: 1.1, ease: EASE_OUT } },
      };
  const Tag = as === "h1" ? motion.h1 : motion.h2;
  const trigger = inView
    ? { whileInView: "show", viewport: { once: true, margin: "-12% 0px" } }
    : { animate: "show" };
  return (
    <Tag className={className} initial="hidden" variants={container} {...trigger}>
      {lines.map((l, i) => (
        <span
          key={i}
          className="-mb-[0.16em] -mt-[0.06em] block overflow-hidden pb-[0.16em] pt-[0.06em]"
        >
          <motion.span
            className="block origin-[0%_100%] will-change-transform"
            variants={line}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/* ── Magnetic ─────────────────────────────────────────────────────────── */
/* Pulls its child toward a fine pointer; springs home on leave.           */

export function Magnetic({
  children,
  strength = 0.32,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 210, damping: 15, mass: 0.35 });
  const y = useSpring(0, { stiffness: 210, damping: 15, mass: 0.35 });
  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className ?? ""}`}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ── Small pieces ─────────────────────────────────────────────────────── */

export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={className}>
      <path
        d="M4 10h11m0 0-4.5-4.5M15 10l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[11.5px] uppercase tracking-[0.22em] text-k-mute">
      <span className="h-1.5 w-1.5 rounded-full bg-k-lime shadow-[0_0_12px_#C8FF4F]" />
      {children}
    </div>
  );
}

/* The primary call to action, used in the nav, hero and finale. */
export function LaunchButton({
  size = "lg",
  label = "Launch app",
}: {
  size?: "sm" | "lg";
  label?: string;
}) {
  const lg = size === "lg";
  return (
    <Magnetic strength={lg ? 0.28 : 0.2}>
      <Link
        href="/app"
        className={`group relative inline-flex items-center overflow-hidden rounded-full bg-k-lime font-bold text-[#050606] shadow-[0_0_0_0_rgba(200,255,79,0)] transition-shadow duration-500 hover:shadow-[0_10px_50px_-8px_rgba(200,255,79,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-k-lime focus-visible:ring-offset-4 focus-visible:ring-offset-k-bg ${
          lg ? "h-[60px] gap-4 pl-8 pr-2 text-[17px]" : "h-10 gap-2.5 pl-5 pr-1.5 text-[14px]"
        }`}
      >
        <span className="relative">{label}</span>
        <span
          className={`relative grid place-items-center rounded-full bg-[#050606] text-k-lime transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-45 ${
            lg ? "h-11 w-11" : "h-7 w-7"
          }`}
        >
          <Arrow className={lg ? "h-5 w-5" : "h-3.5 w-3.5"} />
        </span>
      </Link>
    </Magnetic>
  );
}
