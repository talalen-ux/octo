"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { SwarmEvent } from "@/lib/useSwarm";
import { timeOfDay } from "@/lib/labels";

const KIND: Record<string, { verb: string; tone: string }> = {
  task_created: { verb: "task.created", tone: "var(--ink-soft)" },
  task_assigned: { verb: "task.assigned", tone: "var(--deep)" },
  task_started: { verb: "task.started", tone: "var(--stamp)" },
  task_completed: { verb: "task.completed", tone: "var(--sage)" },
  agent_created: { verb: "agent.created", tone: "var(--gold)" },
  agent_status_update: { verb: "agent.status", tone: "var(--ink-mute)" },
};

export default function EventFeed({ events }: { events: SwarmEvent[] }) {
  return (
    <div className="flex flex-col mono">
      <AnimatePresence initial={false}>
        {events.map((e) => {
          const meta = KIND[e.kind] || KIND.task_created;
          return (
            <motion.div
              key={e.id}
              layout
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-baseline gap-3 text-[11.5px] py-1"
            >
              <span
                className="text-inkMute shrink-0"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {timeOfDay(e.ts)}
              </span>
              <span
                className="shrink-0 w-[110px] truncate"
                style={{ color: meta.tone }}
              >
                {meta.verb}
              </span>
              <span className="text-inkSoft truncate">{e.text}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
      {events.length === 0 && (
        <div className="text-[12px] text-inkMute py-2">
          No events yet. Submit a task to begin.
        </div>
      )}
    </div>
  );
}
