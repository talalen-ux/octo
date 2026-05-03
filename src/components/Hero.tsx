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
 * Code-symbol octopus — an ASCII glyph made of programmer punctuation,
 * drawn line-by-line on load with a soft cyan halo.
 */
// Each line is 27 visual chars wide for clean monospace alignment.
const OCTOPUS_LINES = [
  "        ___________        ",
  "       /           \\       ",
  "      |  </>   </>  |      ",
  "      |     ___     |      ",
  "       \\   |___|   /       ",
  "        \\_________/        ",
  "        /| | | | |\\        ",
  "       / | | | | | \\       ",
  "      ;  | | | | |  ;      ",
  "     ;   | | | | |   ;     ",
  "    /    | | | | |    \\    ",
  "   ;    /| | | | |\\    ;   ",
  "  ;    / | | | | | \\    ;  ",
  "  |   ;  | | | | |  ;   |  ",
  "  ;   ;  | | | | |  ;   ;  ",
  "   \\   \\ | | | | | /   /   ",
  "    \\   \\ \\ | | / /   /    ",
  "     \\___\\\\\\|||///___/     ",
  "          '''   '''         ",
];

function CodeOctopus() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* faint cyan halo behind the glyph */}
      <span
        aria-hidden
        className="absolute w-[80%] h-[80%] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(94,234,212,0.16) 0%, rgba(94,234,212,0.04) 45%, transparent 70%)",
          filter: "blur(2px)",
        }}
      />
      <pre
        aria-label="Octopus, made of code symbols"
        className="mono relative select-none"
        style={{
          color: "var(--gold)",
          fontSize: 9,
          lineHeight: "10px",
          letterSpacing: "0.02em",
          textShadow:
            "0 0 6px rgba(94,234,212,0.55), 0 0 1px rgba(94,234,212,0.9)",
          margin: 0,
          padding: 0,
          fontVariantLigatures: "none",
        }}
      >
        {OCTOPUS_LINES.map((line, i) => (
          <span
            key={i}
            className="constellation-star block"
            style={{
              animationDelay: `${i * 70}ms`,
              whiteSpace: "pre",
              opacity: 0.92,
            }}
          >
            {line}
          </span>
        ))}
      </pre>
    </div>
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
            {/* corner reticles */}
            <span aria-hidden className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-l border-t border-gold/70" />
            <span aria-hidden className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-r border-t border-gold/70" />
            <span aria-hidden className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-l border-b border-gold/70" />
            <span aria-hidden className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-r border-b border-gold/70" />
            <CodeOctopus />
            <figcaption className="absolute -bottom-5 right-0 coord">
              Pl. I · &lt;/octopus&gt;
            </figcaption>
          </figure>
        </motion.aside>
      </div>
    </header>
  );
}
