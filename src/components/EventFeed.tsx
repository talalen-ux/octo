"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { SwarmEvent } from "@/lib/useSwarm";
import { timeOfDay } from "@/lib/labels";

const KIND: Record<
  string,
  { glyph: string; verb: string; tone: string }
> = {
  task_created: { glyph: "❉", verb: "task.filed", tone: "var(--star-soft)" },
  task_assigned: { glyph: "↦", verb: "task.routed", tone: "var(--azure)" },
  task_started: { glyph: "▸", verb: "task.transit", tone: "var(--gold)" },
  task_completed: { glyph: "✶", verb: "task.logged", tone: "var(--leaf)" },
  agent_created: { glyph: "✦", verb: "agent.muster", tone: "var(--violet)" },
  agent_status_update: {
    glyph: "·",
    verb: "agent.status",
    tone: "var(--star-mute)",
  },
};

export default function EventFeed({ events }: { events: SwarmEvent[] }) {
  return (
    <div className="flex flex-col mono">
      <AnimatePresence initial={false}>
        {events.map((e, i) => {
          const meta = KIND[e.kind] || KIND.task_created;
          const isFirst = i === 0;
          return (
            <motion.div
              key={e.id}
              layout
              initial={{ opacity: 0, x: -3 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-[68px_18px_120px_1fr] items-baseline gap-2 text-[11.5px] py-[3.5px] border-b border-dotted border-ruleGold/40 last:border-b-0"
            >
              <span
                className="text-starFaint"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {timeOfDay(e.ts)}
              </span>
              <span
                aria-hidden
                className="text-center"
                style={{ color: meta.tone, textShadow: `0 0 6px ${meta.tone}` }}
              >
                {meta.glyph}
              </span>
              <span
                className="text-[10px] tracking-[0.16em] uppercase truncate"
                style={{ color: meta.tone }}
              >
                {meta.verb}
              </span>
              <span className="text-starSoft truncate">
                {e.text}
                {isFirst && <span className="ml-1 typewriter" />}
              </span>
            </motion.div>
          );
        })}
      </AnimatePresence>
      {events.length === 0 && (
        <div className="text-[12.5px] text-starMute display py-3">
          The wire is quiet. Lodge an order to begin transmission.
        </div>
      )}
    </div>
  );
}
