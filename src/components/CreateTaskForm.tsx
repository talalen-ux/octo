"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import Icon from "./Icon";

const SUGGESTED_TASKS = [
  {
    title: "Find best ETH liquidity pools",
    description: "Survey the top yield opportunities across L2s.",
    skills: ["analysis", "data"],
  },
  {
    title: "Send intro emails to partner agents",
    description: "Reach out to peer agents with a short intro.",
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

export default function CreateTaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function toggleSkill(s: string) {
    setSkillsList((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  }

  function loadExample() {
    const ex = SUGGESTED_TASKS[Math.floor(Math.random() * SUGGESTED_TASKS.length)];
    setTitle(ex.title);
    setDescription(ex.description);
    setSkillsList(ex.skills);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!title.trim()) {
      setErr("Give your task a short title.");
      return;
    }
    setBusy(true);
    try {
      await api("/api/tasks", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          requiredSkills: skillsList,
        }),
      });
      setTitle("");
      setDescription("");
      setSkillsList([]);
    } catch (e: any) {
      setErr(e.message || "Could not send task");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label className="label">What needs doing?</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Find best ETH liquidity pools"
          className="input"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="label">Details (optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A sentence or two of context"
          rows={2}
          className="input resize-none"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="label">Skills needed</label>
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
                    ? "border-accent/60 bg-accent/15 text-accent"
                    : "border-line bg-panel2/60 text-slate-400 hover:text-slate-200 hover:border-line2"
                }`}
              >
                {s}
              </motion.button>
            );
          })}
        </div>
        <p className="text-[10px] text-slate-500 mt-0.5">
          The swarm picks the best agent that has these skills.
        </p>
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

      <div className="flex gap-2">
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={busy}
          className="btn-primary flex-1"
        >
          <Icon name="send" size={14} />
          {busy ? "Sending…" : "Send to swarm"}
        </motion.button>
        <button
          type="button"
          onClick={loadExample}
          className="btn-ghost"
          title="Fill with an example"
        >
          <Icon name="lightning" size={14} />
        </button>
      </div>
    </form>
  );
}
