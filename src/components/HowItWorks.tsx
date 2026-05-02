"use client";

import { useEffect, useState } from "react";
import { Roman } from "./Mark";

const STEPS = [
  {
    title: "Lodge an order",
    body: "Describe the work and the skills required. The order is filed in the queue at once.",
  },
  {
    title: "An agent takes it on",
    body: "The Quartermaster routes the order to the best-matched, available hand by skill and standing.",
  },
  {
    title: "Tools deliver the result",
    body: "Agents call the appropriate instrument — wire, ledger, mind, or runner — and the outcome is recorded.",
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
      <div className="px-6 sm:px-10 py-2 border-b border-ink/20 flex items-center justify-end">
        <button
          onClick={() => {
            setOpen(true);
            window.localStorage.removeItem(KEY);
          }}
          className="mono small-caps text-[10px] text-inkMute hover:text-stamp"
        >
          Re-open the Manual ☞
        </button>
      </div>
    );
  }

  return (
    <section className="px-6 sm:px-10 py-7 border-b border-ink/30 relative">
      <div className="flex items-baseline gap-3 mb-5">
        <span className="mono small-caps text-[10px] text-inkMute">
          Field Manual ·
        </span>
        <h2
          className="display italic"
          style={{
            fontVariationSettings: '"opsz" 36, "WONK" 1',
            fontSize: 22,
            color: "var(--ink)",
          }}
        >
          How the fleet operates
        </h2>
      </div>

      <ol className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-6 reveal">
        {STEPS.map((s, i) => (
          <li key={s.title} className="grid grid-cols-[auto_1fr] gap-4">
            <div
              className="text-stamp pt-1"
              style={{
                fontFamily: "var(--font-display)",
                fontVariationSettings: '"opsz" 144, "WONK" 1',
                fontSize: 56,
                lineHeight: 0.8,
                letterSpacing: "-0.02em",
              }}
            >
              <Roman n={i + 1} />
            </div>
            <div className="border-l border-ink/30 pl-4">
              <h3
                className="display"
                style={{
                  fontVariationSettings: '"opsz" 24, "SOFT" 20',
                  fontSize: 18,
                  fontWeight: 500,
                }}
              >
                {s.title}
              </h3>
              <p className="mt-1 text-[13.5px] text-inkSoft leading-snug">
                {s.body}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="flex items-center justify-end mt-5">
        <button
          onClick={() => {
            setOpen(false);
            window.localStorage.setItem(KEY, "1");
          }}
          className="mono small-caps text-[10px] text-inkMute hover:text-stamp"
        >
          Close the Manual ✕
        </button>
      </div>
    </section>
  );
}
