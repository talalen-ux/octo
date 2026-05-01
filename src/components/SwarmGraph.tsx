"use client";

import { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import type { Snapshot, Agent, Task, Tool } from "@/types";

const TOOL_COLORS: Record<string, string> = {
  communication: "#22d3ee",
  data: "#8b5cf6",
  compute: "#f59e0b",
  execution: "#10b981",
};

function agentColor(a: Agent): string {
  if (a.status === "offline") return "#475569";
  if (a.status === "busy") return "#f59e0b";
  return "#10b981";
}

function taskColor(t: Task): string {
  switch (t.status) {
    case "queued":
      return "#64748b";
    case "assigned":
      return "#22d3ee";
    case "in_progress":
      return "#8b5cf6";
    case "completed":
      return "#10b981";
    case "failed":
      return "#ef4444";
  }
}

function arrange(snap: Snapshot): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const tools = snap.tools;
  const agents = snap.agents;
  // Show only tasks that are queued / assigned / in_progress (active swarm)
  const activeTasks = snap.tasks.filter(
    (t) =>
      t.status === "queued" ||
      t.status === "assigned" ||
      t.status === "in_progress",
  );

  const colW = 280;
  const toolX = 0;
  const agentX = colW;
  const taskX = colW * 2;

  tools.forEach((tool, i) => {
    nodes.push({
      id: `tool-${tool.id}`,
      type: "default",
      position: { x: toolX, y: 60 + i * 110 },
      data: {
        label: (
          <div className="flex flex-col items-start gap-0.5">
            <div className="text-[10px] uppercase tracking-widest text-slate-400">
              {tool.type}
            </div>
            <div className="text-sm font-semibold">{tool.name}</div>
            <div className="text-[10px] text-slate-500">
              {tool.matchSkills.slice(0, 3).join(" · ")}
            </div>
          </div>
        ),
      },
      style: {
        background: "#0f1320",
        color: "#e2e8f0",
        border: `1px solid ${TOOL_COLORS[tool.type] || "#334155"}55`,
        borderRadius: 10,
        padding: 10,
        width: 220,
        boxShadow: `0 0 18px ${TOOL_COLORS[tool.type] || "#334155"}22`,
      },
    });
  });

  agents.forEach((agent, i) => {
    nodes.push({
      id: `agent-${agent.id}`,
      position: { x: agentX, y: 40 + i * 130 },
      data: {
        label: (
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ background: agentColor(agent) }}
              />
              <span className="text-[10px] uppercase tracking-widest text-slate-400">
                {agent.type}
              </span>
            </div>
            <div className="text-sm font-semibold">{agent.name}</div>
            <div className="text-[10px] text-slate-500">
              rep {agent.reputation.toFixed(2)} · ✓{agent.completedCount}
            </div>
            <div className="text-[10px] text-slate-500 truncate max-w-[200px]">
              {agent.skills.slice(0, 4).join(" · ") || "—"}
            </div>
          </div>
        ),
      },
      style: {
        background: "#141a2a",
        color: "#e2e8f0",
        border: `1px solid ${agentColor(agent)}77`,
        borderRadius: 12,
        padding: 10,
        width: 220,
        boxShadow:
          agent.status === "busy"
            ? `0 0 24px ${agentColor(agent)}55`
            : "none",
      },
    });
  });

  activeTasks.forEach((task, i) => {
    nodes.push({
      id: `task-${task.id}`,
      position: { x: taskX, y: 40 + i * 110 },
      data: {
        label: (
          <div className="flex flex-col items-start gap-1">
            <div className="text-[10px] uppercase tracking-widest text-slate-400">
              {task.status.replace("_", " ")}
            </div>
            <div className="text-sm font-semibold truncate max-w-[200px]">
              {task.title}
            </div>
            <div className="text-[10px] text-slate-500">
              {task.requiredSkills.slice(0, 3).join(" · ") || "any"}
            </div>
          </div>
        ),
      },
      style: {
        background: "#0f1320",
        color: "#e2e8f0",
        border: `1px solid ${taskColor(task)}99`,
        borderRadius: 10,
        padding: 10,
        width: 220,
      },
    });
  });

  // Edges: agent → task (assignment), agent → tool (when running)
  activeTasks.forEach((task) => {
    if (task.assignedAgent) {
      const animated = task.status === "in_progress";
      edges.push({
        id: `e-a-t-${task.id}`,
        source: `agent-${task.assignedAgent}`,
        target: `task-${task.id}`,
        animated,
        style: { stroke: taskColor(task), strokeWidth: animated ? 2 : 1.2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: taskColor(task) },
      });
      if (task.toolId && animated) {
        edges.push({
          id: `e-t-tl-${task.id}`,
          source: `tool-${task.toolId}`,
          target: `agent-${task.assignedAgent}`,
          animated: true,
          style: { stroke: "#22d3ee88", strokeDasharray: "4 3" },
          markerEnd: { type: MarkerType.ArrowClosed, color: "#22d3ee" },
        });
      }
    }
  });

  return { nodes, edges };
}

export default function SwarmGraph({ snapshot }: { snapshot: Snapshot }) {
  const { nodes, edges } = useMemo(() => arrange(snapshot), [snapshot]);

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll
        panOnDrag
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#1f2638" gap={24} size={1} />
        <Controls
          className="!bg-panel !border !border-line !rounded-md"
          showInteractive={false}
        />
      </ReactFlow>
    </div>
  );
}
