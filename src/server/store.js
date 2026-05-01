"use strict";

const { publicTools } = require("./tools");

const agents = new Map();
const tasks = new Map();

function getAgents() {
  return [...agents.values()].sort((a, b) => a.createdAt - b.createdAt);
}
function getTasks() {
  return [...tasks.values()].sort((a, b) => b.createdAt - a.createdAt);
}
function getAgent(id) {
  return agents.get(id);
}
function getTask(id) {
  return tasks.get(id);
}
function putAgent(agent) {
  agents.set(agent.id, agent);
}
function putTask(task) {
  tasks.set(task.id, task);
}

function snapshot() {
  const aArr = getAgents();
  const tArr = getTasks();
  return {
    agents: aArr,
    tasks: tArr,
    tools: publicTools(),
    stats: {
      idle: aArr.filter((a) => a.status === "idle").length,
      busy: aArr.filter((a) => a.status === "busy").length,
      offline: aArr.filter((a) => a.status === "offline").length,
      queued: tArr.filter((t) => t.status === "queued").length,
      assigned: tArr.filter((t) => t.status === "assigned").length,
      inProgress: tArr.filter((t) => t.status === "in_progress").length,
      completed: tArr.filter((t) => t.status === "completed").length,
      failed: tArr.filter((t) => t.status === "failed").length,
    },
  };
}

module.exports = {
  getAgents,
  getTasks,
  getAgent,
  getTask,
  putAgent,
  putTask,
  snapshot,
};
