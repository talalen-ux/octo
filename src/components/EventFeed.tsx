"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { SwarmEvent } from "@/lib/useSwarm";
import { timeOfDay } from "@/lib/labels";

const KIND: Record<string, { glyph: string; verb: string; tone: string }> = {
  task_created: { glyph: "¶", verb: "Filed", tone: "var(--ink)" },
  task_assigned: { glyph: "→", verb: "Routed", tone: "var(--deep)" },
  task_started: { glyph: "▸", verb: "Underway", tone: "var(--stamp)" },
  task_completed: { glyph: "✓", verb: "Closed", tone: "var(--sage)" },
  agent_created: { glyph: "+", verb: "Mustered", tone: "var(--gold)" },
  agent_status_update: { glyph: "·", verb: "Status", tone: "var(--ink-mute)" },
};

export default function EventFeed({ events }: { events: SwarmEvent[] }) {
  return (
    <div className="flex flex-col overflow-y-auto pr-1 -mr-1 mono">
      <AnimatePresence initial={false}>
        {events.map((e, i) => {
          const meta = KIND[e.kind] || KIND.task_created;
          const isFirst = i === 0;
          return (
            <motion.div
              key={e.id}
              layout
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-baseline gap-2 text-[11px] py-[3px] border-b border-dotted border-rule/60 last:border-b-0"
            >
              <span
                className="text-inkMute shrink-0"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {timeOfDay(e.ts)}
              </span>
              <span
                aria-hidden
                className="shrink-0 w-3 text-center"
                style={{ color: meta.tone }}
              >
                {meta.glyph}
              </span>
              <span
                className="small-caps text-[9.5px] shrink-0"
                style={{ color: meta.tone }}
              >
                {meta.verb}
              </span>
              <span className="text-ink truncate">
                {e.text}
                {isFirst && <span className="ml-1 typewriter" />}
              </span>
            </motion.div>
          );
        })}
      </AnimatePresence>
      {events.length === 0 && (
        <div className="text-[12px] text-inkMute italic py-2">
          The wire is quiet. Lodge an order to begin transmission.
        </div>
      )}
    </div>
  );
}
