"use client";

export default function StatPill({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number | string;
  tone?: "default" | "ok" | "warn" | "err" | "accent";
}) {
  const toneCls: Record<string, string> = {
    default: "border-line text-slate-200",
    ok: "border-ok/40 text-ok",
    warn: "border-warn/40 text-warn",
    err: "border-err/40 text-err",
    accent: "border-accent/40 text-accent",
  };
  return (
    <div
      className={`px-3 py-2 rounded-md border bg-panel/60 ${toneCls[tone]} flex flex-col`}
    >
      <span className="text-[10px] uppercase tracking-widest text-slate-400">
        {label}
      </span>
      <span className="text-lg font-semibold leading-tight">{value}</span>
    </div>
  );
}
