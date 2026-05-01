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
import type { Snapshot, Agent, Task } from "@/types";
import { agentStatusLabel, agentTypeLabel, taskStatusLabel } from "@/lib/labels";

const TOOL_COLORS: Record<string, string> = {
  communication: "#22d3ee",
  data: "#a78bfa",
  compute: "#fbbf24",
  execution: "#34d399",
};

function agentColor(a: Agent): string {
  if (a.status === "offline") return "#475569";
  if (a.status === "busy") return "#fbbf24";
  return "#34d399";
}

function taskColor(t: Task): string {
  switch (t.status) {
    case "queued":
      return "#64748b";
    case "assigned":
      return "#22d3ee";
    case "in_progress":
      return "#a78bfa";
    case "completed":
      return "#34d399";
    case "failed":
      return "#f87171";
  }
}

function statusGlow(color: string, strength = 0.45) {
  return `0 0 0 1px ${color}aa, 0 0 26px ${color}${Math.floor(strength * 255)
    .toString(16)
    .padStart(2, "0")}`;
}

function arrange(snap: Snapshot): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const tools = snap.tools;
  const agents = snap.agents;
  const activeTasks = snap.tasks.filter(
    (t) =>
      t.status === "queued" ||
      t.status === "assigned" ||
      t.status === "in_progress",
  );

  const colW = 300;
  const xTool = 0;
  const xAgent = colW;
  const xTask = colW * 2;
  const yTop = 70;

  // Column headers as floating "info" nodes
  const headers: Array<{ x: number; label: string; sub: string; color: string }> = [
    { x: xTool, label: "Tools", sub: "what agents can use", color: "#a78bfa" },
    { x: xAgent, label: "Agents", sub: "your AI workforce", color: "#22d3ee" },
    { x: xTask, label: "Tasks", sub: "work in flight", color: "#34d399" },
  ];
  headers.forEach((h, i) => {
    nodes.push({
      id: `header-${i}`,
      position: { x: h.x, y: 0 },
      draggable: false,
      selectable: false,
      data: {
        label: (
          <div className="flex flex-col items-start">
            <span className="text-[9px] uppercase tracking-[0.25em] text-slate-500">
              {h.sub}
            </span>
            <span
              className="text-[12px] font-semibold"
              style={{ color: h.color }}
            >
              {h.label}
            </span>
          </div>
        ),
      },
      style: {
        background: "transparent",
        border: "none",
        boxShadow: "none",
        width: 240,
        padding: 4,
      },
    });
  });

  tools.forEach((tool, i) => {
    const color = TOOL_COLORS[tool.type] || "#64748b";
    nodes.push({
      id: `tool-${tool.id}`,
      position: { x: xTool, y: yTop + i * 110 },
      draggable: true,
      data: {
        label: (
          <div className="flex flex-col items-start gap-0.5 text-left">
            <div className="text-[9px] uppercase tracking-[0.2em] text-slate-500">
              {tool.type}
            </div>
            <div className="text-sm font-semibold text-slate-100">
              {tool.name}
            </div>
            <div
              className="text-[10px] mt-0.5 truncate max-w-[200px]"
              style={{ color: color + "cc" }}
            >
              {tool.matchSkills.slice(0, 4).join(" · ")}
            </div>
          </div>
        ),
      },
      style: {
        background:
          "linear-gradient(180deg, rgba(15,19,32,0.95), rgba(10,13,24,0.95))",
        border: `1px solid ${color}44`,
        borderRadius: 12,
        padding: 12,
        width: 220,
        boxShadow: `0 0 0 1px ${color}22, 0 6px 20px rgba(0,0,0,0.35)`,
        color: "#e2e8f0",
      },
    });
  });

  agents.forEach((agent, i) => {
    const color = agentColor(agent);
    const busy = agent.status === "busy";
    nodes.push({
      id: `agent-${agent.id}`,
      position: { x: xAgent, y: yTop + i * 130 },
      draggable: true,
      data: {
        label: (
          <div className="flex flex-col items-start gap-1 text-left">
            <div className="flex items-center gap-2 w-full">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{
                  background: color,
                  boxShadow: busy ? `0 0 12px ${color}` : "none",
                }}
              />
              <span className="text-[9px] uppercase tracking-[0.2em] text-slate-500">
                {agentTypeLabel[agent.type]}
              </span>
              <span
                className="ml-auto text-[9px] uppercase tracking-widest"
                style={{ color: color }}
              >
                {agentStatusLabel[agent.status]}
              </span>
            </div>
            <div className="text-sm font-semibold text-slate-100">
              {agent.name}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <span>trust {Math.round(agent.reputation * 100)}</span>
              <span>·</span>
              <span>done {agent.completedCount}</span>
            </div>
            <div className="text-[10px] text-slate-500 truncate max-w-[210px]">
              {agent.skills.slice(0, 4).join(" · ") || "no skills"}
            </div>
          </div>
        ),
      },
      style: {
        background:
          "linear-gradient(180deg, rgba(20,26,42,0.95), rgba(15,19,32,0.95))",
        border: `1px solid ${color}66`,
        borderRadius: 14,
        padding: 12,
        width: 230,
        boxShadow: busy ? statusGlow(color, 0.5) : `0 0 0 1px ${color}22`,
        color: "#e2e8f0",
      },
    });
  });

  activeTasks.forEach((task, i) => {
    const color = taskColor(task);
    nodes.push({
      id: `task-${task.id}`,
      position: { x: xTask, y: yTop + i * 110 },
      draggable: true,
      data: {
        label: (
          <div className="flex flex-col items-start gap-0.5 text-left">
            <div className="text-[9px] uppercase tracking-[0.2em]" style={{ color }}>
              {taskStatusLabel[task.status]}
            </div>
            <div className="text-sm font-semibold text-slate-100 truncate max-w-[200px]">
              {task.title}
            </div>
            <div className="text-[10px] text-slate-500 truncate max-w-[200px]">
              {task.requiredSkills.slice(0, 3).join(" · ") || "any skill"}
            </div>
          </div>
        ),
      },
      style: {
        background:
          "linear-gradient(180deg, rgba(15,19,32,0.95), rgba(10,13,24,0.95))",
        border: `1px solid ${color}99`,
        borderRadius: 12,
        padding: 12,
        width: 220,
        boxShadow:
          task.status === "in_progress"
            ? statusGlow(color, 0.45)
            : `0 0 0 1px ${color}22`,
        color: "#e2e8f0",
      },
    });
  });

  // Edges
  activeTasks.forEach((task) => {
    if (task.assignedAgent) {
      const animated =
        task.status === "in_progress" || task.status === "assigned";
      const color = taskColor(task);
      edges.push({
        id: `e-a-t-${task.id}`,
        source: `agent-${task.assignedAgent}`,
        target: `task-${task.id}`,
        type: "smoothstep",
        animated,
        style: { stroke: color, strokeWidth: animated ? 2 : 1.4 },
        markerEnd: { type: MarkerType.ArrowClosed, color },
      });
      if (task.toolId && task.status === "in_progress") {
        edges.push({
          id: `e-t-tl-${task.id}`,
          source: `tool-${task.toolId}`,
          target: `agent-${task.assignedAgent}`,
          type: "smoothstep",
          animated: true,
          style: { stroke: "#22d3ee99", strokeWidth: 1.4 },
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
        fitViewOptions={{ padding: 0.18 }}
        minZoom={0.35}
        maxZoom={1.6}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll
        panOnDrag
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#1d2334" gap={28} size={1.2} />
        <Controls
          className="!bg-panel/80 !border !border-line !rounded-lg"
          showInteractive={false}
          position="bottom-right"
        />
      </ReactFlow>
    </div>
  );
}
