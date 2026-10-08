"use client";

import { notFound } from "next/navigation";
import { RequireProfile } from "@/components/RequireProfile";
import { RoomScreen } from "@/components/room/RoomScreen";
import { getRoom } from "@/lib/data";
import type { Room } from "@/lib/types";
import { useUser } from "@/lib/user-store";

/** Resolves any room: city rooms, state rooms, and buses you host yourself. */
export default function RoomPage({ params }: { params: { roomId: string } }) {
  return (
    <RequireProfile>
      <ResolveRoom roomId={decodeURIComponent(params.roomId)} />
    </RequireProfile>
  );
}

const HOSTED_STOPS: Record<string, string[]> = {
  lagos: ["Yaba", "Obalende", "Lekki Phase 1", "Ajah (last bus stop)"],
  abuja: ["Wuse", "Maitama", "Jabi", "Gwarinpa (last stop)"],
};

function ResolveRoom({ roomId }: { roomId: string }) {
  const { hosted, profile } = useUser();

  // Buses the person started themselves.
  if (roomId.startsWith("hosted-")) {
    const ride = hosted.find((h) => `hosted-${h.id}` === roomId);
    if (!ride || !profile) notFound();
    const room: Room = {
      id: roomId,
      spotId: "hosted",
      name: ride.name,
      kind: "ride",
      topic: ride.topic,
      mode: "voice",
      capacity: 14,
      host: { name: profile.nickname, role: "Conductor" },
      stops: HOSTED_STOPS[ride.cityId],
    };
    return <RoomScreen key={room.id} room={room} backHref="/host" />;
  }

  const found = getRoom(roomId);
  if (!found) notFound();
  const { room, spot } = found;
  const backHref = room.kind === "state" ? "/naija" : spot && spot.rooms.length > 1 ? `/spot/${spot.id}` : spot ? `/city/${spot.cityId}` : "/cities";
  return <RoomScreen key={room.id} room={room} spot={spot} backHref={backHref} />;
}
