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
import HowItWorks from "@/components/HowItWorks";

const SwarmGraph = dynamic(() => import("@/components/SwarmGraph"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-2 text-inkMute">
        <div className="display text-2xl typewriter">drafting chart</div>
      </div>
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
  numeral,
  title,
  rule,
  count,
}: {
  numeral: string;
  title: string;
  rule?: string;
  count?: number | string;
}) {
  return (
    <div className="flex items-baseline gap-3 mb-3">
      <span
        className="display text-stamp"
        style={{
          fontVariationSettings: '"opsz" 144, "WONK" 1',
          fontSize: 28,
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        {numeral}
      </span>
      <h2
        className="display"
        style={{
          fontVariationSettings: '"opsz" 36, "SOFT" 20, "WONK" 1',
          fontSize: 22,
          fontStyle: "italic",
          fontWeight: 500,
          color: "var(--ink)",
        }}
      >
        {title}
      </h2>
      {rule && (
        <span className="mono small-caps text-[9.5px] text-inkMute mt-1.5">
          — {rule}
        </span>
      )}
      {count !== undefined && (
        <span
          className="mono small-caps text-[9.5px] text-inkMute ml-auto mt-1.5"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          № {count}
        </span>
      )}
    </div>
  );
}

export default function DashboardPage() {
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
    .slice(0, 6);

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
      <HowItWorks />

      {/* Ledger figures */}
      <section className="px-6 sm:px-10 pt-6 pb-2 border-b border-ink/30">
        <div className="flex items-baseline gap-3 mb-3">
          <span className="mono small-caps text-[10px] text-inkMute">
            Tabula I — Operations at a glance
          </span>
          <span className="flex-1 ink-rule h-[1px] mt-2" />
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
        >
          <StatPill
            numeral="i"
            label="Hands enlisted"
            value={total}
            tone="ink"
            hint={`${stats.idle} ready · ${stats.busy} on duty`}
          />
          <StatPill
            numeral="ii"
            label="On duty"
            value={stats.busy}
            tone="stamp"
            hint="agents currently engaged"
          />
          <StatPill
            numeral="iii"
            label="Awaiting"
            value={stats.queued}
            tone="ink"
            hint="orders queued for routing"
          />
          <StatPill
            numeral="iv"
            label="Underway"
            value={stats.inProgress}
            tone="deep"
            hint="orders being executed"
          />
          <StatPill
            numeral="v"
            label="Filed"
            value={stats.completed}
            tone="sage"
            hint="orders delivered to date"
          />
          <StatPill
            numeral="vi"
            label="Load"
            value={`${load}%`}
            tone="gold"
            hint="share of fleet engaged"
          />
        </motion.div>
      </section>

      {/* Main grid */}
      <section className="grid grid-cols-12 gap-x-8 gap-y-6 px-6 sm:px-10 py-8">
        {/* Left column — Spawn + Hands */}
        <aside className="col-span-12 lg:col-span-3 flex flex-col gap-6">
          <section>
            <SectionHead numeral="§" title="Enlist a hand" rule="agents" />
            <CreateAgentForm />
          </section>

          <div className="ink-rule h-[1px]" />

          <section>
            <SectionHead numeral="§" title="The fleet" rule="hands" count={total} />
            <div className="flex flex-col -mx-1 max-h-[58vh] overflow-y-auto">
              <AnimatePresence initial={false}>
                {agents.map((a) => (
                  <AgentCard
                    key={a.id}
                    agent={a}
                    current={
                      a.currentTaskId ? taskMap.get(a.currentTaskId) : null
                    }
                  />
                ))}
              </AnimatePresence>
              {agents.length === 0 && (
                <div className="text-[12.5px] text-inkMute italic py-6 text-center">
                  No hands enlisted. Begin above.
                </div>
              )}
            </div>
          </section>
        </aside>

        {/* Center — Chart + Wire */}
        <section className="col-span-12 lg:col-span-6 flex flex-col gap-6">
          <section className="panel-soft p-5 min-h-[460px] flex flex-col">
            <div className="flex items-baseline justify-between gap-3 mb-3">
              <SectionHead
                numeral="§"
                title="Operational chart"
                rule="live wiring"
              />
              <button
                onClick={runDemo}
                disabled={seeding}
                className="btn-outline"
              >
                {seeding ? "Filing…" : "Run demo"}
              </button>
            </div>
            <div className="flex-1 min-h-[400px] border border-ink/30 relative bg-paper">
              <SwarmGraph snapshot={snapshot} />
            </div>
            <p className="mt-2 text-[11px] text-inkMute italic">
              Fig. 1 — Instruments (left) supply hands (centre) as orders
              (right) move through the fleet.
            </p>
          </section>

          <section>
            <SectionHead
              numeral="§"
              title="Wire transmissions"
              rule="live"
              count={events.length}
            />
            <div className="border-t border-ink/40 pt-2 max-h-44 overflow-y-auto">
              <EventFeed events={events} />
            </div>
          </section>
        </section>

        {/* Right — Lodge order + In-flight + Recently filed */}
        <aside className="col-span-12 lg:col-span-3 flex flex-col gap-6">
          <section>
            <SectionHead numeral="§" title="Lodge an order" rule="dispatch" />
            <CreateTaskForm />
          </section>

          <div className="ink-rule h-[1px]" />

          <section>
            <SectionHead
              numeral="§"
              title="In flight"
              rule="active orders"
              count={active.length}
            />
            <div className="max-h-[42vh] overflow-y-auto pr-1 -mr-1">
              <AnimatePresence initial={false}>
                {active.map((t, i) => (
                  <TaskRow
                    key={t.id}
                    task={t}
                    agent={
                      t.assignedAgent ? agentMap.get(t.assignedAgent) : null
                    }
                    index={i}
                  />
                ))}
              </AnimatePresence>
              {active.length === 0 && (
                <div className="text-[12.5px] text-inkMute italic py-6 text-center">
                  All quiet on the wire.
                </div>
              )}
            </div>
          </section>

          <div className="ink-rule h-[1px]" />

          <section>
            <SectionHead
              numeral="§"
              title="Recently filed"
              rule="archive"
              count={filed.length}
            />
            <div className="max-h-72 overflow-y-auto pr-1 -mr-1">
              <AnimatePresence initial={false}>
                {filed.map((t, i) => (
                  <TaskRow
                    key={t.id}
                    task={t}
                    agent={
                      t.assignedAgent ? agentMap.get(t.assignedAgent) : null
                    }
                    index={i}
                  />
                ))}
              </AnimatePresence>
              {filed.length === 0 && (
                <div className="text-[12.5px] text-inkMute italic py-4 text-center">
                  Nothing filed yet.
                </div>
              )}
            </div>
          </section>
        </aside>
      </section>

      <footer className="px-6 sm:px-10 py-4 border-t border-ink mt-auto">
        <div className="flex items-baseline justify-between gap-2 text-[10px] mono small-caps text-inkMute">
          <span>Octo·Swarm</span>
          <span className="italic font-display lowercase tracking-normal text-inkSoft">
            <span style={{ fontVariationSettings: '"opsz" 24, "WONK" 1' }}>
              ❦ Filed in good faith. All entries simulated. ❦
            </span>
          </span>
          <span>v0·1 — Edition I</span>
        </div>
      </footer>
    </main>
  );
}
