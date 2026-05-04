"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import CodeOctopus from "@/components/CodeOctopus";

const FEATURES = [
  {
    label: "01",
    title: "Skill-matched routing",
    body: "Tasks find the best-fit agent automatically by skill match and standing — no manual triage.",
  },
  {
    label: "02",
    title: "Real-time wire",
    body: "Every dispatch, pickup, and result streams onto a live event log the moment it happens.",
  },
  {
    label: "03",
    title: "Visible swarm graph",
    body: "Watch tools feed agents and agents resolve tasks as edges light up across the chart.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Submit a task",
    body: "Describe the work and the skills it needs. The task is queued instantly.",
  },
  {
    n: "02",
    title: "An agent picks it up",
    body: "The router pairs each task with the best available agent in the fleet.",
  },
  {
    n: "03",
    title: "Tools deliver the result",
    body: "Agents call the right instrument and the outcome is recorded on the wire.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* ── Top nav ─────────────────────────────────────────── */}
      <nav className="px-4 sm:px-6 lg:px-10 pt-4 pb-4 flex items-center justify-between gap-3 border-b border-ruleGold">
        <Link href="/" className="flex items-center gap-3">
          <span
            aria-hidden
            className="w-7 h-7 rounded-md border border-gold/60 flex items-center justify-center"
            style={{
              background: "rgba(94,234,212,0.05)",
              boxShadow: "0 0 12px -4px var(--gold-glow)",
            }}
          >
            <span
              className="block w-2 h-2 rounded-sm"
              style={{
                background: "var(--gold)",
                boxShadow: "0 0 6px var(--gold)",
              }}
            />
          </span>
          <span className="display text-[18px] tracking-tight text-star">
            Octo·Swarm
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <a
            href="#how"
            className="hidden sm:inline mono text-[10.5px] tracking-[0.18em] uppercase text-starSoft hover:text-gold transition-colors"
          >
            How it works
          </a>
          <a
            href="#features"
            className="hidden sm:inline mono text-[10.5px] tracking-[0.18em] uppercase text-starSoft hover:text-gold transition-colors"
          >
            Features
          </a>
          <Link href="/app" className="btn-stamp">
            Launch console
          </Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative px-4 sm:px-6 lg:px-10 pt-10 pb-14 sm:pt-12 sm:pb-20 border-b border-ruleGold overflow-hidden">
        <div className="grid grid-cols-12 gap-6 lg:gap-8 items-center max-w-[1200px] mx-auto w-full">
          <div className="col-span-12 lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_var(--gold)]" />
              <span className="mono text-[10.5px] tracking-[0.22em] uppercase text-gold">
                v0.1 · public beta
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.2, 0.7, 0.2, 1] }}
              className="display"
              style={{
                fontSize: "clamp(48px, 8vw, 96px)",
                fontWeight: 700,
                lineHeight: 0.98,
                letterSpacing: "-0.035em",
                color: "var(--star)",
              }}
            >
              Autonomous agents,
              <br />
              <span style={{ color: "var(--gold)" }}>swarming</span> in the open.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-7 max-w-xl text-[16px] leading-relaxed text-starSoft"
            >
              Octo·Swarm is a live console for an autonomous agent fleet.
              Submit a task, watch the right agent pick it up, and see the
              result land on the wire — every signal recorded as it crosses.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="mt-8 sm:mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
            >
              <Link href="/app" className="btn-stamp w-full sm:w-auto">
                Open the console
              </Link>
              <a href="#how" className="btn-outline w-full sm:w-auto">
                How it works
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="mt-8 sm:mt-10 flex flex-wrap items-center gap-x-5 sm:gap-x-6 gap-y-2 mono text-[10px] sm:text-[10.5px] tracking-[0.18em] uppercase text-starMute"
            >
              <span className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-leaf shadow-[0_0_6px_var(--leaf)]" />
                no install
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-azure shadow-[0_0_6px_var(--azure)]" />
                live wire
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-gold shadow-[0_0_6px_var(--gold)]" />
                open simulation
              </span>
            </motion.div>
          </div>

          {/* Code octopus mark */}
          <motion.aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="col-span-12 lg:col-span-5 flex justify-center lg:justify-end"
          >
            <figure className="relative w-[min(92vw,420px)] aspect-[6/5]">
              <div className="absolute inset-0 border border-ruleGold rounded-sm pointer-events-none" />
              <div className="absolute inset-2 border border-rule pointer-events-none" />
              <span aria-hidden className="absolute top-1.5 left-1.5 w-3 h-3 border-l border-t border-gold/70" />
              <span aria-hidden className="absolute top-1.5 right-1.5 w-3 h-3 border-r border-t border-gold/70" />
              <span aria-hidden className="absolute bottom-1.5 left-1.5 w-3 h-3 border-l border-b border-gold/70" />
              <span aria-hidden className="absolute bottom-1.5 right-1.5 w-3 h-3 border-r border-b border-gold/70" />
              <CodeOctopus size={13} haloOpacity={0.22} />
              <figcaption className="absolute -bottom-6 right-0 mono text-[10px] sm:text-[10.5px] tracking-[0.18em] uppercase text-goldDeep">
                Pl. I · &lt;/octopus&gt;
              </figcaption>
            </figure>
          </motion.aside>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────── */}
      <section
        id="features"
        className="px-4 sm:px-6 lg:px-10 py-14 sm:py-20 border-b border-ruleGold"
      >
        <div className="max-w-[1200px] mx-auto w-full">
          <div className="flex items-baseline justify-between mb-10">
            <div>
              <span className="mono text-[10.5px] tracking-[0.22em] uppercase text-starMute block mb-3">
                Features
              </span>
              <h2
                className="display"
                style={{
                  fontSize: "clamp(28px, 4vw, 44px)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "var(--star)",
                }}
              >
                Built for visible coordination.
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <article
                key={f.label}
                className="panel-soft p-6 flex flex-col gap-3"
              >
                <span className="mono text-[10.5px] tracking-[0.22em] uppercase text-gold">
                  {f.label}
                </span>
                <h3
                  className="display text-[20px]"
                  style={{ fontWeight: 700, color: "var(--star)" }}
                >
                  {f.title}
                </h3>
                <p className="text-[13.5px] text-starSoft leading-relaxed">
                  {f.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────── */}
      <section
        id="how"
        className="relative px-4 sm:px-6 lg:px-10 py-14 sm:py-20 border-b border-ruleGold"
      >
        <div className="max-w-[1200px] mx-auto w-full">
          <span className="mono text-[10.5px] tracking-[0.22em] uppercase text-starMute block mb-3">
            How it works
          </span>
          <h2
            className="display mb-10"
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--star)",
            }}
          >
            Three stations, one flow.
          </h2>

          <ol className="relative grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-10">
            <span
              aria-hidden
              className="hidden md:block absolute left-0 right-0 top-[18px] border-t border-dashed border-ruleGold/60 pointer-events-none"
            />
            {STEPS.map((s) => (
              <li key={s.n} className="flex flex-col gap-3 relative">
                <span
                  className="display relative inline-flex items-center justify-center"
                  style={{
                    width: 36,
                    height: 36,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--gold)",
                    background: "var(--void-deep)",
                    border: "1px solid var(--gold-deep)",
                    borderRadius: "50%",
                    boxShadow:
                      "0 0 0 4px var(--void-deep), 0 0 18px -6px var(--gold-glow)",
                  }}
                >
                  {s.n}
                </span>
                <h3
                  className="display text-[20px] mt-1"
                  style={{ fontWeight: 700, color: "var(--star)" }}
                >
                  {s.title}
                </h3>
                <p className="text-[13.5px] text-starSoft leading-relaxed">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-10 py-14 sm:py-20 border-b border-ruleGold">
        <div className="max-w-[900px] mx-auto w-full text-center">
          <h2
            className="display"
            style={{
              fontSize: "clamp(34px, 5vw, 56px)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: "var(--star)",
            }}
          >
            Spin up a fleet in seconds.
          </h2>
          <p className="mt-5 text-[15.5px] text-starSoft max-w-xl mx-auto leading-relaxed">
            The console runs in your browser, simulated end-to-end. Submit a
            task, watch the swarm route it, and see the wire light up.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/app" className="btn-stamp w-full sm:w-auto">
              Launch console
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="px-4 sm:px-6 lg:px-10 py-6 mt-auto">
        <div className="max-w-[1200px] mx-auto w-full flex items-center justify-between gap-2 mono text-[10.5px] tracking-[0.18em] uppercase text-starMute">
          <span>Octo·Swarm</span>
          <span>v0.1 · simulated</span>
        </div>
      </footer>
    </main>
  );
}
