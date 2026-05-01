export type AgentStatus = "idle" | "busy" | "offline";
export type AgentType = "research" | "executor" | "router";
export type TaskStatus =
  | "queued"
  | "assigned"
  | "in_progress"
  | "completed"
  | "failed";

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  skills: string[];
  status: AgentStatus;
  reputation: number;
  wallet: string;
  currentTaskId: string | null;
  completedCount: number;
  createdAt: number;
}

export interface TaskLogEntry {
  ts: number;
  message: string;
  level: "info" | "ok" | "warn" | "err";
}

export interface Task {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  status: TaskStatus;
  assignedAgent: string | null;
  toolId: string | null;
  result: unknown | null;
  log: TaskLogEntry[];
  createdAt: number;
  startedAt: number | null;
  completedAt: number | null;
}

export interface Tool {
  id: string;
  name: string;
  type: "communication" | "data" | "compute" | "execution";
  matchSkills: string[];
  inputSchema: Record<string, string>;
  outputSchema: Record<string, string>;
}

export interface Snapshot {
  agents: Agent[];
  tasks: Task[];
  tools: Tool[];
  stats: {
    idle: number;
    busy: number;
    offline: number;
    queued: number;
    assigned: number;
    inProgress: number;
    completed: number;
    failed: number;
  };
}
