"use strict";

const { parse } = require("url");
const {
  createAgent,
  createTask,
  assignTask,
  completeTask,
  distributeAll,
} = require("./swarm");
const {
  getAgents,
  getAgent,
  getTasks,
  getTask,
  snapshot,
} = require("./store");
const { publicTools } = require("./tools");

function send(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (c) => (data += c));
    req.on("end", () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

// Returns true when request is handled.
async function handle(req, res) {
  const url = parse(req.url, true);
  const path = url.pathname || "";
  if (!path.startsWith("/api/")) return false;
  // Reserve socket.io path for socket server
  if (path.startsWith("/api/socket")) return false;

  try {
    if (path === "/api/state" && req.method === "GET") {
      send(res, 200, snapshot());
      return true;
    }

    if (path === "/api/tools" && req.method === "GET") {
      send(res, 200, { tools: publicTools() });
      return true;
    }

    if (path === "/api/agents" && req.method === "GET") {
      send(res, 200, { agents: getAgents() });
      return true;
    }
    if (path === "/api/agents" && req.method === "POST") {
      const body = await readJson(req);
      const agent = createAgent(body || {});
      send(res, 201, agent);
      return true;
    }

    const agentMatch = path.match(/^\/api\/agents\/([^/]+)$/);
    if (agentMatch && req.method === "GET") {
      const a = getAgent(agentMatch[1]);
      if (!a) return send(res, 404, { error: "not_found" }), true;
      send(res, 200, a);
      return true;
    }

    if (path === "/api/tasks" && req.method === "GET") {
      send(res, 200, { tasks: getTasks() });
      return true;
    }
    if (path === "/api/tasks" && req.method === "POST") {
      const body = await readJson(req);
      if (!body || !body.title || !String(body.title).trim()) {
        return send(res, 400, { error: "title_required" }), true;
      }
      const task = createTask(body);
      send(res, 201, task);
      return true;
    }

    const taskMatch = path.match(/^\/api\/tasks\/([^/]+)(\/(assign|complete))?$/);
    if (taskMatch) {
      const taskId = taskMatch[1];
      const sub = taskMatch[3];
      if (!sub && req.method === "GET") {
        const t = getTask(taskId);
        if (!t) return send(res, 404, { error: "not_found" }), true;
        return send(res, 200, t), true;
      }
      if (sub === "assign" && req.method === "POST") {
        const ok = assignTask(taskId);
        return send(res, ok ? 200 : 409, { ok }), true;
      }
      if (sub === "complete" && req.method === "POST") {
        const ok = completeTask(taskId, { force: true });
        return send(res, ok ? 200 : 409, { ok }), true;
      }
    }

    if (path === "/api/swarm/distribute" && req.method === "POST") {
      const r = distributeAll();
      send(res, 200, r);
      return true;
    }
    if (path === "/api/swarm/state" && req.method === "GET") {
      send(res, 200, snapshot());
      return true;
    }

    send(res, 404, { error: "no_route" });
    return true;
  } catch (err) {
    console.error("[api]", err);
    send(res, 500, { error: "internal", message: String(err && err.message) });
    return true;
  }
}

module.exports = { handle };
