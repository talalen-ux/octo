"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Icon from "./Icon";

const STEPS = [
  {
    icon: "send" as const,
    title: "1. Send a task",
    body: "Describe a job and the skills it needs. The swarm queues it instantly.",
    color: "text-accent2",
  },
  {
    icon: "agent" as const,
    title: "2. Agents pick it up",
    body: "The best-matched, available agent is auto-assigned by skills and trust.",
    color: "text-accent",
  },
  {
    icon: "tool" as const,
    title: "3. Tools do the work",
    body: "Agents call pluggable tools — email, data, AI, execution — to deliver results.",
    color: "text-ok",
  },
];

const STORAGE_KEY = "octo:howitworks:dismissed";

export default function HowItWorks() {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setOpen(window.localStorage.getItem(STORAGE_KEY) !== "1");
  }, []);

  if (open === null) return null;
  if (!open) {
    return (
      <div className="px-6 sm:px-8 py-2 border-b border-line/70 flex items-center justify-end">
        <button
          onClick={() => {
            setOpen(true);
            window.localStorage.removeItem(STORAGE_KEY);
          }}
          className="text-[11px] text-slate-500 hover:text-slate-300 inline-flex items-center gap-1"
        >
          <Icon name="book" size={11} />
          How it works
        </button>
      </div>
    );
  }

  return (
    <section className="px-6 sm:px-8 py-4 border-b border-line/70">
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        {STEPS.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.35 }}
            className="card card-hover p-3 flex items-start gap-3"
          >
            <div
              className={`w-9 h-9 rounded-lg bg-panel2/60 border border-line flex items-center justify-center shrink-0 ${s.color}`}
            >
              <Icon name={s.icon} size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-100">
                {s.title}
              </span>
              <span className="text-[12px] text-slate-400 leading-snug">
                {s.body}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
      <div className="flex items-center justify-end mt-2">
        <button
          onClick={() => {
            setOpen(false);
            window.localStorage.setItem(STORAGE_KEY, "1");
          }}
          className="text-[11px] text-slate-500 hover:text-slate-300"
        >
          got it — hide
        </button>
      </div>
    </section>
  );
}
