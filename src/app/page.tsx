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
import Icon from "@/components/Icon";

const SwarmGraph = dynamic(() => import("@/components/SwarmGraph"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-2 text-slate-500">
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 rounded-full border border-accent/40 animate-ping" />
          <div className="absolute inset-1 rounded-full border border-accent2/40 animate-ping [animation-delay:200ms]" />
        </div>
        <span className="text-[11px]">loading swarm graph…</span>
      </div>
    </div>
  ),
});

const DEMO_TASKS = [
  { title: "Summarize crypto market today", description: "Brief overview of major moves.", requiredSkills: ["analysis"] },
  { title: "Email partner agents", description: "Send a short intro to peer swarm.", requiredSkills: ["email", "outreach"] },
  { title: "Find best stablecoin yield", description: "Survey current top APYs.", requiredSkills: ["data", "analysis"] },
  { title: "Run a small rebalance", description: "Place a simulated trade.", requiredSkills: ["trading", "tx"] },
];

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

  const activeTasks = tasks.filter(
    (t) => t.status !== "completed" && t.status !== "failed",
  );
  const recentDone = tasks
    .filter((t) => t.status === "completed" || t.status === "failed")
    .slice(0, 6);

  const totalAgents = agents.length;
  const systemLoad =
    totalAgents === 0 ? 0 : Math.round((stats.busy / totalAgents) * 100);

  async function runDemo() {
    if (seeding) return;
    setSeeding(true);
    try {
      for (const t of DEMO_TASKS) {
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

      {/* Stats */}
      <section className="px-6 sm:px-8 py-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 border-b border-line/70">
        <StatPill
          label="Agents"
          value={totalAgents}
          tone="accent2"
          icon={<Icon name="agent" size={14} />}
          hint={`${stats.idle} available · ${stats.busy} working`}
        />
        <StatPill
          label="Working"
          value={stats.busy}
          tone="warn"
          icon={<Icon name="play" size={14} />}
          hint="agents currently busy"
        />
        <StatPill
          label="Waiting"
          value={stats.queued}
          tone="default"
          icon={<Icon name="queue" size={14} />}
          hint="tasks awaiting an agent"
        />
        <StatPill
          label="In progress"
          value={stats.inProgress}
          tone="accent"
          icon={<Icon name="lightning" size={14} />}
          hint="tasks being executed"
        />
        <StatPill
          label="Delivered"
          value={stats.completed}
          tone="ok"
          icon={<Icon name="check" size={14} />}
          hint="completed tasks"
        />
        <StatPill
          label="Load"
          value={`${systemLoad}%`}
          tone={systemLoad > 75 ? "warn" : "default"}
          icon={<Icon name="spark" size={14} />}
          hint="share of agents busy"
        />
      </section>

      {/* Main grid */}
      <section className="flex-1 grid grid-cols-12 gap-4 p-4 sm:p-6">
        {/* Left — agents */}
        <aside className="col-span-12 lg:col-span-3 xl:col-span-3 flex flex-col gap-4 min-h-0">
          <div className="card p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="h-section flex items-center gap-2">
                <Icon name="plus" size={13} className="text-accent2" />
                Spawn agent
              </h2>
            </div>
            <p className="text-[11px] text-slate-500 -mt-1">
              Add an AI worker to your swarm.
            </p>
            <CreateAgentForm />
          </div>

          <div className="card p-4 flex flex-col gap-3 flex-1 min-h-0">
            <div className="flex items-center justify-between">
              <h2 className="h-section flex items-center gap-2">
                <Icon name="agent" size={13} className="text-accent2" />
                Your agents
              </h2>
              <span className="text-[10px] text-slate-500">
                {totalAgents}
              </span>
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto pr-1 -mr-1 max-h-[60vh]">
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
                <div className="text-[12px] text-slate-500 italic py-6 text-center">
                  No agents yet.
                  <br />
                  Spawn one to start.
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Center — graph + activity */}
        <section className="col-span-12 lg:col-span-6 xl:col-span-6 flex flex-col gap-4 min-h-0">
          <div className="card relative overflow-hidden flex-1 min-h-[440px]">
            <div className="absolute z-10 top-3 left-4 flex items-center gap-2">
              <Icon name="graph" size={13} className="text-accent" />
              <span className="h-section">Live swarm</span>
            </div>
            <div className="absolute z-10 top-3 right-3 flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={runDemo}
                disabled={seeding}
                className="text-[11px] inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 transition-colors disabled:opacity-50"
                title="Send a batch of demo tasks to the swarm"
              >
                <Icon name="lightning" size={12} />
                {seeding ? "running…" : "Run demo"}
              </motion.button>
            </div>
            <SwarmGraph snapshot={snapshot} />
          </div>

          <div className="card p-4 h-44 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h2 className="h-section flex items-center gap-2">
                <Icon name="lightning" size={13} className="text-warn" />
                Live activity
              </h2>
              <span className="text-[10px] text-slate-500">
                {events.length} events
              </span>
            </div>
            <EventFeed events={events} />
          </div>
        </section>

        {/* Right — tasks */}
        <aside className="col-span-12 lg:col-span-3 xl:col-span-3 flex flex-col gap-4 min-h-0">
          <div className="card p-4 flex flex-col gap-3 relative overflow-hidden">
            <div
              className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent"
              aria-hidden
            />
            <div className="flex items-center justify-between">
              <h2 className="h-section flex items-center gap-2">
                <Icon name="send" size={13} className="text-accent" />
                Send a task
              </h2>
            </div>
            <p className="text-[11px] text-slate-500 -mt-1">
              The swarm will route it to the best agent.
            </p>
            <CreateTaskForm />
          </div>

          <div className="card p-4 flex flex-col gap-2 flex-1 min-h-0">
            <div className="flex items-center justify-between">
              <h2 className="h-section flex items-center gap-2">
                <Icon name="play" size={13} className="text-accent" />
                In flight
              </h2>
              <span className="text-[10px] text-slate-500">
                {activeTasks.length}
              </span>
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto pr-1 -mr-1 max-h-[40vh]">
              <AnimatePresence initial={false}>
                {activeTasks.map((t) => (
                  <TaskRow
                    key={t.id}
                    task={t}
                    agent={
                      t.assignedAgent ? agentMap.get(t.assignedAgent) : null
                    }
                  />
                ))}
              </AnimatePresence>
              {activeTasks.length === 0 && (
                <div className="text-[12px] text-slate-500 italic py-6 text-center">
                  All quiet. Send a task above.
                </div>
              )}
            </div>
          </div>

          <div className="card p-4 flex flex-col gap-2 max-h-72">
            <div className="flex items-center justify-between">
              <h2 className="h-section flex items-center gap-2">
                <Icon name="check" size={13} className="text-ok" />
                Recently delivered
              </h2>
              <span className="text-[10px] text-slate-500">
                {recentDone.length}
              </span>
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto pr-1 -mr-1">
              <AnimatePresence initial={false}>
                {recentDone.map((t) => (
                  <TaskRow
                    key={t.id}
                    task={t}
                    agent={
                      t.assignedAgent ? agentMap.get(t.assignedAgent) : null
                    }
                  />
                ))}
              </AnimatePresence>
              {recentDone.length === 0 && (
                <div className="text-[12px] text-slate-500 italic py-4 text-center">
                  No deliveries yet.
                </div>
              )}
            </div>
          </div>
        </aside>
      </section>

      <footer className="px-6 sm:px-8 py-3 border-t border-line/70 text-[10px] text-slate-600 flex items-center justify-between">
        <span>Octo Swarm · simulated agent network</span>
        <span>v0.1 · MVP</span>
      </footer>
    </main>
  );
}
