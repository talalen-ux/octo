"use client";

import { useEffect, useState } from "react";

const STEPS = [
  {
    title: "Submit a task",
    body: "Describe the work and the skills it needs. The task is queued immediately.",
  },
  {
    title: "An agent picks it up",
    body: "The router assigns the task to the best-matched, available agent based on skill and reputation.",
  },
  {
    title: "Tools deliver the result",
    body: "Agents call the appropriate tool — analysis, messaging, ledger, or runtime — and the result is recorded.",
  },
];

const KEY = "octo:howitworks:dismissed";

export default function HowItWorks() {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setOpen(window.localStorage.getItem(KEY) !== "1");
  }, []);

  if (open === null) return null;

  if (!open) {
    return (
      <div className="px-6 sm:px-10 py-2 border-b border-rule flex items-center justify-end">
        <button
          onClick={() => {
            setOpen(true);
            window.localStorage.removeItem(KEY);
          }}
          className="mono text-[11px] text-inkMute hover:text-ink transition-colors"
        >
          How it works →
        </button>
      </div>
    );
  }

  return (
    <section className="px-6 sm:px-10 py-7 border-b border-rule">
      <div className="flex items-baseline justify-between mb-5">
        <span className="small-caps text-[10px] text-inkMute">
          How it works
        </span>
        <button
          onClick={() => {
            setOpen(false);
            window.localStorage.setItem(KEY, "1");
          }}
          className="mono text-[11px] text-inkMute hover:text-ink transition-colors"
        >
          Hide
        </button>
      </div>

      <ol className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-6 reveal">
        {STEPS.map((s, i) => (
          <li key={s.title} className="flex flex-col gap-2">
            <span className="mono text-[11px] text-stamp">
              0{i + 1}
            </span>
            <h3
              className="display text-[15px]"
              style={{ fontWeight: 600 }}
            >
              {s.title}
            </h3>
            <p className="text-[13px] text-inkSoft leading-relaxed">
              {s.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
