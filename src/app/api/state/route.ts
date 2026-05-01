import { NextResponse } from "next/server";
import { snapshot } from "@/lib/server/swarm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(snapshot(), {
    headers: { "Cache-Control": "no-store" },
  });
}
