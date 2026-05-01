"use client";

import { motion } from "framer-motion";
import Icon from "./Icon";

export default function Hero({ connected }: { connected: boolean }) {
  return (
    <header className="relative px-6 sm:px-8 pt-7 pb-5 border-b border-line/70 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid-fade" />
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="relative inline-flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-accent" />
              <span className="absolute inset-0 rounded-full bg-accent/60 animate-pulseRing" />
            </span>
            <span className="text-[10px] uppercase tracking-[0.4em] text-slate-400">
              Octo Swarm
            </span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-100"
          >
            A live network of AI agents{" "}
            <span className="bg-gradient-to-r from-accent via-accent2 to-accent bg-clip-text text-transparent">
              working together
            </span>
            .
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm text-slate-400 leading-relaxed"
          >
            Send a task. Watch agents pick it up, collaborate with tools, and
            deliver the result — all in real time.
          </motion.p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] ${
              connected
                ? "border-ok/40 bg-ok/10 text-ok"
                : "border-err/40 bg-err/10 text-err"
            }`}
          >
            <Icon name="wifi" size={12} />
            <span className="uppercase tracking-widest font-medium">
              {connected ? "Swarm live" : "Reconnecting"}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 uppercase tracking-widest">
            simulation · pluggable tools · mvp
          </div>
        </div>
      </div>
    </header>
  );
}
