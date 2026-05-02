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

function ProgressInk({
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
    <div className="h-[3px] mt-2 relative">
      <div
        className="absolute inset-y-0 left-0 right-0 ink-rule opacity-50"
        aria-hidden
      />
      <div
        className="absolute inset-y-0 left-0 transition-[width]"
        style={{
          width: `${pct}%`,
          background: "var(--stamp)",
          boxShadow: "0 0 0 1px var(--stamp)",
        }}
      />
    </div>
  );
}

export default function TaskRow({
  task,
  agent,
  index,
}: {
  task: Task;
  agent?: Agent | null;
  index?: number;
}) {
  const isFinal = task.status === "completed" || task.status === "failed";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -6 }}
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
      className="relative grid grid-cols-[28px_1fr] gap-2 pb-3 mb-3 border-b border-rule last:border-b-0"
    >
      {typeof index === "number" && (
        <span
          className="mono small-caps text-[10px] text-inkMute pt-[3px]"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      )}
      <div>
        <div className="flex items-baseline justify-between gap-2">
          <h4
            className="display"
            style={{
              fontVariationSettings: '"opsz" 24, "SOFT" 20',
              fontSize: 17,
              fontWeight: 500,
              lineHeight: 1.15,
            }}
          >
            {task.title}
          </h4>
          <span className={taskStampClass[task.status]}>
            {taskStatusLabel[task.status]}
          </span>
        </div>

        <div className="mt-1 flex items-baseline justify-between gap-2 text-[11.5px] text-inkSoft">
          <span className="italic">
            {agent ? (
              <>
                <span className="text-inkMute mono small-caps text-[9px] mr-1">
                  by
                </span>
                {agent.name}
              </>
            ) : (
              <span className="text-inkMute">awaiting a free hand…</span>
            )}
          </span>
          <span
            className="mono text-[10px] text-inkMute"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {relativeTime(task.createdAt)}
          </span>
        </div>

        {task.requiredSkills.length > 0 && (
          <div className="mt-1.5 text-[11px] text-inkMute italic">
            <span className="mono small-caps text-[9px] mr-1.5 not-italic">
              req
            </span>
            <span className="capitalize">
              {task.requiredSkills.join(", ")}
            </span>
          </div>
        )}

        {task.status === "in_progress" && task.startedAt && (
          <ProgressInk startedAt={task.startedAt} />
        )}

        {isFinal && Boolean(task.result) && (
          <blockquote
            className={`mt-2 pl-3 border-l-2 ${
              task.status === "failed"
                ? "border-stamp text-stamp/90"
                : "border-sage text-ink"
            } text-[12.5px] italic leading-snug`}
            style={{
              fontVariationSettings: '"opsz" 18, "SOFT" 30',
            }}
          >
            {summarizeResult(task.result)}
          </blockquote>
        )}
      </div>
    </motion.article>
  );
}
