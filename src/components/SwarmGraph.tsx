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

const INK = "#f4f5f7";
const INK_SOFT = "#a1a4ac";
const INK_MUTE = "#5b5f68";
const PAPER = "#0e1013";
const PAPER_SHADE = "#14171c";
const RULE = "#1f232a";
const RULE_STRONG = "#2a2f38";
const STAMP = "#ff5a4a";
const DEEP = "#5aa9ff";
const SAGE = "#4ed29a";
const GOLD = "#e7b75a";

function agentColor(a: Agent): string {
  if (a.status === "offline") return INK_MUTE;
  if (a.status === "busy") return STAMP;
  return SAGE;
}

function taskColor(t: Task): string {
  switch (t.status) {
    case "queued":
      return INK_SOFT;
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

const nodeBase = {
  background: PAPER_SHADE,
  border: `1px solid ${RULE}`,
  borderRadius: 8,
  padding: "10px 12px",
  color: INK,
  boxShadow: "none" as const,
};

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
  const yTop = 60;

  const heads = [
    { x: xTool, label: "Tools" },
    { x: xAgent, label: "Agents" },
    { x: xTask, label: "Tasks" },
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
            style={{
              width: 224,
              fontFamily: "var(--font-mono)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontSize: 10,
              color: INK_MUTE,
              paddingBottom: 6,
              borderBottom: `1px solid ${RULE}`,
            }}
          >
            {h.label}
          </div>
        ),
      },
      style: {
        background: "transparent",
        border: "none",
        boxShadow: "none",
        padding: 0,
        width: 224,
      },
    });
  });

  tools.forEach((tool, i) => {
    nodes.push({
      id: `tool-${tool.id}`,
      position: { x: xTool, y: yTop + i * 96 },
      data: {
        label: (
          <div className="text-left" style={{ width: 200 }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9.5,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                color: GOLD,
              }}
            >
              {tool.type}
            </div>
            <div
              style={{
                fontSize: 14,
                color: INK,
                fontWeight: 600,
                marginTop: 3,
                letterSpacing: "-0.01em",
              }}
            >
              {tool.name}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10.5,
                color: INK_MUTE,
                marginTop: 4,
              }}
            >
              {tool.matchSkills.slice(0, 4).join(" · ")}
            </div>
          </div>
        ),
      },
      style: { ...nodeBase, width: 224 },
    });
  });

  agents.forEach((agent, i) => {
    const c = agentColor(agent);
    const busy = agent.status === "busy";
    nodes.push({
      id: `agent-${agent.id}`,
      position: { x: xAgent, y: yTop + i * 116 },
      data: {
        label: (
          <div className="text-left" style={{ width: 210 }}>
            <div className="flex items-center gap-2">
              <span
                style={{
                  display: "inline-block",
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: c,
                  boxShadow: busy ? `0 0 0 3px rgba(255,90,74,0.18)` : "none",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9.5,
                  letterSpacing: "0.10em",
                  textTransform: "uppercase",
                  color: c,
                }}
              >
                {agentStatusLabel[agent.status]}
              </span>
              <span
                style={{
                  marginLeft: "auto",
                  fontFamily: "var(--font-mono)",
                  fontSize: 9.5,
                  color: INK_MUTE,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {agentTypeLabel[agent.type]}
              </span>
            </div>
            <div
              style={{
                fontSize: 15,
                color: INK,
                fontWeight: 600,
                marginTop: 4,
                letterSpacing: "-0.01em",
              }}
            >
              {agent.name}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10.5,
                color: INK_MUTE,
                marginTop: 3,
              }}
            >
              trust {Math.round(agent.reputation * 100)} · done{" "}
              {agent.completedCount}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10.5,
                color: INK_SOFT,
                marginTop: 2,
              }}
            >
              {agent.skills.slice(0, 4).join(" · ") || "—"}
            </div>
          </div>
        ),
      },
      style: {
        ...nodeBase,
        width: 234,
        border: busy ? `1px solid ${STAMP}` : `1px solid ${RULE_STRONG}`,
      },
    });
  });

  active.forEach((task, i) => {
    const c = taskColor(task);
    nodes.push({
      id: `task-${task.id}`,
      position: { x: xTask, y: yTop + i * 96 },
      data: {
        label: (
          <div className="text-left" style={{ width: 200 }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9.5,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                color: c,
              }}
            >
              {taskStatusLabel[task.status]}
            </div>
            <div
              style={{
                fontSize: 14,
                color: INK,
                fontWeight: 600,
                marginTop: 3,
                lineHeight: 1.25,
                letterSpacing: "-0.01em",
              }}
            >
              {task.title}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10.5,
                color: INK_MUTE,
                marginTop: 4,
              }}
            >
              {task.requiredSkills.slice(0, 3).join(" · ") || "any skill"}
            </div>
          </div>
        ),
      },
      style: {
        ...nodeBase,
        width: 224,
        border:
          task.status === "in_progress"
            ? `1px solid ${STAMP}`
            : `1px solid ${RULE}`,
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
        style: { stroke: c, strokeWidth: animated ? 1.4 : 1 },
        markerEnd: { type: MarkerType.ArrowClosed, color: c },
      });
      if (task.toolId && task.status === "in_progress") {
        edges.push({
          id: `e-t-${task.id}`,
          source: `tool-${task.toolId}`,
          target: `agent-${task.assignedAgent}`,
          type: "smoothstep",
          animated: true,
          style: { stroke: GOLD, strokeWidth: 1.2, strokeDasharray: "4 3" },
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
          variant={BackgroundVariant.Dots}
          color={RULE_STRONG}
          gap={22}
          size={1}
        />
        <Controls showInteractive={false} position="bottom-right" />
      </ReactFlow>
    </div>
  );
}
