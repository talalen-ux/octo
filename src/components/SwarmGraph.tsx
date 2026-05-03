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

const STAR = "#5eead4";
const STAR_SOFT = "#3dbfaa";
const STAR_MUTE = "#2a7a6b";
const STAR_FAINT = "#163e36";
const VOID = "#030605";
const VOID_DEEP = "#000000";
const ABYSS = "#060e0c";
const RULE = "#102420";
const RULE_GOLD = "#1f4540";
const GOLD = "#5eead4";
const AZURE = "#5ec8ea";
const LEAF = "#9ff0cc";
const ROSE = "#ff5e8e";

function agentColor(a: Agent): string {
  if (a.status === "offline") return STAR_MUTE;
  if (a.status === "busy") return GOLD;
  return LEAF;
}

function taskColor(t: Task): string {
  switch (t.status) {
    case "queued":
      return STAR_SOFT;
    case "assigned":
      return AZURE;
    case "in_progress":
      return GOLD;
    case "completed":
      return LEAF;
    case "failed":
      return ROSE;
  }
}

const cardBase = {
  background: ABYSS,
  border: `1px solid ${RULE}`,
  borderRadius: 2,
  padding: "10px 12px",
  color: STAR,
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
  const yTop = 70;

  // Column heads — Roman numeral + italic title
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
          <div style={{ width: 230, color: STAR, paddingBottom: 6 }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: 28,
                color: GOLD,
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              {h.num}
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: 16,
                color: STAR,
                marginTop: 4,
                paddingBottom: 4,
                borderBottom: `1px solid ${RULE_GOLD}`,
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
      position: { x: xTool, y: yTop + i * 100 },
      data: {
        label: (
          <div className="text-left" style={{ width: 200 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "var(--font-mono)",
                fontSize: 9.5,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: GOLD,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 6,
                  height: 6,
                  background: GOLD,
                  transform: "rotate(45deg)",
                  boxShadow: `0 0 8px ${GOLD}`,
                }}
              />
              {tool.type}
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: 17,
                color: STAR,
                marginTop: 4,
                letterSpacing: "-0.005em",
              }}
            >
              {tool.name}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10.5,
                color: STAR_MUTE,
                marginTop: 4,
              }}
            >
              {tool.matchSkills.slice(0, 4).join(" · ")}
            </div>
          </div>
        ),
      },
      style: { ...cardBase, width: 224 },
    });
  });

  agents.forEach((agent, i) => {
    const c = agentColor(agent);
    const busy = agent.status === "busy";
    nodes.push({
      id: `agent-${agent.id}`,
      position: { x: xAgent, y: yTop + i * 124 },
      data: {
        label: (
          <div className="text-left" style={{ width: 210 }}>
            <div
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <span
                style={{
                  position: "relative",
                  display: "inline-block",
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: c,
                  boxShadow: `0 0 10px ${c}, 0 0 2px ${c}`,
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9.5,
                  letterSpacing: "0.18em",
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
                  color: STAR_MUTE,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                {agentTypeLabel[agent.type]}
              </span>
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: 19,
                color: STAR,
                marginTop: 4,
                letterSpacing: "-0.005em",
              }}
            >
              {agent.name}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10.5,
                color: STAR_MUTE,
                marginTop: 3,
              }}
            >
              trust {Math.round(agent.reputation * 100)} · filed{" "}
              {agent.completedCount}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10.5,
                color: STAR_SOFT,
                marginTop: 2,
              }}
            >
              {agent.skills.slice(0, 4).join(" · ") || "—"}
            </div>
          </div>
        ),
      },
      style: {
        ...cardBase,
        width: 234,
        border: `1px solid ${busy ? GOLD : RULE_GOLD}`,
        boxShadow: busy
          ? `0 0 0 1px rgba(94, 234, 212,0.18), 0 0 24px -4px rgba(94, 234, 212,0.35)`
          : "none",
      },
    });
  });

  active.forEach((task, i) => {
    const c = taskColor(task);
    const running = task.status === "in_progress";
    nodes.push({
      id: `task-${task.id}`,
      position: { x: xTask, y: yTop + i * 100 },
      data: {
        label: (
          <div className="text-left" style={{ width: 200 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "var(--font-mono)",
                fontSize: 9.5,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: c,
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: c,
                  boxShadow: running ? `0 0 8px ${c}` : "none",
                }}
              />
              {taskStatusLabel[task.status]}
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: 15.5,
                color: STAR,
                marginTop: 4,
                lineHeight: 1.2,
                letterSpacing: "-0.005em",
              }}
            >
              {task.title}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10.5,
                color: STAR_MUTE,
                marginTop: 4,
              }}
            >
              {task.requiredSkills.slice(0, 3).join(" · ") || "any skill"}
            </div>
          </div>
        ),
      },
      style: {
        ...cardBase,
        width: 224,
        border: `1px solid ${running ? GOLD : RULE_GOLD}`,
        boxShadow: running
          ? `0 0 18px -4px rgba(94, 234, 212,0.35)`
          : "none",
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
          style: { stroke: GOLD, strokeWidth: 1.2, strokeDasharray: "3 3" },
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
    <div className="h-full w-full relative">
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
        {/* faint celestial dot grid */}
        <Background
          variant={BackgroundVariant.Dots}
          color={RULE_GOLD}
          gap={28}
          size={1.1}
        />
        <Controls showInteractive={false} position="bottom-right" />
      </ReactFlow>
    </div>
  );
}
