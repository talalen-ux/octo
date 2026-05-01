"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { SwarmEvent } from "@/lib/useSwarm";
import Icon from "./Icon";

const KIND_META: Record<
  string,
  { tone: string; icon: React.ReactNode; verb: string }
> = {
  task_created: {
    tone: "text-slate-200",
    icon: <Icon name="plus" size={11} />,
    verb: "New task",
  },
  task_assigned: {
    tone: "text-accent2",
    icon: <Icon name="send" size={11} />,
    verb: "Picked up",
  },
  task_started: {
    tone: "text-accent",
    icon: <Icon name="play" size={11} />,
    verb: "Started",
  },
  task_completed: {
    tone: "text-ok",
    icon: <Icon name="check" size={11} />,
    verb: "Delivered",
  },
  agent_created: {
    tone: "text-ok",
    icon: <Icon name="agent" size={11} />,
    verb: "Joined",
  },
  agent_status_update: {
    tone: "text-slate-400",
    icon: <Icon name="spark" size={11} />,
    verb: "Status",
  },
};

function fmt(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function EventFeed({ events }: { events: SwarmEvent[] }) {
  return (
    <div className="flex flex-col gap-1 overflow-y-auto pr-1 -mr-1">
      <AnimatePresence initial={false}>
        {events.map((e) => {
          const meta = KIND_META[e.kind] || KIND_META.task_created;
          return (
            <motion.div
              key={e.id}
              layout
              initial={{ opacity: 0, x: -10, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="flex items-center gap-2 text-[11px] py-0.5"
            >
              <span className="text-slate-600 tabular-nums w-[60px] shrink-0">
                {fmt(e.ts)}
              </span>
              <span
                className={`flex items-center gap-1 shrink-0 ${meta.tone}`}
              >
                {meta.icon}
                <span className="uppercase tracking-wider text-[10px]">
                  {meta.verb}
                </span>
              </span>
              <span className="text-slate-300 truncate">{e.text}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
      {events.length === 0 && (
        <div className="text-[11px] text-slate-500 italic py-2">
          The swarm is quiet. Spawn an agent or send a task to wake it up.
        </div>
      )}
    </div>
  );
}
