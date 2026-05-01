import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Octo Swarm",
  description: "Decentralized agent coordination — MVP",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-bg text-slate-200 font-mono antialiased">
        {children}
      </body>
    </html>
  );
}
