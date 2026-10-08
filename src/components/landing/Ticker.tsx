"use client";

/* Illustrative agent activity — the product runs as a simulation. */
const ITEMS = [
  { c: "#20E5EA", who: "Analyst", what: "scored a breakout setup", on: "ETH / USDC" },
  { c: "#FFD638", who: "Operator", what: "scaled into position", on: "SOL" },
  { c: "#FF35D2", who: "Scout", what: "found rising volume", on: "3 new pairs" },
  { c: "#20E5EA", who: "Analyst", what: "filtered out weak signals", on: "14 dropped" },
  { c: "#FFD638", who: "Operator", what: "moved a trailing stop", on: "ARB" },
  { c: "#FF35D2", who: "Scout", what: "spotted a liquidity shift", on: "BASE" },
  { c: "#FFD638", who: "Operator", what: "took profit", on: "LINK" },
  { c: "#20E5EA", who: "Analyst", what: "flagged a reversal", on: "BTC" },
];

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {ITEMS.map((it, i) => (
        <li key={i} className="flex items-center gap-3 whitespace-nowrap px-8 font-mono text-[12px] uppercase tracking-[0.16em]">
          <span className="h-[7px] w-[18px] rounded-full" style={{ background: it.c, boxShadow: `0 0 12px ${it.c}` }} />
          <span className="font-semibold text-white">{it.who}</span>
          <span className="text-k-mute">{it.what}</span>
          <span className="text-k-dim">·</span>
          <span className="text-white/60">{it.on}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Ticker() {
  return (
    <section
      aria-label="Example agent activity"
      className="relative border-y border-white/[0.06] py-6 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]"
    >
      <div className="flex w-max animate-k-marquee hover:[animation-play-state:paused]">
        <Row />
        <Row hidden />
      </div>
    </section>
  );
}
