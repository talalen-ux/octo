"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useSwarm } from "@/lib/useSwarm";
import StatPill from "@/components/StatPill";
import AgentCard from "@/components/AgentCard";
import TaskRow from "@/components/TaskRow";
import EventFeed from "@/components/EventFeed";
import CreateTaskForm from "@/components/CreateTaskForm";
import CreateAgentForm from "@/components/CreateAgentForm";

const SwarmGraph = dynamic(() => import("@/components/SwarmGraph"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center text-slate-600 text-xs">
      loading swarm graph…
    </div>
  ),
});

export default function DashboardPage() {
  const { snapshot, events, connected } = useSwarm();
  const { agents, tasks, stats } = snapshot;

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

  const activeTasks = tasks.filter((t) => t.status !== "completed" && t.status !== "failed");
  const recentDone = tasks.filter((t) => t.status === "completed" || t.status === "failed").slice(0, 8);

  const systemLoad = stats.busy + stats.idle === 0
    ? 0
    : Math.round((stats.busy / Math.max(1, stats.busy + stats.idle)) * 100);

  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-line px-5 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <h1 className="text-sm tracking-[0.3em] uppercase text-slate-200">
            Octo Swarm
          </h1>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest">
            decentralized agent coordination · mvp
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span
            className={`inline-block w-2 h-2 rounded-full ${connected ? "bg-ok" : "bg-err"}`}
          />
          <span className="text-slate-400">
            {connected ? "swarm live" : "disconnected"}
          </span>
        </div>
      </header>

      <section className="px-5 py-3 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 border-b border-line">
        <StatPill label="agents" value={agents.length} tone="accent" />
        <StatPill label="idle" value={stats.idle} tone="ok" />
        <StatPill label="busy" value={stats.busy} tone="warn" />
        <StatPill label="queued" value={stats.queued} />
        <StatPill label="running" value={stats.inProgress} tone="accent" />
        <StatPill label="done" value={stats.completed} tone="ok" />
        <StatPill label="failed" value={stats.failed} tone="err" />
        <StatPill label="load" value={`${systemLoad}%`} tone={systemLoad > 70 ? "warn" : "default"} />
      </section>

      <section className="flex-1 grid grid-cols-12 gap-3 p-3 min-h-[calc(100vh-130px)]">
        {/* Left column — agents + create panels */}
        <aside className="col-span-12 lg:col-span-3 flex flex-col gap-3 min-h-0">
          <div className="rounded-lg border border-line bg-panel/40 p-3 flex flex-col gap-2">
            <h2 className="text-xs uppercase tracking-widest text-slate-400">
              Spawn agent
            </h2>
            <CreateAgentForm />
          </div>
          <div className="rounded-lg border border-line bg-panel/40 p-3 flex flex-col gap-2 flex-1 min-h-0">
            <div className="flex items-center justify-between">
              <h2 className="text-xs uppercase tracking-widest text-slate-400">
                Agents
              </h2>
              <span className="text-[10px] text-slate-500">
                {agents.length}
              </span>
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto pr-1">
              {agents.map((a) => (
                <AgentCard
                  key={a.id}
                  agent={a}
                  current={a.currentTaskId ? taskMap.get(a.currentTaskId) : null}
                />
              ))}
              {agents.length === 0 && (
                <div className="text-[11px] text-slate-600">
                  No agents yet. Spawn one above.
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Center — graph + event feed */}
        <section className="col-span-12 lg:col-span-6 flex flex-col gap-3 min-h-0">
          <div className="rounded-lg border border-line bg-panel/30 flex-1 min-h-[420px] overflow-hidden relative">
            <div className="absolute z-10 top-3 left-3 text-[10px] uppercase tracking-widest text-slate-500">
              Task flow visualizer
            </div>
            <SwarmGraph snapshot={snapshot} />
          </div>
          <div className="rounded-lg border border-line bg-panel/40 p-3 h-40 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xs uppercase tracking-widest text-slate-400">
                Live activity
              </h2>
              <span className="text-[10px] text-slate-500">
                {events.length} events
              </span>
            </div>
            <EventFeed events={events} />
          </div>
        </section>

        {/* Right — tasks + creation */}
        <aside className="col-span-12 lg:col-span-3 flex flex-col gap-3 min-h-0">
          <div className="rounded-lg border border-line bg-panel/40 p-3 flex flex-col gap-2">
            <h2 className="text-xs uppercase tracking-widest text-slate-400">
              Inject task
            </h2>
            <CreateTaskForm />
          </div>
          <div className="rounded-lg border border-line bg-panel/40 p-3 flex flex-col gap-2 flex-1 min-h-0">
            <div className="flex items-center justify-between">
              <h2 className="text-xs uppercase tracking-widest text-slate-400">
                Active tasks
              </h2>
              <span className="text-[10px] text-slate-500">
                {activeTasks.length}
              </span>
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto pr-1">
              {activeTasks.map((t) => (
                <TaskRow
                  key={t.id}
                  task={t}
                  agent={t.assignedAgent ? agentMap.get(t.assignedAgent) : null}
                />
              ))}
              {activeTasks.length === 0 && (
                <div className="text-[11px] text-slate-600">
                  Idle. Inject a task to wake the swarm.
                </div>
              )}
            </div>
          </div>
          <div className="rounded-lg border border-line bg-panel/40 p-3 flex flex-col gap-2 max-h-64">
            <h2 className="text-xs uppercase tracking-widest text-slate-400">
              Recent results
            </h2>
            <div className="flex flex-col gap-2 overflow-y-auto pr-1">
              {recentDone.length === 0 && (
                <div className="text-[11px] text-slate-600">
                  No completed tasks yet.
                </div>
              )}
              {recentDone.map((t) => (
                <TaskRow
                  key={t.id}
                  task={t}
                  agent={t.assignedAgent ? agentMap.get(t.assignedAgent) : null}
                />
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
