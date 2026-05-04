"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSwarm } from "@/lib/useSwarm";
import { api } from "@/lib/api";
import StatPill from "@/components/StatPill";
import AgentCard from "@/components/AgentCard";
import TaskRow from "@/components/TaskRow";
import EventFeed from "@/components/EventFeed";
import CreateTaskForm from "@/components/CreateTaskForm";
import CreateAgentForm from "@/components/CreateAgentForm";
import Hero from "@/components/Hero";

const SwarmGraph = dynamic(() => import("@/components/SwarmGraph"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center">
      <span className="mono text-[11px] tracking-[0.18em] uppercase text-starMute">
        loading graph…
      </span>
    </div>
  ),
});

const DEMO = [
  {
    title: "Summarise the morning markets",
    description: "A short brief on overnight moves.",
    requiredSkills: ["analysis"],
  },
  {
    title: "Email the partner agents",
    description: "Send a polite intro to the peer fleet.",
    requiredSkills: ["email", "outreach"],
  },
  {
    title: "Find the best stablecoin yield",
    description: "Survey current top APYs.",
    requiredSkills: ["data", "analysis"],
  },
  {
    title: "Run a small rebalance",
    description: "Place a simulated trade.",
    requiredSkills: ["trading", "tx"],
  },
];

function SectionHead({
  title,
  count,
  action,
}: {
  title: string;
  count?: number | string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 mb-3">
      <div className="flex items-baseline gap-2.5 min-w-0">
        <h2
          className="display truncate text-[14px]"
          style={{ color: "var(--star)", fontWeight: 700 }}
        >
          {title}
        </h2>
        {count !== undefined && (
          <span
            className="mono text-[10.5px] tracking-[0.18em] text-starMute"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {count}
          </span>
        )}
      </div>
      {action}
    </div>
  );
}

