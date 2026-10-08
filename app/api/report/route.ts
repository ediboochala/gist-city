import { NextResponse } from "next/server";

// Receives reports from rooms. In local mode it only logs them.
// TODO: save to Supabase `reports` table and notify the moderation team.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.roomId !== "string" || typeof body.reason !== "string") {
    return NextResponse.json({ error: "roomId and reason are required" }, { status: 400 });
  }
  console.info("[report]", body.roomId, body.reason, body.target ?? "", body.details ?? "");
  return NextResponse.json({ ok: true });
}
