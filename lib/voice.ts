"use client";

// ---------------------------------------------------------------------------
// Live voice
//
// LOCAL MODE: asks for real microphone permission and shows a live mic level,
// so you can test the controls (mic on/off, raise hand, leave). Audio is not
// sent anywhere yet.
//
// LIVEKIT MODE (later): install `livekit-client`, create a token on the server
// (app/api/voice-token/route.ts is already stubbed), then connect inside
// `connect()` below. See docs/CONNECTING-SERVICES.md.
// ---------------------------------------------------------------------------

import { useCallback, useEffect, useRef, useState } from "react";

export type VoiceStatus = "off" | "listening" | "requesting" | "speaking" | "blocked";

export function useVoice(roomId: string | undefined, enabled: boolean) {
  const [status, setStatus] = useState<VoiceStatus>("off");
  const [handRaised, setHandRaised] = useState(false);
  const [level, setLevel] = useState(0);
  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);

  const stopMic = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    ctxRef.current?.close().catch(() => undefined);
    ctxRef.current = null;
    setLevel(0);
  }, []);

  // Joining a voice room = listening by default (like sitting in the bus).
  useEffect(() => {
    if (!roomId || !enabled) {
      setStatus("off");
      return;
    }
    setStatus("listening");
    // TODO(LiveKit): connect to the room here as a listener.
    return () => {
      stopMic();
      setHandRaised(false);
      setStatus("off");
      // TODO(LiveKit): disconnect here.
    };
  }, [roomId, enabled, stopMic]);

  const startMic = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setStatus("blocked");
      return;
    }
    setStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      streamRef.current = stream;
      // Mic level meter so people can see they're being heard.
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      ctxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      const loop = () => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        setLevel(Math.min(1, avg / 60));
        rafRef.current = requestAnimationFrame(loop);
      };
      loop();
      setStatus("speaking");
      setHandRaised(false);
      // TODO(LiveKit): publish the microphone track here.
    } catch {
      setStatus("blocked");
    }
  }, []);

  const toggleMic = useCallback(() => {
    if (status === "speaking") {
      stopMic();
      setStatus("listening");
      // TODO(LiveKit): unpublish the microphone track.
    } else {
      void startMic();
    }
  }, [status, startMic, stopMic]);

  const toggleHand = useCallback(() => setHandRaised((h) => !h), []);

  return { status, handRaised, level, toggleMic, toggleHand, stopMic };
}
