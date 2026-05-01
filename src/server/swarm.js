"use strict";

const {
  getAgent,
  getAgents,
  getTask,
  getTasks,
  putAgent,
  putTask,
  snapshot,
} = require("./store");
const { mockTools, pickToolForTask, runTool } = require("./tools");

let io = null;

function bindIO(server) {
  io = server;
}

function emit(event, payload) {
  if (io) io.emit(event, payload);
}
function emitState() {
  emit("state", snapshot());
}

function rid(prefix) {
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

function appendLog(task, message, level = "info") {
  task.log.push({ ts: Date.now(), message, level });
  if (task.log.length > 50) task.log.splice(0, task.log.length - 50);
}

function createAgent(input) {
  const id = rid("agent");
  const agent = {
    id,
    name: (input?.name || "").trim() || `Agent ${id.slice(-4).toUpperCase()}`,
    type: input?.type || "research",
    skills: (input?.skills || [])
      .map((s) => String(s).toLowerCase().trim())
      .filter(Boolean),
    status: "idle",
    reputation: Math.round((0.7 + Math.random() * 0.3) * 100) / 100,
    wallet: fakeWallet(),
    currentTaskId: null,
    completedCount: 0,
    createdAt: Date.now(),
  };
  putAgent(agent);
  emit("agent_created", agent);
  emitState();
  setTimeout(() => distributeAll(), 200);
  return agent;
}

function createTask(input) {
  const id = rid("task");
  const task = {
    id,
    title: (input?.title || "").trim() || "Untitled task",
    description: (input?.description || "").trim(),
    requiredSkills: (input?.requiredSkills || [])
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
  putTask(task);
  emit("task_created", task);
  emitState();
  setTimeout(() => assignTask(task.id), 400 + Math.random() * 800);
  return task;
}

function scoreAgent(agent, task) {
  if (agent.status !== "idle") return -1;
  const overlap = task.requiredSkills.filter((s) => agent.skills.includes(s)).length;
  const skillScore =
    task.requiredSkills.length === 0 ? 0.5 : overlap / task.requiredSkills.length;
  return skillScore * 100 + agent.reputation * 5 + Math.random();
}

function pickAgentFor(task) {
  const candidates = getAgents()
    .map((a) => ({ a, s: scoreAgent(a, task) }))
    .filter((x) => x.s >= 0)
    .sort((a, b) => b.s - a.s);
  return candidates[0]?.a || null;
}

function assignTask(taskId) {
  const task = getTask(taskId);
  if (!task || task.status !== "queued") return false;
  const agent = pickAgentFor(task);
  if (!agent) {
    appendLog(task, "No idle agent available — staying queued", "warn");
    putTask(task);
    emit("task_updated", task);
    emitState();
    return false;
  }
  task.status = "assigned";
  task.assignedAgent = agent.id;
  task.toolId = pickToolForTask(task.requiredSkills);
  appendLog(task, `Assigned to ${agent.name}`, "ok");

  agent.status = "busy";
  agent.currentTaskId = task.id;

  putAgent(agent);
  putTask(task);
  emit("task_assigned", { task, agent });
  emit("agent_status_update", agent);
  emitState();

  setTimeout(() => startTask(task.id), 600 + Math.random() * 900);
  return true;
}

function startTask(taskId) {
  const task = getTask(taskId);
  if (!task || task.status !== "assigned") return;
  task.status = "in_progress";
  task.startedAt = Date.now();
  appendLog(task, "Execution started");
  putTask(task);
  emit("task_started", task);
  emitState();

  const duration = 2000 + Math.random() * 6000;
  setTimeout(() => completeTask(task.id), duration);
}

function completeTask(taskId, opts = {}) {
  const task = getTask(taskId);
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
  putTask(task);

  if (task.assignedAgent) {
    const agent = getAgent(task.assignedAgent);
    if (agent) {
      agent.status = "idle";
      agent.currentTaskId = null;
      if (!failed) {
        agent.completedCount += 1;
        agent.reputation =
          Math.min(1, Math.round((agent.reputation + 0.01) * 100) / 100);
      } else {
        agent.reputation =
          Math.max(0, Math.round((agent.reputation - 0.02) * 100) / 100);
      }
      putAgent(agent);
      emit("agent_status_update", agent);
    }
  }

  emit("task_completed", task);
  emitState();

  setTimeout(() => distributeAll(), 250);
  return true;
}

function distributeAll() {
  let assigned = 0;
  const queued = getTasks().filter((t) => t.status === "queued");
  for (const t of queued) {
    if (assignTask(t.id)) assigned += 1;
  }
  return { assigned };
}

function seedDefaults() {
  if (getAgents().length > 0) return;
  createAgent({
    name: "Scout Alpha",
    type: "research",
    skills: ["research", "analysis", "data"],
  });
  createAgent({
    name: "Mailer Bee",
    type: "executor",
    skills: ["email", "comms", "outreach"],
  });
  createAgent({
    name: "Quant Gamma",
    type: "research",
    skills: ["analysis", "trading", "ml"],
  });
  createAgent({
    name: "Router Delta",
    type: "router",
    skills: ["router", "executor", "tx"],
  });

  setTimeout(() => {
    createTask({
      title: "Find best ETH liquidity pools",
      description: "Survey the current top yield opportunities across L2s.",
      requiredSkills: ["analysis", "data"],
    });
  }, 1500);
  setTimeout(() => {
    createTask({
      title: "Outreach to partner agents",
      description: "Send intro mail to peer swarm.",
      requiredSkills: ["email", "outreach"],
    });
  }, 3000);
}

module.exports = {
  bindIO,
  seedDefaults,
  createAgent,
  createTask,
  assignTask,
  completeTask,
  distributeAll,
};
