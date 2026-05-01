"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function CreateTaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!title.trim()) {
      setErr("Title required");
      return;
    }
    setBusy(true);
    try {
      await api("/api/tasks", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          requiredSkills: skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });
      setTitle("");
      setDescription("");
      setSkills("");
    } catch (e: any) {
      setErr(e.message || "Failed to create task");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="task title"
        className="bg-panel2 border border-line rounded px-2 py-1.5 text-sm focus:outline-none focus:border-accent"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="description (optional)"
        rows={2}
        className="bg-panel2 border border-line rounded px-2 py-1.5 text-sm resize-none focus:outline-none focus:border-accent"
      />
      <input
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
        placeholder="required skills (comma separated, e.g. analysis, data)"
        className="bg-panel2 border border-line rounded px-2 py-1.5 text-sm focus:outline-none focus:border-accent"
      />
      {err && <div className="text-[11px] text-err">{err}</div>}
      <button
        type="submit"
        disabled={busy}
        className="px-3 py-1.5 rounded bg-accent/20 hover:bg-accent/30 border border-accent/50 text-accent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {busy ? "injecting…" : "Inject task"}
      </button>
    </form>
  );
}
