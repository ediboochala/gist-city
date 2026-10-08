# Connecting real services

Gist City runs in **local mode** out of the box. This guide moves it to real accounts, real-time chat across devices, and live voice. Do it one service at a time and test after each.

The screens only talk to three hooks, so this is mostly about rewriting three files:

| Hook | File | Replace with |
| --- | --- | --- |
| `useUser()` | `lib/user-store.tsx` | Supabase Auth + `profiles`, `wallet_entries` tables |
| `useRoom()` | `lib/realtime.ts` | Supabase `messages` table + Realtime |
| `useVoice()` | `lib/voice.ts` | LiveKit |

---

## 1. Supabase — accounts, database, real-time chat

1. Create a free project at <https://supabase.com>.
2. **SQL Editor → New query**, paste everything from `supabase/schema.sql`, click **Run**.
3. **Project Settings → API**: copy the Project URL and the `anon` public key into `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```

4. Install the client:

   ```bash
   npm install @supabase/supabase-js
   ```

5. Create `lib/supabase.ts`:

   ```ts
   import { createClient } from "@supabase/supabase-js";
   export const supabase = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
   );
   ```

6. Seed spots and rooms: write a small script (or use the Table Editor) to insert the data from `lib/data.ts` into `spots` and `rooms`.

### Phone sign-in

In Supabase: **Authentication → Providers → Phone** → enable, and pick an SMS provider. Supabase supports Twilio, MessageBird, Vonage and others out of the box. For better delivery to Nigerian numbers you can use **Termii** through a Supabase "Send SMS" hook.

In `app/signup/page.tsx`:

```ts
// "Send me code"
await supabase.auth.signInWithOtp({ phone: "+234" + digits });
// "Confirm code"
await supabase.auth.verifyOtp({ phone: "+234" + digits, token: code, type: "sms" });
// After the rules step
await supabase.from("profiles").insert({ id: user.id, nickname, colour, avatar, home_city, state_of_origin });
```

### Real-time chat (`lib/realtime.ts`)

Replace the three transport functions:

```ts
// load history
const { data } = await supabase
  .from("messages").select("*, profiles(nickname, colour)")
  .eq("room_id", roomId).order("created_at", { ascending: false }).limit(80);

// send
await supabase.from("messages").insert({ room_id: roomId, author_id: me.id, text, type });

// subscribe
const channel = supabase
  .channel(`room:${roomId}`)
  .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `room_id=eq.${roomId}` },
      (payload) => setMessages((m) => [...m, toChatMessage(payload.new)]))
  .subscribe();
return () => { supabase.removeChannel(channel); };
```

**Who is in the room:** use Supabase **Presence** on the same channel (`channel.track({ id, name, colour, onMic })`) and build the `members` list from `channel.presenceState()`. This also replaces the demo headcounts in `lib/schedule.ts` → `liveCount()`.

**Turn off demo activity** once real people are in: delete the "Demo activity" effect in `useRoom()`.

**Bus stops:** store `current_stop` on the `rooms` row. The conductor's "move to next stop" button updates it; everyone subscribes to `rooms` changes. A scheduled Supabase Edge Function can move buses automatically.

**Ending a ride:** when `current_stop` reaches the last stop, delete that ride's messages (or mark them hidden) — this is the "chat clears at the last bus stop" promise.

### Coins (`lib/user-store.tsx`)

Read balance from the `wallet_balances` view. **Never let the browser add coins directly** — create a Next.js API route (e.g. `app/api/wallet/route.ts`) that uses the Supabase **service role key** on the server to insert `wallet_entries` after checking the rules (one check-in a day, enough balance for a dash, etc.).

---

## 2. LiveKit — live voice

LiveKit is open source; you can use LiveKit Cloud to start and self-host later.

1. Create a project at <https://cloud.livekit.io>. Copy the URL, API key and secret into `.env.local`.
2. Install:

   ```bash
   npm install livekit-client livekit-server-sdk
   ```

3. Finish `app/api/voice-token/route.ts` (instructions are in the file). Only hosts and people they bring to the mic get `canPublish: true`.
4. In `lib/voice.ts`, at each `TODO(LiveKit)`:

   ```ts
   import { Room, RoomEvent } from "livekit-client";
   const lk = new Room({ adaptiveStream: true, dynacast: true });
   const { token, url } = await fetch("/api/voice-token", { method: "POST", body: JSON.stringify({ roomId }) }).then((r) => r.json());
   await lk.connect(url, token);                       // join as listener
   await lk.localParticipant.setMicrophoneEnabled(true);  // go on the mic
   lk.on(RoomEvent.ActiveSpeakersChanged, (speakers) => { /* set `speaking` on members */ });
   lk.disconnect();                                     // leave
   ```

5. **Test on Nigerian networks** (MTN, Airtel, Glo) before launch. Also try **Agora** if quality is better for your users — the `useVoice()` hook makes switching easy.

**Data saver:** keep it. When `settings.dataSaver` is on, don't connect to LiveKit at all.

---

## 3. Moderation

- Save reports from `app/api/report/route.ts` into the `reports` table.
- Build a simple `/admin` page (protected: `profiles.is_moderator = true`) to review reports, set `banned_until`, and close rooms.
- Add a word filter in the message insert path (API route or a Postgres trigger) for the worst words.

---

## 4. Payments (later — fares and top-ups)

1. Create a **Paystack** (or Flutterwave) account; add keys to `.env.local`.
2. Top-up: API route creates a Paystack transaction → user pays → Paystack webhook (`app/api/paystack/webhook/route.ts`) verifies the signature and inserts a positive `wallet_entries` row.
3. Fares: set `fare_coins` on a room. When someone boards, an API route checks balance, inserts a negative entry for the passenger and a share for the host.
4. Keep state rooms, prayer rooms and some buses free.

---

## 5. Legal checklist before real users

- Register the business with the CAC.
- Privacy policy and terms of service (Nigeria Data Protection Act).
- Get advice from a Nigerian tech lawyer — this guide is not legal advice.