export default function ConsolePage() {
  const { snapshot, events, connected } = useSwarm();
  const { agents, tasks, stats } = snapshot;
  const [seeding, setSeeding] = useState(false);

  const agentMap = useMemo(() => {
    const m = new Map<string, (typeof agents)[number]>();
    agents.forEach((a) => m.set(a.id, a));
    return m;
  }, [agents]);

  const taskMap = useMemo(() => {
    const m = new Map<string, (typeof tasks)[number]>();
    tasks.forEach((t) => m.set(t.id, t));
    return m;
  }, [tasks]);

  const active = tasks.filter(
    (t) => t.status !== "completed" && t.status !== "failed",
  );
  const filed = tasks
    .filter((t) => t.status === "completed" || t.status === "failed")
    .slice(0, 8);

  const total = agents.length;
  const load = total === 0 ? 0 : Math.round((stats.busy / total) * 100);

  async function runDemo() {
    if (seeding) return;
    setSeeding(true);
    try {
      for (const t of DEMO) {
        await api("/api/tasks", { method: "POST", body: JSON.stringify(t) });
        await new Promise((r) => setTimeout(r, 350));
      }
    } catch {
      /* ignore */
    } finally {
      setSeeding(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Hero connected={connected} />

      {/* ── Overview stats — sits as a thin band above the graph hero ─── */}
      <section className="px-6 sm:px-10 pt-4 pb-3">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-ruleGold border border-ruleGold rounded-[2px] overflow-hidden"
        >
          <StatPill label="Agents" value={total} tone="ink" hint={`${stats.idle} idle · ${stats.busy} busy`} />
          <StatPill label="Busy" value={stats.busy} tone="stamp" hint="agents currently engaged" />
          <StatPill label="Queued" value={stats.queued} tone="ink" hint="tasks awaiting routing" />
          <StatPill label="Running" value={stats.inProgress} tone="deep" hint="tasks in progress" />
          <StatPill label="Done" value={stats.completed} tone="sage" hint="tasks delivered to date" />
          <StatPill label="Load" value={`${load}%`} tone="gold" hint="share of fleet engaged" />
        </motion.div>
      </section>

      {/* ─────────────────────────────────────────────────────────────── */}
      {/*  HERO — the swarm graph is the centerpiece of the console      */}
      {/* ─────────────────────────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 pt-3 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
          className="grid grid-cols-12 gap-3"
        >
          {/* Graph: 9/12 columns, full bleed inside a framed plate */}
          <section className="col-span-12 lg:col-span-9 relative">
            <div className="relative bg-voidDeep border border-ruleGold rounded-sm overflow-hidden h-[65vh] min-h-[520px]">
              {/* Top-left section label */}
              <div className="absolute top-3 left-4 z-10 flex items-baseline gap-2.5 pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_var(--gold)] translate-y-[-2px]" />
                <span className="mono text-[10.5px] tracking-[0.22em] uppercase text-gold">
                  Live swarm
                </span>
                <span className="mono text-[10px] tracking-[0.18em] uppercase text-starMute">
                  tools → agents → tasks
                </span>
              </div>

              {/* Top-right action */}
              <div className="absolute top-2.5 right-3 z-10 flex items-center gap-2">
                <span
                  className={`mono text-[10px] tracking-[0.18em] uppercase ${
                    connected ? "text-leaf" : "text-starMute"
                  }`}
                >
                  {connected ? "● live" : "○ offline"}
                </span>
                <button
                  onClick={runDemo}
                  disabled={seeding}
                  className="btn-outline"
                >
                  {seeding ? "Seeding…" : "Run demo"}
                </button>
              </div>

              {/* Corner reticles */}
              <span aria-hidden className="absolute top-2 left-2 w-3 h-3 border-l border-t border-gold/70 z-0" />
              <span aria-hidden className="absolute top-2 right-2 w-3 h-3 border-r border-t border-gold/70 z-0" />
              <span aria-hidden className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-gold/70 z-0" />
              <span aria-hidden className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-gold/70 z-0" />

              {/* Bottom-left legend */}
              <div className="absolute bottom-3 left-4 z-10 flex items-center gap-4 mono text-[10px] tracking-[0.16em] uppercase text-starMute">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_5px_var(--gold)]" />
                  busy
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-leaf shadow-[0_0_5px_var(--leaf)]" />
                  idle
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-azure shadow-[0_0_5px_var(--azure)]" />
                  routed
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose shadow-[0_0_5px_var(--rose)]" />
                  failed
                </span>
              </div>

              <SwarmGraph snapshot={snapshot} />
            </div>
          </section>

          {/* Live event rail: 3/12 columns, matching graph height */}
          <aside className="col-span-12 lg:col-span-3 relative">
            <div className="bg-abyss/60 border border-ruleGold rounded-sm h-[65vh] min-h-[520px] flex flex-col overflow-hidden">
              <div className="px-4 pt-3 pb-2 border-b border-ruleGold/60 flex items-baseline justify-between">
                <span className="flex items-baseline gap-2.5">
                  <span className="mono text-[10.5px] tracking-[0.22em] uppercase text-gold">
                    Wire
                  </span>
                  <span className="mono text-[10px] tracking-[0.18em] uppercase text-starMute">
                    live event log
                  </span>
                </span>
                <span
                  className="mono text-[10px] tracking-[0.18em] text-starMute"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {events.length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto px-3 py-2">
                <EventFeed events={events} />
              </div>
            </div>
          </aside>
        </motion.div>
      </section>

      {/* ── Operations row ────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 pb-8">
        <div className="flex items-baseline justify-between gap-3 mb-4">
          <span className="mono text-[10.5px] tracking-[0.22em] uppercase text-starMute">
            Operations
          </span>
          <span className="hairline flex-1 max-w-[60%] h-px self-center" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <section className="panel-soft p-5">
            <SectionHead title="New task" />
            <CreateTaskForm />
          </section>

          <section className="panel-soft p-5">
            <SectionHead title="Active" count={active.length} />
            <div className="max-h-[44vh] overflow-y-auto pr-1 -mr-1">
              <AnimatePresence initial={false}>
                {active.map((t, i) => (
                  <TaskRow
                    key={t.id}
                    task={t}
                    agent={t.assignedAgent ? agentMap.get(t.assignedAgent) : null}
                    index={i}
                  />
                ))}
              </AnimatePresence>
              {active.length === 0 && (
                <div className="text-[13px] text-starMute py-7 text-center">
                  No active tasks.
                </div>
              )}
            </div>
          </section>

          <section className="panel-soft p-5">
            <SectionHead title="Fleet" count={total} />
            <div className="flex flex-col rounded-sm border border-rule max-h-[44vh] overflow-y-auto bg-voidDeep/40">
              <AnimatePresence initial={false}>
                {agents.map((a) => (
                  <AgentCard
                    key={a.id}
                    agent={a}
                    current={a.currentTaskId ? taskMap.get(a.currentTaskId) : null}
                  />
                ))}
              </AnimatePresence>
              {agents.length === 0 && (
                <div className="text-[13px] text-starMute py-7 text-center">
                  No agents yet.
                </div>
              )}
            </div>
          </section>

          <section className="panel-soft p-5">
            <SectionHead title="New agent" />
            <CreateAgentForm />
          </section>
        </div>
      </section>

      {/* ── Recent strip ──────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 pb-12">
        <div className="flex items-baseline justify-between gap-3 mb-4">
          <span className="mono text-[10.5px] tracking-[0.22em] uppercase text-starMute">
            Recent
          </span>
          <span className="mono text-[10px] tracking-[0.18em] text-starMute">
            {filed.length} archived
          </span>
        </div>

        {filed.length === 0 ? (
          <div className="border border-rule rounded-sm py-10 text-center text-[13px] text-starMute bg-abyss/40">
            Nothing completed yet. Run the demo or submit a task above.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <AnimatePresence initial={false}>
              {filed.map((t, i) => (
                <TaskRow
                  key={t.id}
                  task={t}
                  agent={t.assignedAgent ? agentMap.get(t.assignedAgent) : null}
                  index={i}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      <footer className="px-6 sm:px-10 py-5 border-t border-ruleGold mt-auto">
        <div className="flex items-center justify-between gap-2 mono text-[10.5px] tracking-[0.18em] uppercase text-starMute">
          <span>Octo·Swarm</span>
          <span>simulated · v0.1</span>
        </div>
      </footer>
    </main>
  );
}
