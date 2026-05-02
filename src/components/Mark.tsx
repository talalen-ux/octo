"use client";

const ROMAN = [
  "",
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
  "XIII",
  "XIV",
  "XV",
  "XVI",
  "XVII",
  "XVIII",
  "XIX",
  "XX",
];

export function Roman({ n }: { n: number }) {
  const value = ROMAN[n] || String(n);
  return (
    <span
      className="display"
      style={{
        fontVariationSettings: '"opsz" 144, "WONK" 1',
        letterSpacing: "0.04em",
      }}
    >
      {value}
    </span>
  );
}

export function Ornament({
  glyph = "❦",
  className = "",
}: {
  glyph?: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`display text-ink ${className}`}
      style={{ fontVariationSettings: '"opsz" 144, "WONK" 1' }}
    >
      {glyph}
    </span>
  );
}

export function SectionMark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`mono text-stamp ${className}`}
      style={{ fontWeight: 700 }}
    >
      §
    </span>
  );
}

export function Pilcrow({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`mono ${className}`}>
      ¶
    </span>
  );
}

export function Pointer({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`display ${className}`}>
      ☞
    </span>
  );
}
