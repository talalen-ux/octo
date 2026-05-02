"use client";

import { motion } from "framer-motion";
import type { Agent, Task } from "@/types";
import {
  agentStatusLabel,
  agentTypeBlurb,
  agentTypeLabel,
  shortId,
} from "@/lib/labels";

const STATUS_DOT: Record<string, string> = {
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
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
      className="relative pl-4 pr-3 py-3 border-b border-rule"
    >
      {/* left rule with status dot */}
      <span
        className="absolute left-0 top-3 bottom-3 w-px"
        style={{ background: STATUS_DOT[agent.status] }}
      />
      <div className="absolute -left-[3px] top-3.5 w-[7px] h-[7px] rounded-full"
        style={{ background: STATUS_DOT[agent.status] }}>
        {onDuty && (
          <span
            className="absolute inset-0 rounded-full animate-ripple"
            style={{ background: "var(--stamp)" }}
          />
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <h4
          className="display truncate"
          style={{
            fontVariationSettings: '"opsz" 24, "WONK" 1',
            fontSize: 19,
            fontWeight: 500,
          }}
        >
          {agent.name}
        </h4>
        <span className="mono small-caps text-[9px] text-inkMute shrink-0">
          № {shortId(agent.id)}
        </span>
      </div>

      <div className="mt-0.5 flex items-baseline gap-2 text-[12px] text-inkSoft italic">
        <span title={agentTypeBlurb[agent.type]}>
          {agentTypeLabel[agent.type]}
        </span>
        <span className="text-inkMute">·</span>
        <span className={STATUS_STAMP[agent.status]}>
          {agentStatusLabel[agent.status]}
        </span>
      </div>

      {agent.skills.length > 0 && (
        <div className="mt-2 text-[12px] text-inkSoft leading-snug">
          <span className="mono small-caps text-[9px] text-inkMute mr-1.5">
            skills
          </span>
          <span className="italic capitalize">
            {agent.skills.join(", ")}
          </span>
        </div>
      )}

      <div className="mt-2 flex items-center gap-4 mono text-[10.5px] text-inkSoft">
        <span>
          <span className="text-inkMute">trust </span>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>
            {Math.round(agent.reputation * 100)}
          </span>
        </span>
        <span>
          <span className="text-inkMute">filed </span>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>
            {agent.completedCount}
          </span>
        </span>
      </div>

      {current && (
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 pt-2 border-t border-dotted border-rule text-[12px] text-ink leading-snug"
        >
          <span className="mono small-caps text-[9px] text-stamp mr-2">
            now
          </span>
          <span className="italic">{current.title}</span>
        </motion.div>
      )}
    </motion.article>
  );
}
