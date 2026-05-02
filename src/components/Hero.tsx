"use client";

import { motion } from "framer-motion";

function todayString() {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Hero({ connected }: { connected: boolean }) {
  return (
    <header className="relative px-6 sm:px-10 pt-10 pb-6 border-b border-ink">
      {/* Top rule with edition mark */}
      <div className="flex items-center justify-between text-[10px] mono small-caps text-inkSoft mb-6">
        <span>No. 001 — Operations Edition</span>
        <span suppressHydrationWarning>{todayString()}</span>
        <span className="flex items-center gap-2">
          <span
            className={`relative inline-flex w-2.5 h-2.5 ${
              connected ? "" : "opacity-40"
            }`}
          >
            <span
              className={`absolute inset-0 rounded-full ${
                connected ? "bg-stamp" : "bg-inkMute"
              }`}
            />
            {connected && (
              <span className="absolute inset-0 rounded-full bg-stamp animate-ripple" />
            )}
          </span>
          {connected ? "Wire open" : "Wire closed"}
        </span>
      </div>

      {/* Masthead */}
      <div className="grid grid-cols-12 gap-6 items-end">
        <div className="col-span-12 md:col-span-9">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
            className="display leading-[0.92] text-ink"
            style={{
              fontVariationSettings: '"opsz" 144, "WONK" 1, "SOFT" 0',
              fontSize: "clamp(48px, 9vw, 132px)",
              fontWeight: 600,
              letterSpacing: "-0.035em",
            }}
          >
            Octo<span className="italic" style={{ color: "var(--stamp)" }}>·</span>Swarm
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-3 max-w-2xl text-[19px] leading-snug text-inkSoft"
            style={{
              fontVariationSettings: '"opsz" 24, "SOFT" 30',
            }}
          >
            <span className="italic">A live ledger of an autonomous agent fleet.</span>
            {" "}
            Tasks are dispatched, picked up by available hands, and resolved with
            the tools at port — every move recorded as it happens.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="col-span-12 md:col-span-3 flex md:justify-end"
        >
          <div
            className="stamp stamp-double stamp-stamp animate-stamp"
            style={{ animationDelay: "500ms" }}
          >
            <span>Field Bulletin</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom double rule */}
      <div className="mt-8 double-rule origin-left animate-rule" />
    </header>
  );
}
