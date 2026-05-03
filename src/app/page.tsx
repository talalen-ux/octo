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
      <span className="mono text-[11px] text-inkMute">loading graph…</span>
    </div>
  ),
});

const DEMO = [
  {
    title: "Summarize the morning markets",
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
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-baseline gap-2">
        <h2 className="display text-[13px] text-ink" style={{ fontWeight: 600 }}>
          {title}
        </h2>
        {count !== undefined && (
          <span
            className="mono text-[11px] text-inkMute"
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

      {/* Metrics */}
      <section className="px-6 sm:px-10 pt-6 pb-2 border-b border-rule">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-rule rounded-md overflow-hidden border border-rule">
          <StatPill
            label="Agents"
            value={total}
            tone="ink"
            hint={`${stats.idle} idle · ${stats.busy} busy`}
          />
          <StatPill
            label="Busy"
            value={stats.busy}
            tone="stamp"
            hint="agents currently engaged"
          />
          <StatPill
            label="Queued"
            value={stats.queued}
            tone="ink"
            hint="tasks awaiting routing"
          />
          <StatPill
            label="Running"
            value={stats.inProgress}
            tone="deep"
            hint="tasks in progress"
          />
          <StatPill
            label="Completed"
            value={stats.completed}
            tone="sage"
            hint="tasks done to date"
          />
          <StatPill
            label="Load"
            value={`${load}%`}
            tone="gold"
            hint="share of fleet engaged"
          />
        </div>
      </section>

      {/* Main grid */}
      <section className="grid grid-cols-12 gap-x-6 gap-y-6 px-6 sm:px-10 py-6">
        {/* Left column */}
        <aside className="col-span-12 lg:col-span-3 flex flex-col gap-6">
          <section className="panel p-4">
            <SectionHead title="New agent" />
            <CreateAgentForm />
          </section>

          <section>
            <SectionHead title="Agents" count={total} />
            <div className="flex flex-col max-h-[58vh] overflow-y-auto rounded-md border border-rule">
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
                <div className="text-[12.5px] text-inkMute py-6 text-center">
                  No agents yet. Add one above.
                </div>
              )}
            </div>
          </section>
        </aside>

        {/* Center — Graph + Events */}
        <section className="col-span-12 lg:col-span-6 flex flex-col gap-6">
          <section className="panel p-4 min-h-[460px] flex flex-col">
            <SectionHead
              title="Graph"
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
            <div className="flex-1 min-h-[400px] border border-rule rounded-md relative bg-paper overflow-hidden">
              <SwarmGraph snapshot={snapshot} />
            </div>
            <p className="mt-2 text-[11px] text-inkMute">
              Tools (left) → agents (center) → tasks (right).
            </p>
          </section>

          <section className="panel p-4">
            <SectionHead title="Events" count={events.length} />
            <div className="max-h-44 overflow-y-auto">
              <EventFeed events={events} />
            </div>
          </section>
        </section>

        {/* Right column */}
        <aside className="col-span-12 lg:col-span-3 flex flex-col gap-6">
          <section className="panel p-4">
            <SectionHead title="New task" />
            <CreateTaskForm />
          </section>

          <section>
            <SectionHead title="Active" count={active.length} />
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
                <div className="text-[12.5px] text-inkMute py-6 text-center">
                  No active tasks.
                </div>
              )}
            </div>
          </section>

          <section>
            <SectionHead title="Recent" count={filed.length} />
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
                <div className="text-[12.5px] text-inkMute py-4 text-center">
                  Nothing completed yet.
                </div>
              )}
            </div>
          </section>
        </aside>
      </section>

      <footer className="px-6 sm:px-10 py-4 border-t border-rule mt-auto">
        <div className="flex items-center justify-between gap-2 mono text-[11px] text-inkMute">
          <span>octo-swarm</span>
          <span>simulated · v0.1</span>
        </div>
      </footer>
    </main>
  );
}
