import "server-only";
import type {
  Agent,
  AgentStatus,
  AgentType,
  Snapshot,
  Task,
  TaskLogEntry,
  Tool,
} from "@/types";

// ---- Mock tools ------------------------------------------------------------

interface MockTool extends Tool {
  run: (input: Record<string, unknown>) => Record<string, unknown>;
}

const mockTools: MockTool[] = [
  {
    id: "tool_agentmail",
    name: "AgentMail",
    type: "communication",
    matchSkills: ["email", "comms", "outreach"],
    inputSchema: { to: "string", message: "string" },
    outputSchema: { status: "string", timestamp: "string" },
    run: (input) => ({
      status: "sent",
      to: (input.to as string) ?? "agent_unknown",
      message: (input.message as string) ?? "(simulated)",
      timestamp: new Date().toISOString(),
    }),
  },
  {
    id: "tool_datafetch",
    name: "DataFetch",
    type: "data",
    matchSkills: ["data", "research", "analysis"],
    inputSchema: { query: "string" },
    outputSchema: { result: "string" },
    run: () => {
      const samples = [
        "ETH/USDC pool depth 12.4M, APY 6.7%",
        "BTC dominance 54.2%, sentiment neutral",
        "Liquidity gap detected on Arbitrum",
        "Top stablecoin yield: 8.1% on Pendle",
      ];
      return {
        result: samples[Math.floor(Math.random() * samples.length)],
        source: "mock-feed",
      };
    },
  },
  {
    id: "tool_aicompute",
    name: "AICompute",
    type: "compute",
    matchSkills: ["analysis", "reasoning", "trading", "ml"],
    inputSchema: { prompt: "string" },
    outputSchema: { analysis: "string" },
    run: () => {
      const insights = [
        "Swarm consensus suggests rotating to mid-cap L2 tokens.",
        "Anomaly detected in mempool — recommend hold.",
        "Cross-agent signal: bullish divergence on 4h chart.",
        "Liquidity flow indicates accumulation phase.",
      ];
      return {
        analysis: insights[Math.floor(Math.random() * insights.length)],
        confidence: Math.round(60 + Math.random() * 35),
      };
    },
  },
  {
    id: "tool_executor",
    name: "Executor",
    type: "execution",
    matchSkills: ["executor", "trading", "tx"],
    inputSchema: { action: "string" },
    outputSchema: { txHash: "string" },
    run: () => ({
      txHash: "0x" + Math.random().toString(16).slice(2, 10) + "...",
      status: "confirmed",
    }),
  },
];

function pickToolForTask(requiredSkills: string[]): string {
  let best = mockTools[0];
  let bestScore = -1;
  for (const t of mockTools) {
    const score = t.matchSkills.filter((s) => requiredSkills.includes(s)).length;
    if (score > bestScore) {
      bestScore = score;
      best = t;
    }
  }
  return best.id;
}

function runTool(toolId: string, input: Record<string, unknown> = {}) {
  const tool = mockTools.find((t) => t.id === toolId);
  if (!tool) return { error: "tool_not_found" };
  return tool.run(input);
}

function publicTools(): Tool[] {
  return mockTools.map(({ run: _run, ...t }) => t);
}

// ---- Event ring buffer for polling-based clients ---------------------------

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

// ---- Singleton state via globalThis ---------------------------------------

interface SwarmState {
  agents: Map<string, Agent>;
  tasks: Map<string, Task>;
  events: SwarmEvent[];
  eventSeq: number;
  seeded: boolean;
}

declare global {

  var __octoSwarm: SwarmState | undefined;
}

function getState(): SwarmState {
  if (!globalThis.__octoSwarm) {
    globalThis.__octoSwarm = {
      agents: new Map(),
      tasks: new Map(),
      events: [],
      eventSeq: 0,
      seeded: false,
    };
  }
  return globalThis.__octoSwarm;
}

function pushEvent(kind: SwarmEvent["kind"], text: string) {
  const s = getState();
  s.eventSeq += 1;
  s.events.push({ id: s.eventSeq, ts: Date.now(), kind, text });
  if (s.events.length > 200) s.events.splice(0, s.events.length - 200);
}

// ---- Helpers ---------------------------------------------------------------

function rid(prefix: string) {
  return (
    prefix +
    "_" +
    Math.random().toString(36).slice(2, 8) +
    Date.now().toString(36).slice(-3)
  );
}

