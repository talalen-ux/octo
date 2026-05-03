"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

const SUGGESTED = [
  {
    title: "Find best ETH liquidity pools",
    description: "Survey the top yield opportunities across L2s.",
    skills: ["analysis", "data"],
  },
  {
    title: "Send intro to partner agents",
    description: "Reach out with a short intro line.",
    skills: ["email", "outreach"],
  },
  {
    title: "Generate a market sentiment report",
    description: "Summarize today's signals across major assets.",
    skills: ["analysis", "ml"],
  },
  {
    title: "Execute a small rebalance trade",
    description: "Place a simulated trade based on the latest signal.",
    skills: ["trading", "tx"],
  },
];

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

export default function CreateTaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function toggle(s: string) {
    setSkills((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));
  }
  function loadExample() {
    const ex = SUGGESTED[Math.floor(Math.random() * SUGGESTED.length)];
    setTitle(ex.title);
    setDescription(ex.description);
    setSkills(ex.skills);
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!title.trim()) return setErr("Title is required.");
    setBusy(true);
    try {
      await api("/api/tasks", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          requiredSkills: skills,
        }),
      });
      setTitle("");
      setDescription("");
      setSkills([]);
    } catch (ex: any) {
      setErr(ex.message || "Could not submit task");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <label className="block">
        <span className="small-caps text-[10px] text-inkMute">Title</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Find the best ETH liquidity pools"
          className="field mt-1.5"
        />
      </label>

      <label className="block">
        <span className="small-caps text-[10px] text-inkMute">
          Description
        </span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional context"
          rows={2}
          className="field mt-1.5 resize-none"
        />
      </label>

      <div>
        <span className="small-caps text-[10px] text-inkMute">
          Required skills
        </span>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {SKILLS.map((s) => {
            const on = skills.includes(s);
            return (
              <motion.button
                whileTap={{ scale: 0.94 }}
                key={s}
                type="button"
                onClick={() => toggle(s)}
                className="mono text-[11px] px-2 py-1 rounded-md transition-colors"
                style={{
                  border: "1px solid",
                  borderColor: on ? "var(--ink)" : "var(--rule)",
                  background: on ? "var(--ink)" : "transparent",
                  color: on ? "var(--paper)" : "var(--ink-soft)",
                }}
              >
                {s}
              </motion.button>
            );
          })}
        </div>
        <p className="mt-1.5 text-[11.5px] text-inkMute">
          The router will pick the best-matched agent.
        </p>
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

      <div className="flex items-center gap-2">
        <button type="submit" disabled={busy} className="btn-stamp">
          {busy ? "Submitting…" : "Submit task"}
        </button>
        <button
          type="button"
          onClick={loadExample}
          className="btn-outline"
          title="Insert a sample task"
        >
          Sample
        </button>
      </div>
    </form>
  );
}
