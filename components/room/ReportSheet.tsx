"use client";

import { useState } from "react";
import { Icon } from "../Icon";

const REASONS = [
  "Naming and shaming a real person",
  "Bullying or harassment",
  "Hate against a tribe or faith",
  "Sexual or 18+ content in the wrong room",
  "Scam or spam",
  "Something else",
];

interface ReportSheetProps {
  roomName: string;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => void;
}

/** Bottom sheet for reporting a room or person to the moderation team. */
export function ReportSheet({ roomName, onClose, onSubmit }: ReportSheetProps) {
  const [reason, setReason] = useState(REASONS[0]!);
  const [details, setDetails] = useState("");
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-ink/50" role="dialog" aria-modal="true" aria-labelledby="report-title">
      <div className="w-full max-w-md animate-slide-up rounded-t-3xl bg-paper p-5 text-ink">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="report-title" className="font-display text-xl font-extrabold">Report {roomName}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-11 w-11 items-center justify-center rounded-full border border-line">
            <Icon name="close" />
          </button>
        </div>
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm text-muted">Wetin happen?</legend>
          {REASONS.map((r) => (
            <label key={r} className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border border-line px-3">
              <input type="radio" name="reason" checked={reason === r} onChange={() => setReason(r)} className="h-5 w-5 accent-naija" />
              <span className="text-sm">{r}</span>
            </label>
          ))}
        </fieldset>
        <label className="mt-3 flex flex-col gap-1 text-sm font-bold">
          More details (optional)
          <textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={3} maxLength={500} className="rounded-xl border border-line p-3 font-normal" />
        </label>
        <button type="button" onClick={() => onSubmit(reason, details)} className="mt-4 h-12 w-full rounded-2xl bg-owa font-display text-base font-extrabold text-white">
          Send report
        </button>
      </div>
    </div>
  );
}