function fakeWallet() {
  let s = "0x";
  for (let i = 0; i < 8; i++) s += Math.floor(Math.random() * 16).toString(16);
  return s + "..";
}

function appendLog(
  task: Task,
  message: string,
  level: TaskLogEntry["level"] = "info",
) {
  task.log.push({ ts: Date.now(), message, level });
  if (task.log.length > 50) task.log.splice(0, task.log.length - 50);
}

function getAgents(): Agent[] {
  return [...getState().agents.values()].sort(
    (a, b) => a.createdAt - b.createdAt,
  );
}
function getTasks(): Task[] {
  return [...getState().tasks.values()].sort(
    (a, b) => b.createdAt - a.createdAt,
  );
}

// ---- Public API ------------------------------------------------------------

export function snapshot(): Snapshot & { events: SwarmEvent[] } {
  ensureSeed();
  const a = getAgents();
  const t = getTasks();
  return {
    agents: a,
    tasks: t,
    tools: publicTools(),
    events: [...getState().events].slice(-80).reverse(),
    stats: {
      idle: a.filter((x) => x.status === "idle").length,
      busy: a.filter((x) => x.status === "busy").length,
      offline: a.filter((x) => x.status === "offline").length,
      queued: t.filter((x) => x.status === "queued").length,
      assigned: t.filter((x) => x.status === "assigned").length,
      inProgress: t.filter((x) => x.status === "in_progress").length,
      completed: t.filter((x) => x.status === "completed").length,
      failed: t.filter((x) => x.status === "failed").length,
    },
  };
}

export function eventsSince(sinceId: number): SwarmEvent[] {
  return getState().events.filter((e) => e.id > sinceId);
}

export function createAgent(input: {
  name?: string;
  type?: AgentType;
  skills?: string[];
}): Agent {
  ensureSeed();
  const id = rid("agent");
  const agent: Agent = {
    id,
    name: (input.name || "").trim() || `Agent ${id.slice(-4).toUpperCase()}`,
    type: (input.type as AgentType) || "research",
    skills: (input.skills || [])
      .map((s) => String(s).toLowerCase().trim())
      .filter(Boolean),
    status: "idle",
    reputation: Math.round((0.7 + Math.random() * 0.3) * 100) / 100,
    wallet: fakeWallet(),
    currentTaskId: null,
    completedCount: 0,
    createdAt: Date.now(),
  };
  getState().agents.set(id, agent);
  pushEvent("agent_created", `agent online — ${agent.name}`);
  setTimeout(() => distributeAll(), 200);
  return agent;
}

export function createTask(input: {
  title: string;
  description?: string;
  requiredSkills?: string[];
}): Task {
  ensureSeed();
  const id = rid("task");
  const task: Task = {
    id,
    title: (input.title || "").trim() || "Untitled task",
    description: (input.description || "").trim(),
    requiredSkills: (input.requiredSkills || [])
      .map((s) => String(s).toLowerCase().trim())
      .filter(Boolean),
    status: "queued",
    assignedAgent: null,
    toolId: null,
    result: null,
    log: [],
    createdAt: Date.now(),
    startedAt: null,
    completedAt: null,
  };
  appendLog(task, "Task injected into swarm");
  getState().tasks.set(id, task);
  pushEvent("task_created", `task created — ${task.title}`);
  setTimeout(() => assignTask(task.id), 400 + Math.random() * 800);
  return task;
}

function scoreAgent(agent: Agent, task: Task): number {
  if (agent.status !== "idle") return -1;
  const overlap = task.requiredSkills.filter((s) =>
    agent.skills.includes(s),
  ).length;
  const skillScore =
    task.requiredSkills.length === 0 ? 0.5 : overlap / task.requiredSkills.length;
  return skillScore * 100 + agent.reputation * 5 + Math.random();
}

function pickAgentFor(task: Task): Agent | null {
  const candidates = getAgents()
    .map((a) => ({ a, s: scoreAgent(a, task) }))
    .filter((x) => x.s >= 0)
    .sort((a, b) => b.s - a.s);
  return candidates[0]?.a || null;
}

