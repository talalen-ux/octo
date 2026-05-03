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
      setErr(ex.message || "Could not create agent");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <label className="block">
        <span className="small-caps text-[10px] text-inkMute">Name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Auto-generated if blank"
          className="field mt-1.5"
        />
      </label>

      <div>
        <span className="small-caps text-[10px] text-inkMute">Role</span>
        <div className="mt-1.5 grid grid-cols-3 gap-1">
          {TYPES.map((t) => {
            const on = type === t;
            return (
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                key={t}
                onClick={() => setType(t)}
                className="text-[12px] px-2 py-1.5 rounded-md transition-colors"
                style={{
                  border: "1px solid",
                  borderColor: on ? "var(--ink)" : "var(--rule)",
                  background: on ? "var(--ink)" : "transparent",
                  color: on ? "var(--paper)" : "var(--ink-soft)",
                }}
              >
                {agentTypeLabel[t]}
              </motion.button>
            );
          })}
        </div>
        <p className="mt-1.5 text-[11.5px] text-inkMute">
          {agentTypeBlurb[type]}
        </p>
      </div>

      <div>
        <span className="small-caps text-[10px] text-inkMute">Skills</span>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {SKILLS.map((s) => {
            const on = skills.includes(s);
            return (
              <motion.button
                whileTap={{ scale: 0.94 }}
                type="button"
                key={s}
                onClick={() => toggle(s)}
                className="mono text-[11px] px-2 py-1 rounded-md transition-colors"
                style={{
                  border: "1px solid",
                  borderColor: on ? "var(--stamp)" : "var(--rule)",
                  background: on ? "rgba(255,90,74,0.12)" : "transparent",
                  color: on ? "var(--stamp)" : "var(--ink-soft)",
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
          className="text-[12px] text-stamp"
        >
          {err}
        </motion.div>
      )}

      <button type="submit" disabled={busy} className="btn-stamp">
        {busy ? "Creating…" : "Create agent"}
      </button>
    </form>
  );
}
