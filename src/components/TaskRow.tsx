"use client";

import { motion } from "framer-motion";
import type { Agent, Task } from "@/types";
import {
  relativeTime,
  summarizeResult,
  taskStatusLabel,
  taskStatusTone,
} from "@/lib/labels";
import Icon from "./Icon";
import { useEffect, useState } from "react";

function StatusBadge({ status }: { status: Task["status"] }) {
  const tone = taskStatusTone[status];
  const showDot =
    status === "queued" || status === "assigned" || status === "in_progress";
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded-md border ${tone.border} ${tone.text} ${tone.bg}`}
    >
      {showDot && (
        <span
          className={`inline-block w-1.5 h-1.5 rounded-full ${
            status === "queued"
              ? "bg-slate-400"
              : status === "assigned"
                ? "bg-accent2"
                : "bg-accent animate-pulse"
          }`}
        />
      )}
      {status === "completed" && <Icon name="check" size={10} />}
      {status === "failed" && <Icon name="warning" size={10} />}
      {taskStatusLabel[status]}
    </span>
  );
}

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
      const next = Math.min(95, (elapsed / duration) * 100);
      setPct(next);
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [startedAt, duration]);
  return (
    <div className="h-1 bg-line/60 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-accent via-accent2 to-accent"
        style={{
          backgroundSize: "200% 100%",
          width: `${pct}%`,
        }}
        animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
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
}) {
  const tone = taskStatusTone[task.status];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4 }}
      whileHover={{ y: -1 }}
      transition={{ type: "spring", stiffness: 240, damping: 24 }}
      className={`card card-hover px-3 py-2.5 border ${tone.border}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium text-slate-100 truncate">
          {task.title}
        </span>
        <StatusBadge status={task.status} />
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
        <span className="truncate flex items-center gap-1">
          {agent ? (
            <>
              <Icon name="agent" size={11} className="text-slate-400" />
              <span className="text-slate-400">{agent.name}</span>
            </>
          ) : (
            <span className="italic">finding the right agent…</span>
          )}
        </span>
        <span className="flex items-center gap-1">
          <Icon name="clock" size={11} />
          {relativeTime(task.createdAt)}
        </span>
      </div>

      {task.requiredSkills.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {task.requiredSkills.map((s) => (
            <span key={s} className="chip capitalize">
              {s}
            </span>
          ))}
        </div>
      )}

      {task.status === "in_progress" && task.startedAt && (
        <div className="mt-2">
          <ProgressBar startedAt={task.startedAt} />
        </div>
      )}

      {(task.status === "completed" || task.status === "failed") &&
        Boolean(task.result) && (
          <div
            className={`mt-2 text-[11px] border-t border-line/70 pt-1.5 truncate ${
              task.status === "failed" ? "text-err/80" : "text-slate-300"
            }`}
          >
            <span className="text-slate-500 mr-1">result:</span>
            {summarizeResult(task.result)}
          </div>
        )}
    </motion.div>
  );
}
