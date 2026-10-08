import { NextResponse } from "next/server";

// Issues a LiveKit access token so a person can join a room's voice.
// 1. npm install livekit-server-sdk
// 2. Set LIVEKIT_API_KEY, LIVEKIT_API_SECRET and NEXT_PUBLIC_LIVEKIT_URL in .env.local
// 3. Replace the body below with:
//
//   import { AccessToken } from "livekit-server-sdk";
//   const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, { identity: userId, name: nickname });
//   at.addGrant({ room: roomId, roomJoin: true, canPublish: canSpeak, canSubscribe: true });
//   return NextResponse.json({ token: await at.toJwt(), url: process.env.NEXT_PUBLIC_LIVEKIT_URL });
//
// Only hosts and people they bring to the mic should get canPublish: true.

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
    return NextResponse.json(
      { error: "Voice is in local mode. Add LiveKit keys to .env.local to enable live audio.", roomId: body?.roomId ?? null },
      { status: 501 },
    );
  }
  return NextResponse.json({ error: "Token creation not wired yet — see comments in this file." }, { status: 501 });
}
