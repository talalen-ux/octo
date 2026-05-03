"use client";

import { motion } from "framer-motion";
import type { Agent, Task } from "@/types";
import {
  agentStatusLabel,
  agentTypeBlurb,
  agentTypeLabel,
  shortId,
} from "@/lib/labels";

const STATUS_COLOR: Record<string, string> = {
  idle: "var(--sage)",
  busy: "var(--stamp)",
  offline: "var(--ink-mute)",
};

const STATUS_STAMP: Record<string, string> = {
  idle: "stamp stamp-sage",
  busy: "stamp stamp-stamp",
  offline: "stamp stamp-ink",
};

export default function AgentCard({
  agent,
  current,
}: {
  agent: Agent;
  current?: Task | null;
}) {
  const onDuty = agent.status === "busy";
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
      className="relative px-3 py-3 border-b border-rule last:border-b-0 hover:bg-paper2 transition-colors"
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative inline-flex w-2 h-2 shrink-0">
            <span
              className="absolute inset-0 rounded-full"
              style={{ background: STATUS_COLOR[agent.status] }}
            />
            {onDuty && (
              <span
                className="absolute inset-0 rounded-full animate-ping"
                style={{ background: STATUS_COLOR[agent.status] }}
              />
            )}
          </span>
          <h4
            className="display text-[13.5px] truncate"
            style={{ fontWeight: 600 }}
          >
            {agent.name}
          </h4>
        </div>
        <span className="mono text-[10px] text-inkMute shrink-0">
          {shortId(agent.id)}
        </span>
      </div>

      <div className="flex items-center gap-2 text-[11.5px] text-inkSoft">
        <span title={agentTypeBlurb[agent.type]}>
          {agentTypeLabel[agent.type]}
        </span>
        <span className="text-rule">·</span>
        <span className={STATUS_STAMP[agent.status]}>
          {agentStatusLabel[agent.status]}
        </span>
      </div>

      {agent.skills.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {agent.skills.slice(0, 6).map((s) => (
            <span
              key={s}
              className="mono text-[10px] text-inkSoft px-1.5 py-0.5 rounded border border-rule bg-paper"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="mt-2 flex items-center gap-4 mono text-[10.5px] text-inkMute">
        <span>
          trust{" "}
          <span
            className="text-inkSoft"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {Math.round(agent.reputation * 100)}
          </span>
        </span>
        <span>
          done{" "}
          <span
            className="text-inkSoft"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {agent.completedCount}
          </span>
        </span>
      </div>

      {current && (
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 pt-2 border-t border-rule text-[12px] text-inkSoft leading-snug"
        >
          <span className="mono text-[10px] text-stamp mr-2">running</span>
          <span>{current.title}</span>
        </motion.div>
      )}
    </motion.article>
  );
}
