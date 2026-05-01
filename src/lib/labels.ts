import type { AgentStatus, TaskStatus } from "@/types";

export const agentStatusLabel: Record<AgentStatus, string> = {
  idle: "Available",
  busy: "Working",
  offline: "Offline",
};

export const agentStatusTone: Record<AgentStatus, string> = {
  idle: "text-ok",
  busy: "text-warn",
  offline: "text-slate-400",
};

export const agentStatusDot: Record<AgentStatus, string> = {
  idle: "bg-ok",
  busy: "bg-warn",
  offline: "bg-slate-500",
};

export const taskStatusLabel: Record<TaskStatus, string> = {
  queued: "Waiting",
  assigned: "Picked up",
  in_progress: "In progress",
  completed: "Delivered",
  failed: "Failed",
};

export const taskStatusTone: Record<
  TaskStatus,
  { text: string; border: string; bg: string }
> = {
  queued: {
    text: "text-slate-300",
    border: "border-slate-500/40",
    bg: "bg-slate-500/10",
  },
  assigned: {
    text: "text-accent2",
    border: "border-accent2/50",
    bg: "bg-accent2/10",
  },
  in_progress: {
    text: "text-accent",
    border: "border-accent/60",
    bg: "bg-accent/10",
  },
  completed: { text: "text-ok", border: "border-ok/50", bg: "bg-ok/10" },
  failed: { text: "text-err", border: "border-err/50", bg: "bg-err/10" },
};

export const agentTypeLabel: Record<string, string> = {
  research: "Researcher",
  executor: "Executor",
  router: "Router",
};

export const agentTypeBlurb: Record<string, string> = {
  research: "Gathers and analyzes information",
  executor: "Carries out actions and outreach",
  router: "Coordinates work across the swarm",
};

export function summarizeResult(result: unknown): string {
  if (!result || typeof result !== "object") return String(result ?? "");
  const r = result as Record<string, unknown>;
  if (r.analysis) return String(r.analysis);
  if (r.result) return String(r.result);
  if (r.txHash) return `Transaction ${r.txHash}`;
  if (r.status) return `${r.status}${r.to ? " → " + r.to : ""}`;
  return JSON.stringify(r).slice(0, 80);
}

export function shortId(id: string, take = 4): string {
  return id.slice(-take).toUpperCase();
}

export function relativeTime(ts: number): string {
  const diff = Math.max(0, Date.now() - ts);
  const s = Math.floor(diff / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}
