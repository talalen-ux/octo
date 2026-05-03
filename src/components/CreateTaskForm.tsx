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
    if (!title.trim()) return setErr("A title is required.");
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
      setErr(ex.message || "Could not file the order");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <label className="block">
        <span className="label">Order title</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Find the best ETH liquidity pools"
          className="field mt-1.5"
        />
      </label>

      <label className="block">
        <span className="label">Particulars</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A sentence or two of context, if needed."
          rows={2}
          className="field mt-1.5 resize-none"
        />
      </label>

      <div>
        <span className="label">Skills required</span>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {SKILLS.map((s) => {
            const on = skills.includes(s);
            return (
              <motion.button
                whileTap={{ scale: 0.94 }}
                key={s}
                type="button"
                onClick={() => toggle(s)}
                className="mono text-[10.5px] tracking-[0.16em] uppercase px-2 py-1 rounded-sm transition-colors"
                style={{
                  border: "1px solid",
                  borderColor: on ? "var(--gold)" : "var(--rule)",
                  background: on
                    ? "rgba(94, 234, 212,0.12)"
                    : "transparent",
                  color: on ? "var(--gold)" : "var(--star-soft)",
                }}
              >
                {s}
              </motion.button>
            );
          })}
        </div>
        <p className="mt-1.5 text-[11.5px] text-starMute italic display-italic">
          The router pairs by skill match.
        </p>
      </div>

      {err && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[12px] text-rose italic display-italic"
        >
          ✕ {err}
        </motion.div>
      )}

      <div className="flex items-center gap-2">
        <button type="submit" disabled={busy} className="btn-stamp">
          {busy ? "Filing…" : "Lodge order"}
        </button>
        <button
          type="button"
          onClick={loadExample}
          className="btn-outline"
          title="Insert a sample order"
        >
          Sample
        </button>
      </div>
    </form>
  );
}
