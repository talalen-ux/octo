import { NextResponse } from "next/server";
import { getTask } from "@/lib/server/swarm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const task = getTask(params.id);
  if (!task) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(task);
}
