"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Agent, Task } from "@/types";
import {
  relativeTime,
  summarizeResult,
  taskStampClass,
  taskStatusLabel,
} from "@/lib/labels";

function ProgressBar({
  startedAt,
  duration = 5000,
}: {
  startedAt: number;
  duration?: number;
}) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const elapsed = Date.now() - startedAt;
      setPct(Math.min(96, (elapsed / duration) * 100));
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [startedAt, duration]);
  return (
    <div className="h-[2px] mt-2 relative bg-rule rounded overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 transition-[width]"
        style={{ width: `${pct}%`, background: "var(--stamp)" }}
      />
    </div>
  );
}

export default function TaskRow({
  task,
  agent,
}: {
  task: Task;
  agent?: Agent | null;
  index?: number;
}) {
  const isFinal = task.status === "completed" || task.status === "failed";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -6 }}
      transition={{ type: "spring", stiffness: 240, damping: 26 }}
      className="px-3 py-3 mb-2 rounded-md border border-rule bg-paper2 hover:border-ruleStrong transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <h4
          className="display text-[13.5px] leading-snug"
          style={{ fontWeight: 600 }}
        >
          {task.title}
        </h4>
        <span className={`${taskStampClass[task.status]} shrink-0`}>
          {taskStatusLabel[task.status]}
        </span>
      </div>

      <div className="mt-1 flex items-center justify-between gap-2 text-[11.5px] text-inkSoft">
        <span>
          {agent ? (
            <>
              <span className="text-inkMute">by </span>
              {agent.name}
            </>
          ) : (
            <span className="text-inkMute">unassigned</span>
          )}
        </span>
        <span
          className="mono text-[10.5px] text-inkMute"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {relativeTime(task.createdAt)}
        </span>
      </div>

      {task.requiredSkills.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {task.requiredSkills.map((s) => (
            <span
              key={s}
              className="mono text-[10px] text-inkSoft px-1.5 py-0.5 rounded border border-rule bg-paper"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      {task.status === "in_progress" && task.startedAt && (
        <ProgressBar startedAt={task.startedAt} />
      )}

      {isFinal && Boolean(task.result) && (
        <blockquote
          className={`mt-2 pl-3 border-l-2 ${
            task.status === "failed"
              ? "border-stamp text-stamp/90"
              : "border-sage text-inkSoft"
          } text-[12.5px] leading-snug`}
        >
          {summarizeResult(task.result)}
        </blockquote>
      )}
    </motion.article>
  );
}
