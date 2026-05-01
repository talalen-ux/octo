"use client";

import { useEffect, useRef, useState } from "react";
import type { Snapshot } from "@/types";

export interface SwarmEvent {
  id: number;
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

interface ServerSnapshot extends Snapshot {
  events: SwarmEvent[];
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

const POLL_MS = 1200;

export function useSwarm() {
  const [snapshot, setSnapshot] = useState<Snapshot>(empty);
  const [events, setEvents] = useState<SwarmEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const seenEventId = useRef(0);
  const aborted = useRef(false);

  useEffect(() => {
    aborted.current = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const tick = async () => {
      try {
        const res = await fetch("/api/state", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as ServerSnapshot;
        if (aborted.current) return;

        setConnected(true);
        setSnapshot({
          agents: data.agents,
          tasks: data.tasks,
          tools: data.tools,
          stats: data.stats,
        });

        if (Array.isArray(data.events)) {
          // Server returns events newest-first; merge new ones.
          const fresh = data.events.filter((e) => e.id > seenEventId.current);
          if (fresh.length > 0) {
            seenEventId.current = Math.max(
              seenEventId.current,
              ...fresh.map((e) => e.id),
            );
            setEvents((prev) => {
              // Newest first; cap to 80
              const merged = [...fresh, ...prev];
              return merged.slice(0, 80);
            });
          }
        }
      } catch {
        if (!aborted.current) setConnected(false);
      } finally {
        if (!aborted.current) timer = setTimeout(tick, POLL_MS);
      }
    };

    tick();
    return () => {
      aborted.current = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  return { snapshot, events, connected };
}
