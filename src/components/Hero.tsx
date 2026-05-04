"use client";

import Link from "next/link";

function todayString() {
  return new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Hero({ connected }: { connected: boolean }) {
  return (
    <header className="relative px-6 sm:px-10 pt-5 pb-5 border-b border-ruleGold">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 group">
          <span
            aria-hidden
            className="w-7 h-7 rounded-md border border-gold/60 flex items-center justify-center"
            style={{
              background: "rgba(94,234,212,0.05)",
              boxShadow: "0 0 12px -4px var(--gold-glow)",
            }}
          >
            <span
              className="block w-2 h-2 rounded-sm"
              style={{
                background: "var(--gold)",
                boxShadow: "0 0 6px var(--gold)",
              }}
            />
          </span>
          <span className="display text-[18px] tracking-tight text-star group-hover:text-gold transition-colors">
            Octo·Swarm
          </span>
          <span className="mono text-[10px] tracking-[0.18em] uppercase text-starMute">
            console
          </span>
        </Link>

        <div className="flex items-center gap-5 mono text-[10.5px] text-starMute">
          <span suppressHydrationWarning className="hidden sm:inline tracking-[0.16em] uppercase">
            {todayString()}
          </span>
          <span className="flex items-center gap-2">
            <span className="relative inline-flex w-2 h-2">
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  background: connected ? "var(--leaf)" : "var(--star-mute)",
                  boxShadow: connected ? "0 0 8px var(--leaf)" : "none",
                }}
              />
              {connected && (
                <span
                  className="absolute inset-0 rounded-full animate-ripple"
                  style={{ background: "var(--leaf)" }}
                />
              )}
            </span>
            <span
              className={`tracking-[0.18em] uppercase ${
                connected ? "text-leaf" : "text-starMute"
              }`}
            >
              {connected ? "Wire open" : "Wire closed"}
            </span>
          </span>
        </div>
      </div>
    </header>
  );
}
