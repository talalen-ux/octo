"use client";

import type { Agent, Task } from "@/types";

const STATUS_CLR: Record<string, string> = {
  idle: "bg-ok",
  busy: "bg-warn",
  offline: "bg-slate-500",
};

export default function AgentCard({
  agent,
  current,
}: {
  agent: Agent;
  current?: Task | null;
}) {
  return (
    <div className="rounded-lg border border-line bg-panel/60 p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative inline-flex w-2.5 h-2.5">
            <span
              className={`absolute inset-0 rounded-full ${STATUS_CLR[agent.status]}`}
            />
            {agent.status === "busy" && (
              <span className="absolute inset-0 rounded-full bg-warn opacity-60 animate-pulseRing" />
            )}
          </span>
          <span className="font-semibold truncate">{agent.name}</span>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-slate-400">
          {agent.type}
        </span>
      </div>
      <div className="flex flex-wrap gap-1">
        {agent.skills.length === 0 && (
          <span className="text-[10px] text-slate-500">no skills</span>
        )}
        {agent.skills.map((s) => (
          <span
            key={s}
            className="text-[10px] px-1.5 py-0.5 rounded bg-panel2 border border-line text-slate-300"
          >
            {s}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span>rep {agent.reputation.toFixed(2)}</span>
        <span>✓ {agent.completedCount}</span>
        <span className="truncate ml-2">{agent.wallet}</span>
      </div>
      {current && (
        <div className="text-[11px] border-t border-line pt-2 text-slate-300">
          <span className="text-slate-500 mr-1">on:</span>
          <span className="truncate">{current.title}</span>
        </div>
      )}
    </div>
  );
}
