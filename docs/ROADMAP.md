# Roadmap: from this code to launch

Estimates assume a small, focused team (1–2 frontend developers, 1 backend developer, part-time designer, community managers).

## Phase 1 · Setup and testing (2–3 weeks)
- [x] Screens and flows working in local mode (this repo)
- [ ] Supabase project + `supabase/schema.sql`
- [ ] Test LiveKit (and Agora) voice on MTN, Airtel and Glo
- [ ] Decide final name and branding

## Phase 2 · Core app on real services (6–8 weeks)
- [ ] Phone sign-in with OTP (Supabase + Termii)
- [ ] Profiles saved to the database
- [ ] Spots and rooms loaded from the database
- [ ] Real-time chat with Supabase Realtime
- [ ] Presence: real headcounts and member lists
- [ ] State rooms
- [ ] Report + block saved to the database; basic `/admin` page

## Phase 3 · Live voice and hosts (4–6 weeks)
- [ ] LiveKit voice in rooms, data saver respected
- [ ] Host controls (mute, drop, bring to mic) enforced on the server
- [ ] Bus stops moved by conductor / schedule; chat clears at last stop
- [ ] Coins, dashes and badges on the server (no client-side coin edits)
- [ ] Hosted buses saved to the database and visible to everyone

## Phase 4 · Closed beta (4 weeks)
- [ ] Invite 100–300 people in Lagos and Abuja
- [ ] Recruit 20–30 hosts; schedule regular events
- [ ] Fix what breaks; measure: daily active users, time in rooms, return rate

## Phase 5 · Public launch
- [ ] Install as an app (PWA) from the browser
- [ ] Mobile store apps (wrap with Capacitor, or rebuild in React Native / Flutter)
- [ ] Google Play first, then the App Store

## Later
- More cities: Port Harcourt, Enugu, Ibadan, Kano
- More rooms: Gossip Car (invite-only), Barbershop, Viewing Centre, Campus, Mama Put, Owambe Hall
- Fares, coin top-ups (Paystack / Flutterwave), host earnings, sponsorships
- Events engine: big matches, Christmas, Sallah open special rooms automatically
