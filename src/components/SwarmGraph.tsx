"use client";

import { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  MarkerType,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import type { Snapshot, Agent, Task } from "@/types";
import { agentStatusLabel, agentTypeLabel, taskStatusLabel } from "@/lib/labels";

const INK = "#1a1411";
const PAPER = "#f1e7d1";
const STAMP = "#b73a26";
const DEEP = "#1f3a4d";
const SAGE = "#4a6650";
const GOLD = "#a78a3c";
const RULE = "#b8a274";

function agentColor(a: Agent): string {
  if (a.status === "offline") return "#8a7a5d";
  if (a.status === "busy") return STAMP;
  return SAGE;
}

function taskColor(t: Task): string {
  switch (t.status) {
    case "queued":
      return INK;
    case "assigned":
      return DEEP;
    case "in_progress":
      return STAMP;
    case "completed":
      return SAGE;
    case "failed":
      return STAMP;
  }
}

function arrange(snap: Snapshot): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const tools = snap.tools;
  const agents = snap.agents;
  const active = snap.tasks.filter(
    (t) =>
      t.status === "queued" ||
      t.status === "assigned" ||
      t.status === "in_progress",
  );

  const colW = 290;
  const xTool = 0;
  const xAgent = colW;
  const xTask = colW * 2;
  const yTop = 78;

  // Column heads
  const heads = [
    { x: xTool, label: "Instruments", num: "I" },
    { x: xAgent, label: "Hands", num: "II" },
    { x: xTask, label: "Orders", num: "III" },
  ];
  heads.forEach((h, i) => {
    nodes.push({
      id: `h-${i}`,
      position: { x: h.x, y: 0 },
      draggable: false,
      selectable: false,
      data: {
        label: (
          <div
            className="text-left"
            style={{ width: 230, color: INK, paddingBottom: 8 }}
          >
            <div
              className="display"
              style={{
                fontVariationSettings: '"opsz" 144, "WONK" 1',
                fontSize: 28,
                color: STAMP,
                lineHeight: 1,
              }}
            >
              {h.num}
            </div>
            <div
              className="display"
              style={{
                fontVariationSettings: '"opsz" 24, "WONK" 1',
                fontSize: 16,
                fontStyle: "italic",
                color: INK,
                marginTop: 2,
                borderBottom: `1px solid ${INK}`,
                paddingBottom: 2,
                width: 200,
              }}
            >
              {h.label}
            </div>
          </div>
        ),
      },
      style: {
        background: "transparent",
        border: "none",
        boxShadow: "none",
        padding: 0,
        width: 230,
      },
    });
  });

  tools.forEach((tool, i) => {
    nodes.push({
      id: `tool-${tool.id}`,
      position: { x: xTool, y: yTop + i * 110 },
      data: {
        label: (
          <div className="text-left" style={{ width: 200 }}>
            <div
              className="mono"
              style={{
                fontSize: 9,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: GOLD,
              }}
            >
              {tool.type}
            </div>
            <div
              className="display"
              style={{
                fontVariationSettings: '"opsz" 24, "SOFT" 30',
                fontSize: 16,
                color: INK,
                fontWeight: 500,
              }}
            >
              {tool.name}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(26,20,17,0.6)",
                fontStyle: "italic",
                marginTop: 2,
              }}
            >
              {tool.matchSkills.slice(0, 4).join(", ")}
            </div>
          </div>
        ),
      },
      style: {
        background: PAPER,
        border: `1px solid ${INK}`,
        borderRadius: 0,
        padding: "10px 12px",
        width: 224,
        boxShadow: `3px 3px 0 0 ${INK}`,
        color: INK,
      },
    });
  });

  agents.forEach((agent, i) => {
    const c = agentColor(agent);
    const busy = agent.status === "busy";
    nodes.push({
      id: `agent-${agent.id}`,
      position: { x: xAgent, y: yTop + i * 130 },
      data: {
        label: (
          <div className="text-left" style={{ width: 210 }}>
            <div className="flex items-center gap-2">
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: 0,
                  background: c,
                  boxShadow: busy ? `0 0 0 2px ${PAPER}, 0 0 0 3px ${c}` : "none",
                }}
              />
              <span
                className="mono"
                style={{
                  fontSize: 9,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: c,
                }}
              >
                {agentStatusLabel[agent.status]}
              </span>
              <span
                className="mono"
                style={{
                  marginLeft: "auto",
                  fontSize: 9,
                  color: "rgba(26,20,17,0.5)",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}
              >
                {agentTypeLabel[agent.type]}
              </span>
            </div>
            <div
              className="display"
              style={{
                fontVariationSettings: '"opsz" 24, "WONK" 1',
                fontSize: 18,
                color: INK,
                fontWeight: 500,
                marginTop: 2,
              }}
            >
              {agent.name}
            </div>
            <div
              className="mono"
              style={{
                fontSize: 10,
                color: "rgba(26,20,17,0.55)",
                marginTop: 2,
              }}
            >
              trust {Math.round(agent.reputation * 100)} · filed{" "}
              {agent.completedCount}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(26,20,17,0.55)",
                fontStyle: "italic",
                marginTop: 1,
              }}
            >
              {agent.skills.slice(0, 4).join(", ") || "—"}
            </div>
          </div>
        ),
      },
      style: {
        background: PAPER,
        border: `1.5px solid ${INK}`,
        borderRadius: 0,
        padding: "10px 12px",
        width: 234,
        boxShadow: busy
          ? `4px 4px 0 0 ${STAMP}, 4px 4px 0 1.5px ${INK}`
          : `3px 3px 0 0 ${INK}`,
        color: INK,
      },
    });
  });

  active.forEach((task, i) => {
    const c = taskColor(task);
    nodes.push({
      id: `task-${task.id}`,
      position: { x: xTask, y: yTop + i * 110 },
      data: {
        label: (
          <div className="text-left" style={{ width: 200 }}>
            <div
              className="mono"
              style={{
                fontSize: 9,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: c,
              }}
            >
              {taskStatusLabel[task.status]}
            </div>
            <div
              className="display"
              style={{
                fontVariationSettings: '"opsz" 24, "SOFT" 30',
                fontSize: 15,
                color: INK,
                fontWeight: 500,
                marginTop: 2,
                lineHeight: 1.15,
              }}
            >
              {task.title}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(26,20,17,0.55)",
                fontStyle: "italic",
                marginTop: 3,
              }}
            >
              {task.requiredSkills.slice(0, 3).join(", ") || "any skill"}
            </div>
          </div>
        ),
      },
      style: {
        background: PAPER,
        border: `1px solid ${INK}`,
        borderRadius: 0,
        padding: "10px 12px",
        width: 224,
        boxShadow:
          task.status === "in_progress"
            ? `3px 3px 0 0 ${STAMP}`
            : `3px 3px 0 0 ${INK}`,
        color: INK,
      },
    });
  });

  active.forEach((task) => {
    if (task.assignedAgent) {
      const animated =
        task.status === "in_progress" || task.status === "assigned";
      const c = taskColor(task);
      edges.push({
        id: `e-a-${task.id}`,
        source: `agent-${task.assignedAgent}`,
        target: `task-${task.id}`,
        type: "smoothstep",
        animated,
        style: { stroke: c, strokeWidth: animated ? 1.8 : 1.2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: c },
      });
      if (task.toolId && task.status === "in_progress") {
        edges.push({
          id: `e-t-${task.id}`,
          source: `tool-${task.toolId}`,
          target: `agent-${task.assignedAgent}`,
          type: "smoothstep",
          animated: true,
          style: { stroke: GOLD, strokeWidth: 1.4, strokeDasharray: "4 3" },
          markerEnd: { type: MarkerType.ArrowClosed, color: GOLD },
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
        minZoom={0.3}
        maxZoom={1.6}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll
        panOnDrag
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Cross}
          color={RULE}
          gap={30}
          size={3}
        />
        <Controls
          showInteractive={false}
          position="bottom-right"
        />
      </ReactFlow>
    </div>
  );
}
