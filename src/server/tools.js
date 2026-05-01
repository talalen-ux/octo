"use strict";

const mockTools = [
  {
    id: "tool_agentmail",
    name: "AgentMail",
    type: "communication",
    matchSkills: ["email", "comms", "outreach"],
    inputSchema: { to: "string", message: "string" },
    outputSchema: { status: "string", timestamp: "string" },
    run: (input) => ({
      status: "sent",
      to: input.to ?? "agent_unknown",
      message: input.message ?? "(simulated)",
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

function pickToolForTask(requiredSkills) {
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

function runTool(toolId, input = {}) {
  const tool = mockTools.find((t) => t.id === toolId);
  if (!tool) return { error: "tool_not_found" };
  return tool.run(input);
}

function publicTools() {
  return mockTools.map(({ run, ...t }) => t);
}

module.exports = { mockTools, pickToolForTask, runTool, publicTools };