export function assignTask(taskId: string): boolean {
  const state = getState();
  const task = state.tasks.get(taskId);
  if (!task || task.status !== "queued") return false;
  const agent = pickAgentFor(task);
  if (!agent) {
    appendLog(task, "No idle agent available — staying queued", "warn");
    return false;
  }
  task.status = "assigned";
  task.assignedAgent = agent.id;
  task.toolId = pickToolForTask(task.requiredSkills);
  appendLog(task, `Assigned to ${agent.name}`, "ok");

  agent.status = "busy" as AgentStatus;
  agent.currentTaskId = task.id;

  pushEvent("task_assigned", `${agent.name} ← ${task.title}`);
  pushEvent("agent_status_update", `${agent.name} → working`);

  setTimeout(() => startTask(task.id), 600 + Math.random() * 900);
  return true;
}

function startTask(taskId: string) {
  const task = getState().tasks.get(taskId);
  if (!task || task.status !== "assigned") return;
  task.status = "in_progress";
  task.startedAt = Date.now();
  appendLog(task, "Execution started");
  pushEvent("task_started", `started ${task.title}`);

  const duration = 2000 + Math.random() * 6000;
  setTimeout(() => completeTask(task.id), duration);
}

export function completeTask(
  taskId: string,
  opts: { force?: boolean } = {},
): boolean {
  const state = getState();
  const task = state.tasks.get(taskId);
  if (!task) return false;
  if (!opts.force && task.status !== "in_progress") return false;

  const failed = !opts.force && Math.random() < 0.08;

  if (task.toolId) {
    const toolOut = runTool(task.toolId, { prompt: task.title });
    task.result = toolOut;
    const tool = mockTools.find((t) => t.id === task.toolId);
    appendLog(task, `Used tool: ${tool?.name || task.toolId}`, "info");
  }

  if (failed) {
    task.status = "failed";
    appendLog(task, "Execution failed (simulated)", "err");
  } else {
    task.status = "completed";
    appendLog(task, "Task completed", "ok");
  }
  task.completedAt = Date.now();

  if (task.assignedAgent) {
    const agent = state.agents.get(task.assignedAgent);
    if (agent) {
      agent.status = "idle";
      agent.currentTaskId = null;
      if (!failed) {
        agent.completedCount += 1;
        agent.reputation = Math.min(
          1,
          Math.round((agent.reputation + 0.01) * 100) / 100,
        );
      } else {
        agent.reputation = Math.max(
          0,
          Math.round((agent.reputation - 0.02) * 100) / 100,
        );
      }
      pushEvent("agent_status_update", `${agent.name} → available`);
    }
  }

  pushEvent(
    "task_completed",
    `${failed ? "failed" : "completed"} — ${task.title}`,
  );

  setTimeout(() => distributeAll(), 250);
  return true;
}

export function distributeAll(): { assigned: number } {
  let assigned = 0;
  const queued = getTasks().filter((t) => t.status === "queued");
  for (const t of queued) {
    if (assignTask(t.id)) assigned += 1;
  }
  return { assigned };
}

export function getAgent(id: string): Agent | undefined {
  return getState().agents.get(id);
}
export function getTask(id: string): Task | undefined {
  return getState().tasks.get(id);
}

// ---- Seeds (idempotent) ----------------------------------------------------

export function ensureSeed() {
  const state = getState();
  if (state.seeded) return;
  state.seeded = true;
  if (state.agents.size > 0) return;

  // Seed inline (avoid triggering distributeAll re-entry storm; just create)
  const seedAgent = (
    name: string,
    type: AgentType,
    skills: string[],
  ): Agent => {
    const id = rid("agent");
    const a: Agent = {
      id,
      name,
      type,
      skills,
      status: "idle",
      reputation: Math.round((0.75 + Math.random() * 0.2) * 100) / 100,
      wallet: fakeWallet(),
      currentTaskId: null,
      completedCount: 0,
      createdAt: Date.now() + state.agents.size,
    };
    state.agents.set(id, a);
    pushEvent("agent_created", `agent online — ${a.name}`);
    return a;
  };

  seedAgent("Scout Alpha", "research", ["research", "analysis", "data"]);
  seedAgent("Mailer Bee", "executor", ["email", "comms", "outreach"]);
  seedAgent("Quant Gamma", "research", ["analysis", "trading", "ml"]);
  seedAgent("Router Delta", "router", ["router", "executor", "tx"]);

  setTimeout(() => {
    createTask({
      title: "Find best ETH liquidity pools",
      description: "Survey the current top yield opportunities across L2s.",
      requiredSkills: ["analysis", "data"],
    });
  }, 800);
  setTimeout(() => {
    createTask({
      title: "Outreach to partner agents",
      description: "Send intro mail to peer swarm.",
      requiredSkills: ["email", "outreach"],
    });
  }, 2200);
}
