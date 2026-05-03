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
      <span className="display-italic text-starMute typewriter text-[20px]">
        plotting the chart
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
  numeral,
  title,
  coord,
  count,
  action,
}: {
  numeral: string;
  title: string;
  coord?: string;
  count?: number | string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 mb-3">
      <div className="flex items-baseline gap-3 min-w-0">
        <span
          className="display-italic shrink-0"
          style={{ color: "var(--gold)", fontSize: 18 }}
        >
          {numeral}
        </span>
        <h2
          className="display-italic truncate"
          style={{ fontSize: 18, color: "var(--star)" }}
        >
          {title}
        </h2>
        {coord && <span className="coord hidden sm:inline">{coord}</span>}
      </div>
      <div className="flex items-baseline gap-3 shrink-0">
        {count !== undefined && (
          <span
            className="mono text-[10.5px] tracking-[0.18em] text-starMute"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            № {count}
          </span>
        )}
        {action}
      </div>
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

      {/* Ledger figures — sextant readings */}
      <section className="px-6 sm:px-10 pt-7 pb-3 border-b border-ruleGold">
        <div className="flex items-baseline justify-between gap-3 mb-4">
          <div className="flex items-baseline gap-3">
            <span className="label">Tabula I</span>
            <span className="coord hidden sm:inline">
              Sextant readings · live
            </span>
          </div>
          <span className="hairline flex-1 max-w-[60%] h-px self-center rule-sweep" />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-ruleGold border border-ruleGold rounded-[2px] overflow-hidden"
        >
          <StatPill
            numeral="i"
            label="Hands enlisted"
            value={total}
            tone="ink"
            hint={`${stats.idle} ready · ${stats.busy} on watch`}
          />
          <StatPill
            numeral="ii"
            label="On watch"
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
            label="In transit"
            value={stats.inProgress}
            tone="deep"
            hint="orders being executed"
          />
          <StatPill
            numeral="v"
            label="Logged"
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

      {/* Main grid — asymmetric atlas spread */}
      <section className="grid grid-cols-12 gap-x-7 gap-y-7 px-6 sm:px-10 py-8">
        {/* Left column — Spawn + Hands */}
        <aside className="col-span-12 lg:col-span-3 flex flex-col gap-7">
          <section className="panel-soft p-5">
            <SectionHead
              numeral="§"
              title="Enlist a hand"
              coord="muster"
            />
            <CreateAgentForm />
          </section>

          <section>
            <SectionHead
              numeral="§"
              title="The fleet"
              coord="hands"
              count={total}
            />
            <div className="flex flex-col rounded-sm border border-ruleGold max-h-[58vh] overflow-y-auto bg-abyss/40">
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
                <div className="text-[13px] text-starMute italic py-7 text-center display-italic">
                  No hands enlisted. Begin above.
                </div>
              )}
            </div>
          </section>
        </aside>

        {/* Center — Star chart + Telegraph */}
        <section className="col-span-12 lg:col-span-6 flex flex-col gap-7">
          <section className="panel p-5 min-h-[460px] flex flex-col">
            <SectionHead
              numeral="§"
              title="Star chart"
              coord="live wiring"
              action={
                <button
                  onClick={runDemo}
                  disabled={seeding}
                  className="btn-outline"
                >
                  {seeding ? "Seeding…" : "Run demo"}
                </button>
              }
            />
            <div className="flex-1 min-h-[400px] border border-ruleGold rounded-sm relative overflow-hidden bg-voidDeep">
              <SwarmGraph snapshot={snapshot} />
              {/* corner reticles */}
              <span aria-hidden className="absolute top-2 left-2 w-3 h-3 border-l border-t border-goldDeep/70" />
              <span aria-hidden className="absolute top-2 right-2 w-3 h-3 border-r border-t border-goldDeep/70" />
              <span aria-hidden className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-goldDeep/70" />
              <span aria-hidden className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-goldDeep/70" />
            </div>
            <p className="mt-3 text-[12px] text-starMute italic display-italic">
              Fig. 1 — Instruments (left) supply hands (centre) as orders
              (right) traverse the meridian.
            </p>
          </section>

          <section className="panel-soft p-5">
            <SectionHead
              numeral="§"
              title="Telegraph"
              coord="signals · live"
              count={events.length}
            />
            <div className="border-t border-ruleGold pt-2 max-h-44 overflow-y-auto">
              <EventFeed events={events} />
            </div>
          </section>
        </section>

        {/* Right — Lodge + In transit + Logged */}
        <aside className="col-span-12 lg:col-span-3 flex flex-col gap-7">
          <section className="panel-soft p-5">
            <SectionHead
              numeral="§"
              title="Lodge an order"
              coord="dispatch"
            />
            <CreateTaskForm />
          </section>

          <section>
            <SectionHead
              numeral="§"
              title="In transit"
              coord="active"
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
                <div className="text-[13px] text-starMute italic py-7 text-center display-italic">
                  All quiet on the wire.
                </div>
              )}
            </div>
          </section>

          <section>
            <SectionHead
              numeral="§"
              title="Logged"
              coord="archive"
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
                <div className="text-[13px] text-starMute italic py-5 text-center display-italic">
                  Nothing logged yet.
                </div>
              )}
            </div>
          </section>
        </aside>
      </section>

      <footer className="px-6 sm:px-10 py-5 border-t border-ruleGold mt-auto">
        <div className="flex items-baseline justify-between gap-2 text-[10.5px] mono tracking-[0.18em] uppercase text-starMute">
          <span>Octo·Swarm</span>
          <span className="display-italic normal-case tracking-normal text-starSoft text-[14px]">
            ❦ Logged in good faith. All transits simulated. ❦
          </span>
          <span>v0·1 — Folio I</span>
        </div>
      </footer>
    </main>
  );
}
