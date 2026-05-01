import { NextRequest, NextResponse } from "next/server";
import { createAgent, snapshot } from "@/lib/server/swarm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(
    { agents: snapshot().agents },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const agent = createAgent(body || {});
  return NextResponse.json(agent, { status: 201 });
}
