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

function ProgressArc({
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
    <div className="h-[2px] mt-2.5 relative bg-rule overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 transition-[width]"
        style={{
          width: `${pct}%`,
          background:
            "linear-gradient(to right, var(--gold-deep), var(--gold))",
          boxShadow: "0 0 8px var(--gold-glow)",
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
      transition={{ type: "spring", stiffness: 230, damping: 26 }}
      className="relative grid grid-cols-[28px_1fr] gap-2 pb-3 mb-3 border-b border-dashed border-ruleGold/55 last:border-b-0 last:mb-0"
    >
      {typeof index === "number" && (
        <span
          className="mono text-[10px] tracking-[0.18em] text-starFaint pt-[5px]"
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
              fontSize: 16.5,
              lineHeight: 1.2,
              color: "var(--star)",
            }}
          >
            {task.title}
          </h4>
          <span className={`${taskStampClass[task.status]} shrink-0`}>
            {taskStatusLabel[task.status]}
          </span>
        </div>

        <div className="mt-1 flex items-baseline justify-between gap-2 text-[11.5px] text-starSoft">
          <span>
            {agent ? (
              <>
                <span className="mono text-[9.5px] tracking-[0.18em] text-starMute mr-1">
                  by
                </span>
                <span className="display">{agent.name}</span>
              </>
            ) : (
              <span className="text-starMute display">
                awaiting a free hand…
              </span>
            )}
          </span>
          <span
            className="mono text-[10px] text-starMute"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {relativeTime(task.createdAt)}
          </span>
        </div>

        {task.requiredSkills.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1 items-center">
            <span className="mono text-[9px] tracking-[0.18em] text-starFaint">
              req
            </span>
            {task.requiredSkills.map((s) => (
              <span
                key={s}
                className="mono text-[10px] tracking-wider text-starSoft px-1.5 py-0.5 border border-rule rounded-sm bg-voidDeep/60"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {task.status === "in_progress" && task.startedAt && (
          <ProgressArc startedAt={task.startedAt} />
        )}

        {isFinal && Boolean(task.result) && (
          <blockquote
            className={`mt-2.5 pl-3 border-l ${
              task.status === "failed"
                ? "border-rose text-rose/90"
                : "border-leaf text-star"
            } text-[12.5px] leading-snug display`}
          >
            {summarizeResult(task.result)}
          </blockquote>
        )}
      </div>
    </motion.article>
  );
}
