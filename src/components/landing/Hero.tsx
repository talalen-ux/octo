"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { EASE_OUT, LaunchButton, MaskLines } from "./primitives";
import agentSeated from "@/assets/aikols/agent-seated.png";
import marketPanel from "@/assets/aikols/market-panel.png";
import signalCards from "@/assets/aikols/signal-cards.png";
import platform from "@/assets/aikols/platform.png";

/* Normalised pointer position (-1..1) with spring smoothing. Only wired up
   for fine pointers and when motion is allowed. */
function usePointer() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 55, damping: 17, mass: 0.7 });
  const py = useSpring(my, { stiffness: 55, damping: 17, mass: 0.7 });
  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, mx, my]);
  return { px, py };
}

/* A parallax plane: further-forward planes (higher depth) travel further. */
function Layer({
  px,
  py,
  depth,
  className,
  style,
  children,
}: {
  px: MotionValue<number>;
  py: MotionValue<number>;
  depth: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const x = useTransform(px, (v) => v * depth * -26);
  const y = useTransform(py, (v) => v * depth * -18);
  return (
    <motion.div className={`absolute will-change-transform ${className ?? ""}`} style={{ ...style, x, y }}>
      {children}
    </motion.div>
  );
}

function Agent({ px, py }: { px: MotionValue<number>; py: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const rotateY = useTransform(px, (v) => v * 8);
  const rotateX = useTransform(py, (v) => v * -5);
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 110, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 70, damping: 16, mass: 1, delay: 0.7 }}
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -7, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 2.2 }}
      >
        <motion.div className="relative" style={{ rotateX, rotateY, transformPerspective: 1100 }}>
          <Image
            src={agentSeated}
            alt="An AIKOLs trading agent sitting on a glowing plinth"
            priority
            quality={92}
            sizes="(min-width: 1024px) 440px, 60vw"
            className="h-auto w-full select-none"
            draggable={false}
          />

          {/* Eye boot-up: blooms aligned to the lime bar and cyan cross */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute left-[67.5%] top-[25%] aspect-square w-[30%] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen"
            style={{ background: "radial-gradient(circle, rgba(200,255,79,0.55) 0%, rgba(200,255,79,0.12) 35%, transparent 68%)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.1, 0.95, 0.25, 0.7] }}
            transition={{ duration: 1.2, delay: 1.45, times: [0, 0.18, 0.3, 0.5, 0.65, 1] }}
          />
          <motion.span
            aria-hidden
            className="pointer-events-none absolute left-[85.8%] top-[27.7%] aspect-square w-[18%] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen"
            style={{ background: "radial-gradient(circle, rgba(32,229,234,0.6) 0%, rgba(32,229,234,0.12) 38%, transparent 70%)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0.2, 0.75] }}
            transition={{ duration: 0.9, delay: 1.75, times: [0, 0.3, 0.55, 1] }}
          />

          {/* Visor scan line, clipped to the visor ellipse */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-[44.8%] top-[4.3%] h-[40.4%] w-[50.5%] -rotate-[8deg] overflow-hidden rounded-[50%]"
          >
            <span
              className="k-scan absolute inset-x-0 top-0 block h-[40%] mix-blend-screen"
              style={{ background: "linear-gradient(180deg, transparent, rgba(200,255,79,0.16) 45%, rgba(200,255,79,0.32) 50%, rgba(200,255,79,0.16) 55%, transparent)" }}
            />
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function Floater({
  children,
  delay,
  from,
  float,
}: {
  children: ReactNode;
  delay: number;
  from: { x?: number; y?: number; rotate?: number };
  float: { y: number[]; rotate: number[]; duration: number };
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, filter: "blur(14px)", ...from }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)", x: 0, y: 0, rotate: 0 }}
      transition={{ type: "spring", stiffness: 60, damping: 14, delay }}
    >
      <motion.div
        animate={reduce ? undefined : { y: float.y, rotate: float.rotate }}
        transition={{ duration: float.duration, repeat: Infinity, ease: "easeInOut", delay: delay + 1 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();
  const { px, py } = usePointer();
  const sectionRef = useRef<HTMLElement>(null);

  // Spotlight that trails the cursor across the hero (absolute px)
  const sx = useSpring(useMotionValue(-2000), { stiffness: 90, damping: 22 });
  const sy = useSpring(useMotionValue(-2000), { stiffness: 90, damping: 22 });

  return (
    <section
      ref={sectionRef}
      className="relative isolate min-h-[100svh] overflow-hidden"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse" || !sectionRef.current) return;
        const r = sectionRef.current.getBoundingClientRect();
        sx.set(e.clientX - r.left);
        sy.set(e.clientY - r.top);
      }}
    >
      {/* ── Atmosphere ─────────────────────────────────────────────── */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-[-500px] top-[-500px] -z-10 h-[1000px] w-[1000px] rounded-full"
        style={{
          x: sx,
          y: sy,
          background: "radial-gradient(circle, rgba(200,255,79,0.075) 0%, rgba(200,255,79,0.02) 35%, transparent 62%)",
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -z-10 bottom-[-20%] right-[-12%] h-[110%] w-[80%] rounded-full lg:right-[-8%] lg:w-[62%]"
        style={{ background: "radial-gradient(closest-side, rgba(200,255,79,0.11), rgba(200,255,79,0.035) 55%, transparent)" }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.4, ease: EASE_OUT, delay: 0.4 }}
      />
      <div aria-hidden className="k-grain pointer-events-none absolute inset-0 -z-10 opacity-[0.22]" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1440px] flex-col px-5 pt-[112px] sm:px-8 lg:justify-center lg:px-14 lg:pb-16 lg:pt-[92px]">
        {/* ── Copy ─────────────────────────────────────────────────── */}
        <div className="relative z-10 lg:max-w-[56%]">
          <MaskLines
            as="h1"
            delay={0.3}
            stagger={0.12}
            className="font-grotesk text-[clamp(46px,13.2vw,96px)] font-extrabold leading-[0.9] tracking-[-0.055em] text-white lg:text-[clamp(84px,7.9vw,148px)]"
            lines={[
              "Trading",
              "agents,",
              <span key="l" className="k-glint">for everyone.</span>,
            ]}
          />

          <motion.p
            className="mt-7 max-w-[33ch] text-[17px] leading-[1.5] text-k-mute lg:mt-9 lg:text-[19px]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_OUT, delay: 1.0 }}
          >
            Autonomous agents that watch the market, read the signals and act on
            them, around the clock.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5 lg:mt-11"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_OUT, delay: 1.15 }}
          >
            <LaunchButton />
            <a href="#how" className="k-link text-[16px] font-semibold text-white/75 hover:text-white">
              See how it works
            </a>
          </motion.div>
        </div>

        {/* ── Stage ────────────────────────────────────────────────── */}
        <div className="relative mt-4 flex-1 lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:w-[52%]">
          <div className="relative mx-auto aspect-[10/11] w-full max-w-[560px] lg:absolute lg:bottom-[2%] lg:right-[3%] lg:w-[min(100%,820px,calc((100svh_-_110px)*0.9))] lg:max-w-none">
            {/* Plinth extension */}
            <Layer px={px} py={py} depth={0.25} className="bottom-[3%] right-[-14%] w-[86%]">
              <motion.div
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: 120 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.6, ease: EASE_OUT, delay: 0.55 }}
              >
                <Image src={platform} alt="" aria-hidden priority sizes="(min-width: 1024px) 700px, 90vw" className="h-auto w-full opacity-90" draggable={false} />
              </motion.div>
            </Layer>

            {/* Market panel, top right */}
            <Layer px={px} py={py} depth={1.5} className="right-[1%] top-[4%] w-[19%] lg:right-[2%] lg:top-[6%] lg:w-[17%]">
              <Floater
                delay={1.2}
                from={{ x: 60, y: -40, rotate: 18 }}
                float={{ y: [0, -14, 0], rotate: [5, 2, 5], duration: 7.4 }}
              >
                <Image src={marketPanel} alt="" aria-hidden sizes="160px" className="h-auto w-full drop-shadow-[0_20px_40px_rgba(200,255,79,0.18)]" draggable={false} />
              </Floater>
            </Layer>

            {/* Signal cards, beside the agent's visor */}
            <Layer px={px} py={py} depth={1.15} className="left-[69%] top-[36%] w-[23%] lg:left-[66%] lg:top-[38%] lg:w-[21%]">
              <Floater
                delay={1.35}
                from={{ x: 80, y: 30, rotate: -14 }}
                float={{ y: [0, 11, 0], rotate: [-2, 1, -2], duration: 6.3 }}
              >
                <Image src={signalCards} alt="" aria-hidden sizes="200px" className="h-auto w-full" draggable={false} />
              </Floater>
            </Layer>

            {/* The agent */}
            <Layer px={px} py={py} depth={0.6} className="bottom-[4%] left-0 w-[66%] lg:left-[5%] lg:w-[56%]">
              <Agent px={px} py={py} />
            </Layer>
          </div>
        </div>

        {/* ── Scroll cue ───────────────────────────────────────────── */}
        <motion.a
          href="#agents"
          aria-label="Scroll to meet the agents"
          className="absolute bottom-9 left-14 hidden items-center gap-4 font-mono text-[11px] uppercase tracking-[0.24em] text-k-mute transition-colors hover:text-white lg:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.1 }}
        >
          <span className="k-cue block h-10 w-px bg-white/15" />
          Scroll
        </motion.a>
      </div>
    </section>
  );
}
