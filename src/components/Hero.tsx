"use client";

export default function Hero({ connected }: { connected: boolean }) {
  return (
    <header className="px-6 sm:px-10 pt-8 pb-6 border-b border-rule">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md border border-rule flex items-center justify-center bg-paper2">
            <span
              className="block w-2.5 h-2.5 rounded-sm"
              style={{ background: "var(--stamp)" }}
            />
          </div>
          <div className="flex items-baseline gap-2.5">
            <h1
              className="display text-[18px] tracking-tight"
              style={{ fontWeight: 600 }}
            >
              Octo Swarm
            </h1>
            <span className="mono text-[11px] text-inkMute">v0.1</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mono text-[11px] text-inkSoft">
          <span
            className={`relative inline-flex w-2 h-2 ${
              connected ? "" : "opacity-40"
            }`}
          >
            <span
              className="absolute inset-0 rounded-full"
              style={{ background: connected ? "var(--sage)" : "var(--ink-mute)" }}
            />
            {connected && (
              <span
                className="absolute inset-0 rounded-full animate-ping"
                style={{ background: "var(--sage)" }}
              />
            )}
          </span>
          <span>{connected ? "Connected" : "Disconnected"}</span>
        </div>
      </div>

      <div className="mt-8 max-w-2xl">
        <h2
          className="display text-[34px] sm:text-[44px] leading-[1.05] tracking-tight"
          style={{ fontWeight: 600 }}
        >
          A live dashboard for an
          <br />
          autonomous agent fleet.
        </h2>
        <p className="mt-3 text-[14px] text-inkSoft leading-relaxed max-w-xl">
          Tasks are dispatched, picked up by available agents, and resolved
          with the tools at hand — every event recorded as it happens.
        </p>
      </div>
    </header>
  );
}
