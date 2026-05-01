"use client";

import { motion } from "framer-motion";
import type { Agent, Task } from "@/types";

const TASK_TONE: Record<string, string> = {
  queued: "border-slate-500/40 text-slate-300",
  assigned: "border-accent2/50 text-accent2",
  in_progress: "border-accent/60 text-accent",
  completed: "border-ok/50 text-ok",
  failed: "border-err/50 text-err",
};

function fmt(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString();
}

export default function TaskRow({
  task,
  agent,
}: {
  task: Task;
  agent?: Agent | null;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-md border bg-panel/60 px-3 py-2 ${TASK_TONE[task.status]}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium truncate text-slate-100">
          {task.title}
        </span>
        <span className="text-[10px] uppercase tracking-widest">
          {task.status.replace("_", " ")}
        </span>
      </div>
      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
        <span className="truncate">
          {agent ? `→ ${agent.name}` : "unassigned"}
        </span>
        <span>{fmt(task.createdAt)}</span>
      </div>
      {task.requiredSkills.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {task.requiredSkills.map((s) => (
            <span
              key={s}
              className="text-[10px] px-1.5 py-0.5 rounded bg-panel2 border border-line text-slate-300"
            >
              {s}
            </span>
          ))}
        </div>
      )}
      {task.status === "completed" && task.result ? (
        <div className="mt-2 text-[11px] text-slate-400 border-t border-line pt-1.5 truncate">
          {summarize(task.result)}
        </div>
      ) : null}
    </motion.div>
  );
}

function summarize(result: unknown): string {
  if (!result || typeof result !== "object") return String(result);
  const r = result as Record<string, unknown>;
  if (r.analysis) return String(r.analysis);
  if (r.result) return String(r.result);
  if (r.txHash) return `tx ${r.txHash}`;
  if (r.status) return `${r.status}${r.to ? " → " + r.to : ""}`;
  return JSON.stringify(r).slice(0, 80);
}
