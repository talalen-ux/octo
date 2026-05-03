import type { AgentStatus, TaskStatus } from "@/types";

export const agentStatusLabel: Record<AgentStatus, string> = {
  idle: "Ready",
  busy: "On watch",
  offline: "Stood down",
};

export const taskStatusLabel: Record<TaskStatus, string> = {
  queued: "Awaiting",
  assigned: "Routed",
  in_progress: "In transit",
  completed: "Logged",
  failed: "Lost",
};

export const taskStampClass: Record<TaskStatus, string> = {
  queued: "stamp stamp-ink",
  assigned: "stamp stamp-deep",
  in_progress: "stamp stamp-stamp",
  completed: "stamp stamp-sage",
  failed: "stamp stamp-rose stamp-double",
};

export const agentTypeLabel: Record<string, string> = {
  research: "Scout",
  executor: "Operator",
  router: "Quartermaster",
};

export const agentTypeBlurb: Record<string, string> = {
  research: "Surveys signals and gathers intelligence",
  executor: "Carries out outreach and execution",
  router: "Coordinates work across the fleet",
};

export function summarizeResult(result: unknown): string {
  if (!result || typeof result !== "object") return String(result ?? "");
  const r = result as Record<string, unknown>;
  if (r.analysis) return String(r.analysis);
  if (r.result) return String(r.result);
  if (r.txHash) return `Confirmed — ${r.txHash}`;
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

export function timeOfDay(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
