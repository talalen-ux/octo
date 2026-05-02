"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { agentTypeBlurb, agentTypeLabel } from "@/lib/labels";

const SKILLS = [
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
  const [skills, setSkills] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function toggle(s: string) {
    setSkills((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await api("/api/agents", {
        method: "POST",
        body: JSON.stringify({ name, type, skills }),
      });
      setName("");
      setSkills([]);
    } catch (ex: any) {
      setErr(ex.message || "Could not enlist the agent");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <label className="block">
        <span className="mono small-caps text-[9.5px] text-inkMute">
          Agent name
        </span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="(leave blank for a number)"
          className="field mt-1"
        />
      </label>

      <div>
        <span className="mono small-caps text-[9.5px] text-inkMute">Role</span>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {TYPES.map((t) => {
            const on = type === t;
            return (
              <motion.button
                whileTap={{ scale: 0.96 }}
                type="button"
                key={t}
                onClick={() => setType(t)}
                className="mono text-[10.5px] tracking-[0.18em] uppercase px-2 py-2 text-center transition-all"
                style={{
                  border: "1px solid var(--ink)",
                  background: on ? "var(--ink)" : "transparent",
                  color: on ? "var(--paper)" : "var(--ink)",
                }}
              >
                {agentTypeLabel[t]}
              </motion.button>
            );
          })}
        </div>
        <p className="mt-1.5 text-[11px] text-inkSoft italic">
          {agentTypeBlurb[type]}
        </p>
      </div>

      <div>
        <span className="mono small-caps text-[9.5px] text-inkMute">
          Skills
        </span>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {SKILLS.map((s) => {
            const on = skills.includes(s);
            return (
              <motion.button
                whileTap={{ scale: 0.94 }}
                type="button"
                key={s}
                onClick={() => toggle(s)}
                className="mono text-[10.5px] tracking-[0.16em] uppercase px-2 py-1"
                style={{
                  border: "1px solid var(--ink)",
                  background: on ? "var(--stamp)" : "transparent",
                  color: on ? "var(--paper)" : "var(--ink)",
                  borderColor: on ? "var(--stamp)" : "var(--ink)",
                }}
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
          className="text-[12px] text-stamp italic"
        >
          ✕ {err}
        </motion.div>
      )}

      <button type="submit" disabled={busy} className="btn-stamp">
        {busy ? "Enlisting…" : "Enlist agent"}
      </button>
    </form>
  );
}
