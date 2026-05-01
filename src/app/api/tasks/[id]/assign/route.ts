import { NextResponse } from "next/server";
import { assignTask } from "@/lib/server/swarm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const ok = assignTask(params.id);
  return NextResponse.json({ ok }, { status: ok ? 200 : 409 });
}
