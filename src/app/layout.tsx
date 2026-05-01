import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Octo Swarm — Watch AI agents collaborate in real time",
  description:
    "A live, simulated network of AI agents that pick up jobs, work together, and deliver results.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="text-slate-200 font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
