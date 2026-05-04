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
  idle: "var(--leaf)",
  busy: "var(--gold)",
  offline: "var(--star-mute)",
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
  const color = STATUS_COLOR[agent.status];
  return (
    <motion.article
      layout
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
      className="relative pl-5 pr-3 py-3.5 border-b border-rule last:border-b-0 hover:bg-abyss2/40 transition-colors"
    >
      {/* Star + vertical thread */}
      <span
        aria-hidden
        className="absolute left-2 top-3 bottom-3 w-px"
        style={{
          background: `linear-gradient(to bottom, ${color}, transparent)`,
          opacity: 0.55,
        }}
      />
      <span
        aria-hidden
        className="absolute left-[5px] top-[15px] w-[7px] h-[7px] rounded-full"
        style={{
          background: color,
          boxShadow: `0 0 8px ${color}, 0 0 1px ${color}`,
        }}
      >
        {onDuty && (
          <span
            className="absolute inset-0 rounded-full animate-ripple"
            style={{ background: color }}
          />
        )}
      </span>

      <div className="flex items-baseline justify-between gap-2">
        <h4
          className="display truncate"
          style={{ fontSize: 18, color: "var(--star)" }}
        >
          {agent.name}
        </h4>
        <span className="mono text-[9.5px] tracking-[0.18em] text-starFaint shrink-0">
          № {shortId(agent.id)}
        </span>
      </div>

      <div className="mt-0.5 flex items-baseline gap-2 text-[12px] text-starSoft">
        <span className="display" title={agentTypeBlurb[agent.type]}>
          {agentTypeLabel[agent.type]}
        </span>
        <span className="text-starFaint">·</span>
        <span className={STATUS_STAMP[agent.status]}>
          {agentStatusLabel[agent.status]}
        </span>
      </div>

      {agent.skills.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {agent.skills.slice(0, 6).map((s) => (
            <span
              key={s}
              className="mono text-[10px] tracking-wider text-starSoft px-1.5 py-0.5 border border-rule rounded-sm bg-voidDeep/60"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="mt-2.5 flex items-center gap-4 mono text-[10.5px] text-starMute">
        <span>
          <span className="text-starFaint">trust </span>
          <span
            className="text-starSoft"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {Math.round(agent.reputation * 100)}
          </span>
        </span>
        <span>
          <span className="text-starFaint">filed </span>
          <span
            className="text-starSoft"
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
          className="mt-2.5 pt-2 border-t border-dashed border-ruleGold/60 text-[12.5px] text-star leading-snug"
        >
          <span className="mono text-[9.5px] tracking-[0.18em] text-gold mr-2">
            now
          </span>
          <span className="display">{current.title}</span>
        </motion.div>
      )}
    </motion.article>
  );
}
