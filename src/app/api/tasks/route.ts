import { NextRequest, NextResponse } from "next/server";
import { createTask, snapshot } from "@/lib/server/swarm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(
    { tasks: snapshot().tasks },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (!body?.title || !String(body.title).trim()) {
    return NextResponse.json({ error: "title_required" }, { status: 400 });
  }
  const task = createTask(body);
  return NextResponse.json(task, { status: 201 });
}
