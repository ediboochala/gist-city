"use client";

// Tiny sound effects made with the Web Audio API — no audio files needed.
// Respect the person's settings: call these only when settings.sounds is on.

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    ctx = new Ctx();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(freq: number, start: number, duration: number, type: OscillatorType = "square", volume = 0.08) {
  const c = audio();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, c.currentTime + start);
  gain.gain.linearRampToValueAtTime(volume, c.currentTime + start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + duration);
  osc.connect(gain).connect(c.destination);
  osc.start(c.currentTime + start);
  osc.stop(c.currentTime + start + duration + 0.02);
}

/** Danfo horn: "pom-pom!" — plays when someone shouts Owa or the bus reaches a stop. */
export function playHorn() {
  tone(392, 0, 0.16);
  tone(330, 0, 0.16);
  tone(392, 0.22, 0.24);
  tone(330, 0.22, 0.24);
}

/** Soft pop for sending a message or a reaction. */
export function playPop() {
  tone(660, 0, 0.08, "sine", 0.06);
}

/** Little "ka-ching" for dashes and coins. */
export function playCoin() {
  tone(988, 0, 0.08, "triangle", 0.07);
  tone(1319, 0.08, 0.18, "triangle", 0.07);
}

export function buzz(ms = 60) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(ms);
}
