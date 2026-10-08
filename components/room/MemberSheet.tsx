"use client";

import { Avatar } from "../Avatar";
import { Icon } from "../Icon";
import type { Member } from "@/lib/types";

interface MemberSheetProps {
  member: Member;
  isHost: boolean;
  onClose: () => void;
  onAction: (action: "mute" | "remove" | "make-speaker" | "report") => void;
}

/** Tap a person: hosts can mute, remove or bring them to the mic; anyone can report. */
export function MemberSheet({ member, isHost, onClose, onAction }: MemberSheetProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-ink/50" role="dialog" aria-modal="true" aria-label={member.name}>
      <div className="w-full max-w-md animate-slide-up rounded-t-3xl bg-paper p-5 text-ink">
        <div className="flex items-center gap-3">
          <Avatar name={member.name} avatar={member.avatar} size={72} />
          <div className="flex-1">
            <p className="font-display text-xl font-extrabold">{member.name}</p>
            <p className="text-sm text-muted">{member.role ?? (member.onMic ? "On the mic" : "Listening")}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-11 w-11 items-center justify-center rounded-full border border-line">
            <Icon name="close" />
          </button>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          {isHost && (
            <>
              {!member.onMic && <SheetButton onClick={() => onAction("make-speaker")}>Bring to the mic</SheetButton>}
              {member.onMic && !member.muted && <SheetButton onClick={() => onAction("mute")}>Mute</SheetButton>}
              <SheetButton onClick={() => onAction("remove")}>Drop from room</SheetButton>
            </>
          )}
          <SheetButton danger onClick={() => onAction("report")}>Report {member.name}</SheetButton>
        </div>
      </div>
    </div>
  );
}

function SheetButton({ children, onClick, danger }: { children: React.ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <button type="button" onClick={onClick} className={`h-12 rounded-2xl border text-left px-4 font-bold ${danger ? "border-owa text-owa" : "border-line"}`}>
      {children}
    </button>
  );
}
