"use client";

import { motion } from "framer-motion";

function todayString() {
  return new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Octans — five-star southern constellation.
 * Coordinates are normalized 0..1 within the SVG viewBox (240 × 200).
 */
const OCTANS = [
  { id: "ν", x: 36, y: 122, r: 2.6, label: "ν Oct" },
  { id: "β", x: 92, y: 58, r: 3.4, label: "β Oct" },
  { id: "δ", x: 142, y: 96, r: 2.9, label: "δ Oct" },
  { id: "ε", x: 196, y: 52, r: 2.4, label: "ε Oct" },
  { id: "σ", x: 118, y: 168, r: 4.2, label: "σ Oct · pole" },
];

const EDGES: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [2, 4],
  [4, 0],
];

function Constellation() {
  return (
    <svg
      viewBox="0 0 240 200"
      className="w-full h-full"
      role="img"
      aria-label="Octans constellation"
    >
      <defs>
        <radialGradient id="halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(94, 234, 212,0.55)" />
          <stop offset="60%" stopColor="rgba(94, 234, 212,0.08)" />
          <stop offset="100%" stopColor="rgba(94, 234, 212,0)" />
        </radialGradient>
      </defs>

      {/* concentric celestial coordinate rings */}
      <g
        stroke="var(--rule-gold)"
        strokeWidth="0.5"
        fill="none"
        opacity="0.55"
      >
        <circle cx="118" cy="168" r="22" />
        <circle cx="118" cy="168" r="46" strokeDasharray="1 3" />
        <circle cx="118" cy="168" r="80" strokeDasharray="1 3" />
      </g>

      {/* declination crosshair */}
      <g
        stroke="var(--rule-gold)"
        strokeWidth="0.4"
        opacity="0.45"
        strokeDasharray="2 4"
      >
        <line x1="118" y1="158" x2="118" y2="178" />
        <line x1="108" y1="168" x2="128" y2="168" />
      </g>

      {/* connecting hairlines (drawn in) */}
      {EDGES.map(([a, b], i) => {
        const A = OCTANS[a];
        const B = OCTANS[b];
        const len = Math.hypot(A.x - B.x, A.y - B.y);
        return (
          <line
            key={`e${i}`}
            x1={A.x}
            y1={A.y}
            x2={B.x}
            y2={B.y}
            className="constellation-line"
            style={
              {
                stroke: "var(--gold-deep)",
                strokeWidth: 0.7,
                strokeDasharray: `${len}`,
                strokeDashoffset: len,
                ["--len" as string]: len.toFixed(1),
                animationDelay: `${300 + i * 130}ms`,
              } as React.CSSProperties
            }
          />
        );
      })}

      {/* stars + halos */}
      {OCTANS.map((s, i) => (
        <g
          key={s.id}
          className="constellation-star"
          style={{ animationDelay: `${i * 120}ms` }}
        >
          <circle cx={s.x} cy={s.y} r={s.r * 4} fill="url(#halo)" />
          <circle cx={s.x} cy={s.y} r={s.r} className="star-point" />
          <circle
            cx={s.x}
            cy={s.y}
            r={s.r * 0.45}
            fill="var(--void-deep)"
            opacity="0.55"
          />
        </g>
      ))}

      {/* labels in italic serif */}
      {OCTANS.map((s, i) => (
        <text
          key={`t${s.id}`}
          x={s.x + s.r + 5}
          y={s.y + 3}
          fontSize="7.5"
          fontStyle="italic"
          fill="var(--star-mute)"
          fontFamily="var(--font-display)"
          className="constellation-star"
          style={{ animationDelay: `${600 + i * 120}ms` }}
        >
          {s.label}
        </text>
      ))}
    </svg>
  );
}

export default function Hero({ connected }: { connected: boolean }) {
  return (
    <header className="relative px-6 sm:px-10 pt-7 pb-10 border-b border-ruleGold overflow-hidden">
      {/* Top metadata bar */}
      <div className="flex items-center justify-between gap-4 mono text-[10.5px] text-starMute">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <span
              aria-hidden
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "var(--gold)",
                boxShadow: "0 0 8px var(--gold)",
              }}
            />
            <span className="tracking-[0.18em] uppercase text-gold">
              Atlas of Octans
            </span>
          </span>
          <span className="hidden sm:inline coord">
            RA · 21h 24m · Dec −78°·24′
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span suppressHydrationWarning className="hidden sm:inline">
            {todayString()}
          </span>
          <span className="flex items-center gap-2">
            <span className="relative inline-flex w-2 h-2">
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  background: connected ? "var(--leaf)" : "var(--star-mute)",
                  boxShadow: connected ? "0 0 8px var(--leaf)" : "none",
                }}
              />
              {connected && (
                <span
                  className="absolute inset-0 rounded-full animate-ripple"
                  style={{ background: "var(--leaf)" }}
                />
              )}
            </span>
            <span
              className={`tracking-[0.18em] uppercase ${
                connected ? "text-leaf" : "text-starMute"
              }`}
            >
              {connected ? "Wire open" : "Wire closed"}
            </span>
          </span>
        </div>
      </div>

      {/* Sweep rule */}
      <div className="mt-5 mb-8 hairline rule-sweep" />

      {/* Masthead grid */}
      <div className="grid grid-cols-12 gap-6 items-end">
        <div className="col-span-12 md:col-span-8 lg:col-span-9">
          <div className="flex items-baseline gap-3">
            <span className="label">Folio I —</span>
            <span className="coord">South Celestial Pole</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
            className="mt-3 leading-[0.92]"
            style={{
              fontFamily: "var(--font-display), Georgia, serif",
              fontSize: "clamp(54px, 11vw, 156px)",
              fontWeight: 400,
              letterSpacing: "-0.035em",
              color: "var(--star)",
            }}
          >
            Octo
            <span
              style={{
                color: "var(--gold)",
                fontStyle: "italic",
                fontWeight: 300,
              }}
            >
              ·
            </span>
            <span
              style={{
                fontStyle: "italic",
                fontWeight: 400,
                color: "var(--star)",
              }}
            >
              Swarm
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-5 max-w-2xl text-[16px] leading-relaxed text-starSoft"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="italic text-star">
              A celestial atlas of an autonomous agent fleet.
            </span>{" "}
            Tasks are dispatched, picked up by the nearest available hand, and
            resolved by the instruments at port — every transit logged as it
            crosses the meridian.
          </motion.p>
        </div>

        {/* Constellation panel */}
        <motion.aside
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="col-span-12 md:col-span-4 lg:col-span-3 md:justify-self-end"
        >
          <figure className="w-[260px] aspect-[6/5] relative">
            <div className="absolute inset-0 border border-ruleGold/70 rounded-sm pointer-events-none" />
            <div className="absolute inset-2 border border-rule pointer-events-none" />
            <div className="absolute inset-0 p-3">
              <Constellation />
            </div>
            <figcaption className="absolute -bottom-5 right-0 coord">
              Pl. I · Octans
            </figcaption>
          </figure>
        </motion.aside>
      </div>
    </header>
  );
}
