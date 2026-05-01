"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import Icon from "./Icon";
import { agentTypeBlurb, agentTypeLabel } from "@/lib/labels";

const SKILL_PALETTE = [
  "analysis",
  "data",
  "email",
  "outreach",
  "trading",
  "ml",
  "research",
  "tx",
];

const TYPES: Array<"research" | "executor" | "router"> = [
  "research",
  "executor",
  "router",
];

export default function CreateAgentForm() {
  const [name, setName] = useState("");
  const [type, setType] = useState<"research" | "executor" | "router">(
    "research",
  );
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function toggleSkill(s: string) {
    setSkillsList((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await api("/api/agents", {
        method: "POST",
        body: JSON.stringify({ name, type, skills: skillsList }),
      });
      setName("");
      setSkillsList([]);
    } catch (e: any) {
      setErr(e.message || "Could not spawn agent");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label className="label">Agent name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="leave blank for a random name"
          className="input"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="label">Role</label>
        <div className="grid grid-cols-3 gap-1.5">
          {TYPES.map((t) => (
            <motion.button
              whileTap={{ scale: 0.96 }}
              type="button"
              key={t}
              onClick={() => setType(t)}
              className={`text-[11px] px-2 py-1.5 rounded-md border transition-colors capitalize text-center ${
                type === t
                  ? "border-accent2/60 bg-accent2/15 text-accent2"
                  : "border-line bg-panel2/60 text-slate-400 hover:text-slate-200 hover:border-line2"
              }`}
            >
              {agentTypeLabel[t]}
            </motion.button>
          ))}
        </div>
        <p className="text-[10px] text-slate-500">{agentTypeBlurb[type]}</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="label">Skills</label>
        <div className="flex flex-wrap gap-1.5">
          {SKILL_PALETTE.map((s) => {
            const active = skillsList.includes(s);
            return (
              <motion.button
                whileTap={{ scale: 0.94 }}
                type="button"
                key={s}
                onClick={() => toggleSkill(s)}
                className={`text-[11px] px-2 py-1 rounded-md border transition-colors capitalize ${
                  active
                    ? "border-accent2/60 bg-accent2/15 text-accent2"
                    : "border-line bg-panel2/60 text-slate-400 hover:text-slate-200 hover:border-line2"
                }`}
              >
                {s}
              </motion.button>
            );
          })}
        </div>
      </div>

      {err && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[11px] text-err flex items-center gap-1"
        >
          <Icon name="warning" size={11} /> {err}
        </motion.div>
      )}

      <motion.button
        whileTap={{ scale: 0.97 }}
        type="submit"
        disabled={busy}
        className="btn-secondary"
      >
        <Icon name="plus" size={14} />
        {busy ? "Spawning…" : "Add agent to swarm"}
      </motion.button>
    </form>
  );
}
