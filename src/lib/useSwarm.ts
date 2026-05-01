"use client";

import { useEffect, useRef, useState } from "react";
import { getSocket } from "./socket";
import type { Snapshot } from "@/types";

export interface SwarmEvent {
  id: string;
  ts: number;
  kind:
    | "task_created"
    | "task_assigned"
    | "task_started"
    | "task_completed"
    | "agent_created"
    | "agent_status_update";
  text: string;
}

const empty: Snapshot = {
  agents: [],
  tasks: [],
  tools: [],
  stats: {
    idle: 0,
    busy: 0,
    offline: 0,
    queued: 0,
    assigned: 0,
    inProgress: 0,
    completed: 0,
    failed: 0,
  },
};

export function useSwarm() {
  const [snapshot, setSnapshot] = useState<Snapshot>(empty);
  const [events, setEvents] = useState<SwarmEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const counter = useRef(0);

  useEffect(() => {
    const s = getSocket();
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onSnapshot = (snap: Snapshot) => setSnapshot(snap);
    const onState = (snap: Snapshot) => setSnapshot(snap);

    function pushEvent(kind: SwarmEvent["kind"], text: string) {
      counter.current += 1;
      const id = `${Date.now()}-${counter.current}`;
      setEvents((prev) =>
        [{ id, ts: Date.now(), kind, text }, ...prev].slice(0, 80),
      );
    }

    const onTaskCreated = (t: any) =>
      pushEvent("task_created", `task created — ${t.title}`);
    const onTaskAssigned = (p: any) =>
      pushEvent(
        "task_assigned",
        `${p.agent.name} ← ${p.task.title}`,
      );
    const onTaskStarted = (t: any) =>
      pushEvent("task_started", `started ${t.title}`);
    const onTaskCompleted = (t: any) =>
      pushEvent(
        "task_completed",
        `${t.status === "failed" ? "failed" : "completed"} — ${t.title}`,
      );
    const onAgentCreated = (a: any) =>
      pushEvent("agent_created", `agent online — ${a.name}`);
    const onAgentStatus = (a: any) =>
      pushEvent("agent_status_update", `${a.name} → ${a.status}`);

    s.on("connect", onConnect);
    s.on("disconnect", onDisconnect);
    s.on("snapshot", onSnapshot);
    s.on("state", onState);
    s.on("task_created", onTaskCreated);
    s.on("task_assigned", onTaskAssigned);
    s.on("task_started", onTaskStarted);
    s.on("task_completed", onTaskCompleted);
    s.on("agent_created", onAgentCreated);
    s.on("agent_status_update", onAgentStatus);

    if (s.connected) setConnected(true);

    return () => {
      s.off("connect", onConnect);
      s.off("disconnect", onDisconnect);
      s.off("snapshot", onSnapshot);
      s.off("state", onState);
      s.off("task_created", onTaskCreated);
      s.off("task_assigned", onTaskAssigned);
      s.off("task_started", onTaskStarted);
      s.off("task_completed", onTaskCompleted);
      s.off("agent_created", onAgentCreated);
      s.off("agent_status_update", onAgentStatus);
    };
  }, []);

  return { snapshot, events, connected };
}
