"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function CreateAgentForm() {
  const [name, setName] = useState("");
  const [type, setType] = useState<"research" | "executor" | "router">(
    "research",
  );
  const [skills, setSkills] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await api("/api/agents", {
        method: "POST",
        body: JSON.stringify({
          name,
          type,
          skills: skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });
      setName("");
      setSkills("");
    } catch (e: any) {
      setErr(e.message || "Failed to create agent");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="agent name (optional)"
        className="bg-panel2 border border-line rounded px-2 py-1.5 text-sm focus:outline-none focus:border-accent2"
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value as any)}
        className="bg-panel2 border border-line rounded px-2 py-1.5 text-sm focus:outline-none focus:border-accent2"
      >
        <option value="research">research</option>
        <option value="executor">executor</option>
        <option value="router">router</option>
      </select>
      <input
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
        placeholder="skills (comma separated)"
        className="bg-panel2 border border-line rounded px-2 py-1.5 text-sm focus:outline-none focus:border-accent2"
      />
      {err && <div className="text-[11px] text-err">{err}</div>}
      <button
        type="submit"
        disabled={busy}
        className="px-3 py-1.5 rounded bg-accent2/20 hover:bg-accent2/30 border border-accent2/50 text-accent2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {busy ? "spawning…" : "Spawn agent"}
      </button>
    </form>
  );
}
