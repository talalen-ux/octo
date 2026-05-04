"use client";

const OCTOPUS_LINES = [
  "        ___________        ",
  "       /           \\       ",
  "      |  </>   </>  |      ",
  "      |     ___     |      ",
  "       \\   |___|   /       ",
  "        \\_________/        ",
  "        /| | | | |\\        ",
  "       / | | | | | \\       ",
  "      ;  | | | | |  ;      ",
  "     ;   | | | | |   ;     ",
  "    /    | | | | |    \\    ",
  "   ;    /| | | | |\\    ;   ",
  "  ;    / | | | | | \\    ;  ",
  "  |   ;  | | | | |  ;   |  ",
  "  ;   ;  | | | | |  ;   ;  ",
  "   \\   \\ | | | | | /   /   ",
  "    \\   \\ \\ | | / /   /    ",
  "     \\___\\\\\\|||///___/     ",
  "          '''   '''         ",
];

export default function CodeOctopus({
  size = 9,
  haloOpacity = 0.16,
}: {
  size?: number;
  haloOpacity?: number;
}) {
  const line = Math.round(size * 1.18);
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <span
        aria-hidden
        className="absolute w-[80%] h-[80%] rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(94,234,212,${haloOpacity}) 0%, rgba(94,234,212,${haloOpacity * 0.25}) 45%, transparent 70%)`,
          filter: "blur(2px)",
        }}
      />
      <pre
        aria-label="Octopus, made of code symbols"
        className="mono relative select-none"
        style={{
          color: "var(--gold)",
          fontSize: size,
          lineHeight: `${line}px`,
          letterSpacing: "0.02em",
          textShadow:
            "0 0 6px rgba(94,234,212,0.55), 0 0 1px rgba(94,234,212,0.9)",
          margin: 0,
          padding: 0,
          fontVariantLigatures: "none",
          fontWeight: 600,
        }}
      >
        {OCTOPUS_LINES.map((l, i) => (
          <span
            key={i}
            className="constellation-star block"
            style={{
              animationDelay: `${i * 70}ms`,
              whiteSpace: "pre",
              opacity: 0.92,
            }}
          >
            {l}
          </span>
        ))}
      </pre>
    </div>
  );
}
