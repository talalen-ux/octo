import { NextResponse } from "next/server";
import { distributeAll } from "@/lib/server/swarm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json(distributeAll());
}
