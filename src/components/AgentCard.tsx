"use client";

import { motion } from "framer-motion";
import type { Agent, Task } from "@/types";
import {
  agentStatusDot,
  agentStatusLabel,
  agentStatusTone,
  agentTypeBlurb,
  agentTypeLabel,
  shortId,
} from "@/lib/labels";
import Icon from "./Icon";

export default function AgentCard({
  agent,
  current,
}: {
  agent: Agent;
  current?: Task | null;
}) {
  const isBusy = agent.status === "busy";
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -1 }}
      className="card card-hover p-3 flex flex-col gap-2 relative overflow-hidden"
    >
      {isBusy && (
        <span className="pointer-events-none absolute -inset-px rounded-xl ring-1 ring-warn/30 animate-breathe" />
      )}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative inline-flex w-2.5 h-2.5 shrink-0">
            <span
              className={`absolute inset-0 rounded-full ${agentStatusDot[agent.status]}`}
            />
            {isBusy && (
              <span className="absolute inset-0 rounded-full bg-warn/70 animate-pulseRing" />
            )}
          </span>
          <span className="font-semibold truncate text-slate-100">
            {agent.name}
          </span>
        </div>
        <span
          className={`text-[10px] uppercase tracking-widest font-medium ${agentStatusTone[agent.status]}`}
        >
          {agentStatusLabel[agent.status]}
        </span>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500">
        <span title={agentTypeBlurb[agent.type]} className="text-slate-400">
          {agentTypeLabel[agent.type]}
        </span>
        <span>#{shortId(agent.id)}</span>
      </div>

      <div className="flex flex-wrap gap-1">
        {agent.skills.length === 0 && (
          <span className="text-[10px] text-slate-500 italic">
            no skills set
          </span>
        )}
        {agent.skills.map((s) => (
          <span key={s} className="chip capitalize">
            {s}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
        <span
          className="flex items-center gap-1"
          title="Trust score earned through completed work"
        >
          <Icon name="spark" size={11} className="text-accent2" />
          <span className="text-slate-300">
            {Math.round(agent.reputation * 100)}
          </span>
          <span className="text-slate-500">trust</span>
        </span>
        <span
          className="flex items-center gap-1"
          title="Tasks delivered"
        >
          <Icon name="check" size={11} className="text-ok" />
          <span className="text-slate-300">{agent.completedCount}</span>
          <span className="text-slate-500">done</span>
        </span>
      </div>

      {current && (
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-1 pt-2 border-t border-line/70 flex items-center gap-2"
        >
          <span className="relative w-1.5 h-1.5">
            <span className="absolute inset-0 rounded-full bg-accent" />
            <span className="absolute inset-0 rounded-full bg-accent/70 animate-pulseRing" />
          </span>
          <span className="text-[11px] text-slate-300 truncate">
            <span className="text-slate-500">working on </span>
            {current.title}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
