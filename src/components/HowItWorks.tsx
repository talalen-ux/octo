"use client";

import { useEffect, useState } from "react";

const STEPS = [
  {
    numeral: "I",
    coord: "RA 02h",
    title: "Lodge a transit",
    body: "Describe the work and the skills it requires. The order is filed in the queue at once and visible on the chart.",
  },
  {
    numeral: "II",
    coord: "RA 14h",
    title: "An agent takes the watch",
    body: "The router pairs each order with the best-matched, available hand by skill match and standing.",
  },
  {
    numeral: "III",
    coord: "RA 22h",
    title: "Instruments deliver the result",
    body: "Agents call the appropriate instrument — wire, ledger, mind, or runner — and the outcome is logged.",
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
      <div className="px-6 sm:px-10 py-2 border-b border-ruleGold flex items-center justify-end">
        <button
          onClick={() => {
            setOpen(true);
            window.localStorage.removeItem(KEY);
          }}
          className="mono text-[10.5px] tracking-[0.18em] uppercase text-starMute hover:text-gold transition-colors"
        >
          Re-open the field manual ↗
        </button>
      </div>
    );
  }

  return (
    <section className="relative px-6 sm:px-10 py-9 border-b border-ruleGold">
      <div className="flex items-baseline justify-between mb-6 gap-4">
        <div className="flex items-baseline gap-3">
          <span className="label">Field manual</span>
          <span className="coord hidden sm:inline">
            How the fleet operates
          </span>
        </div>
        <button
          onClick={() => {
            setOpen(false);
            window.localStorage.setItem(KEY, "1");
          }}
          className="mono text-[10.5px] tracking-[0.18em] uppercase text-starMute hover:text-gold transition-colors"
        >
          Close ✕
        </button>
      </div>

      <ol className="relative grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-8 reveal">
        {/* dotted connector behind cards on desktop */}
        <span
          aria-hidden
          className="hidden md:block absolute left-0 right-0 top-[34px] border-t border-dashed border-ruleGold/60 pointer-events-none"
        />
        {STEPS.map((s) => (
          <li key={s.title} className="relative flex flex-col gap-3">
            {/* Numeral badge */}
            <div className="flex items-center gap-3">
              <span
                className="display-italic relative inline-flex items-center justify-center"
                style={{
                  width: 38,
                  height: 38,
                  fontSize: 22,
                  color: "var(--gold)",
                  background: "var(--void-deep)",
                  border: "1px solid var(--gold-deep)",
                  borderRadius: "50%",
                  boxShadow:
                    "0 0 0 4px var(--void-deep), 0 0 18px -6px var(--gold-glow)",
                }}
              >
                {s.numeral}
              </span>
              <span className="coord">{s.coord}</span>
            </div>

            <h3
              className="display-italic text-[22px] leading-tight"
              style={{ color: "var(--star)" }}
            >
              {s.title}
            </h3>
            <p className="text-[13.5px] text-starSoft leading-relaxed">
              {s.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
