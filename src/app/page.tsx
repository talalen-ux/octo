import type { Metadata } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import Landing from "@/components/landing/Landing";

const grotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AIKOLs — Trading agents, for everyone.",
  description:
    "Autonomous agents that watch the market, read the signals and act on them, around the clock.",
};

export default function Page() {
  return <Landing fontClass={grotesk.variable} />;
}
