"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { SwarmEvent } from "@/lib/useSwarm";

const KIND_TONE: Record<string, string> = {
  task_created: "text-slate-300",
  task_assigned: "text-accent2",
  task_started: "text-accent",
  task_completed: "text-ok",
  agent_created: "text-ok",
  agent_status_update: "text-slate-400",
};

function fmt(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString();
}

export default function EventFeed({ events }: { events: SwarmEvent[] }) {
  return (
    <div className="flex flex-col gap-1 overflow-y-auto pr-1">
      <AnimatePresence initial={false}>
        {events.map((e) => (
          <motion.div
            key={e.id}
            layout
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-baseline gap-2 text-[11px]"
          >
            <span className="text-slate-600 tabular-nums">{fmt(e.ts)}</span>
            <span className={KIND_TONE[e.kind] || "text-slate-300"}>
              {e.text}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
      {events.length === 0 && (
        <div className="text-[11px] text-slate-600">waiting for activity…</div>
      )}
    </div>
  );
}
