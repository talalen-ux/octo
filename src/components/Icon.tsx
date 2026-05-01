"use client";

type IconName =
  | "agent"
  | "task"
  | "tool"
  | "spark"
  | "send"
  | "plus"
  | "check"
  | "warning"
  | "clock"
  | "queue"
  | "play"
  | "wifi"
  | "lightning"
  | "graph"
  | "book";

const paths: Record<IconName, JSX.Element> = {
  agent: (
    <>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 20c1.5-3.5 4.2-5 7-5s5.5 1.5 7 5" />
    </>
  ),
  task: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M8 10h8M8 14h5" />
    </>
  ),
  tool: (
    <>
      <path d="M14.7 6.3a4 4 0 1 0-5.4 5.4l-5.6 5.6a1.5 1.5 0 1 0 2.1 2.1l5.6-5.6a4 4 0 0 0 5.4-5.4l-2.5 2.5-2-2 2.4-2.6Z" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
    </>
  ),
  send: (
    <>
      <path d="M4 11.5 20 4l-7.5 16-2-7-6.5-1.5Z" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14M5 12h14" />
    </>
  ),
  check: (
    <>
      <path d="m4 12 5 5L20 6" />
    </>
  ),
  warning: (
    <>
      <path d="M12 4 2 20h20L12 4Z" />
      <path d="M12 11v4M12 18v.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  queue: (
    <>
      <path d="M4 6h16M4 12h12M4 18h8" />
    </>
  ),
  play: (
    <>
      <path d="M7 5v14l12-7z" />
    </>
  ),
  wifi: (
    <>
      <path d="M2 9c5.5-5 14.5-5 20 0M5 13c3.5-3 10.5-3 14 0M8.5 16.5c2-1.5 5-1.5 7 0" />
      <circle cx="12" cy="20" r="1" />
    </>
  ),
  lightning: (
    <>
      <path d="m13 2-9 12h6l-1 8 9-12h-6l1-8Z" />
    </>
  ),
  graph: (
    <>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M8 6h8M6 8v8M18 8v8M8 18h8" />
    </>
  ),
  book: (
    <>
      <path d="M4 5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 0-2 2V5Z" />
      <path d="M8 7h8M8 11h8M8 15h6" />
    </>
  ),
};

export default function Icon({
  name,
  size = 16,
  className = "",
  strokeWidth = 1.6,
}: {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
