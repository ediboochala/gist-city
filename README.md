# Gist City

**Enter bus. Sit for salon. Pull stool for beer parlour. Gist with the whole Naija.**

Gist City is a place-based social app for Nigeria — for everybody, men and women alike. Instead of feeds and group chats, people walk into a city (Lagos or Abuja), pick a spot — a danfo line, a salon, a beer parlour, a church, a mosque — and join live rooms with voice and text.

This repository is a working **Next.js 14 + TypeScript + Tailwind CSS** web app. It runs completely on your computer in **local mode** (no accounts or servers needed), so you can click through everything, then connect real services when you're ready.

---

## What works right now

| Feature | Where |
| --- | --- |
| Welcome screen and house rules | `/`, `/rules` |
| 7-step sign-up: phone, code, nickname, **avatar builder**, home city, state, house rules + 18+ | `/signup` |
| **Customisable avatars** — skin tone, face, eyes, mouth, 12 hairstyles and headwear (gele, fila, cornrows, braids…), beards, glasses, earrings, outfits (Ankara, agbada, kaftan, jersey…), colours, shuffle | sign-up, **Me → tap your avatar** |
| City picker with live headcounts, buzz meter and time-of-day mood | `/cities` |
| Lagos and Abuja with filters (Rides, Hangouts, Salon & Barbing, Faith) | `/city/lagos`, `/city/abuja` |
| Spots with several rooms: church departments, mosque circles, parlour tables, bus lines | `/spot/[spotId]` |
| **Danfo / taxi / keke rides** with stops, a moving route bar, the **"Owa o! I wan drop"** button, dropping at the next stop, and end-of-ride at the last bus stop | `/room/bus-wahala-express` |
| Salon and Barbershop, Beer Parlour (18+), church and mosque rooms, lounges, markets — open to everybody | `/room/[roomId]` |
| **Interactive rooms:** avatars beside messages, tap a message to react, floating emoji reactions, "… dey type" indicator, one-time tips, Dash button | rooms |
| **Sounds and vibration:** danfo horn when you shout Owa or reach a stop, pops, coin sound (can be turned off) | rooms, **Me → Settings** |
| Real-time text chat (open the same room in two tabs to see it sync) | every room |
| Microphone controls with a live mic-level meter, raise hand | voice rooms |
| Dashes (zobo, puff-puff, suya …) paid with Gist Coins | rooms |
| Report a room or a person; host tools (mute, drop, bring to mic) | rooms |
| Rooms that open and close with the clock (rush-hour bus, market hours, Friday Jumu'ah) | `lib/schedule.ts` |
| 37 state rooms (36 states + FCT) | `/naija` |
| Start your own bus and become the conductor | `/host` |
| Profile, Dash Wallet, daily check-in, badges, data saver, settings | `/profile` |

> **Local mode:** your profile, coins and chats are stored in your browser. Demo people post now and then so rooms feel alive while you build. Nothing is sent to a server yet.

---

## Run it in VS Code (step by step)

### 1. Install the tools (one time)

1. **Node.js 18.17 or newer** (20 LTS recommended) — <https://nodejs.org>
2. **VS Code** — <https://code.visualstudio.com>
3. **Git** — <https://git-scm.com>

Check they work. Open a terminal and run:

```bash
node -v
npm -v
git --version
```

### 2. Open the project

1. Unzip `gist-city.zip`.
2. In VS Code: **File → Open Folder…** → choose the `gist-city` folder.
3. When VS Code asks to install the recommended extensions (ESLint, Prettier, Tailwind CSS IntelliSense, Claude Code), click **Install**.

### 3. Install and start

Open the VS Code terminal (**View → Terminal**) and run:

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Use your browser's device toolbar (F12 → phone icon) to see it at phone size.

### 4. Try the key flows

1. Sign up (in local mode any phone number and any 4-digit code work).
2. Go to **Lagos → Ojuelegba to CMS → Wahala Express**. Watch the bus move every 45 seconds. Press **Owa o! I wan drop** and you'll be dropped at the next stop.
3. Open the same room in a second browser tab and chat — messages appear in both.
4. Tap **Start bus** in the bottom bar, create your own bus, and use the conductor controls.
5. Turn on **Data saver** in **Me → Settings** to switch voice rooms to text only.

---

## Put it on GitHub

1. Create an empty repository on <https://github.com/new> (don't add a README there).
2. In the VS Code terminal:

```bash
git init
git add .
git commit -m "Gist City: first version"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/gist-city.git
git push -u origin main
```

Or use the **Source Control** panel in VS Code (the branch icon on the left) → **Publish to GitHub**.

### Deploy a test link (optional)

Import the GitHub repo on <https://vercel.com/new>. It detects Next.js automatically — click **Deploy** and you get a link you can open on your phone and share with testers.

---

## Project structure

```
gist-city/
├─ app/                         Pages (Next.js App Router)
│  ├─ page.tsx                  Welcome
│  ├─ signup/page.tsx           Sign-up flow
│  ├─ rules/page.tsx            House rules
│  ├─ cities/page.tsx           City picker (home)
│  ├─ city/[cityId]/page.tsx    Lagos / Abuja with filters
│  ├─ spot/[spotId]/page.tsx    Spots with several rooms
│  ├─ room/[roomId]/page.tsx    Resolves any room → RoomScreen
│  ├─ naija/page.tsx            36 states + FCT
│  ├─ host/page.tsx             Start your own bus
│  ├─ profile/page.tsx          Wallet, badges, settings
│  └─ api/                      Server routes (report, voice-token)
├─ components/
│  ├─ room/RoomScreen.tsx       The live room — rides, salon, parlour, faith, lounges
│  ├─ room/*.tsx                Chat, composer, speakers, voice bar, dashes, route bar, sheets
│  ├─ AvatarArt.tsx             Draws avatars (SVG)
│  ├─ AvatarBuilder.tsx         The avatar designer
│  └─ *.tsx                     Shared UI: TopBar, BottomNav, Avatar, Icon, Toast
├─ lib/
│  ├─ data.ts                   ← Cities, spots, rooms, states, dashes, badges, house rules
│  ├─ schedule.ts               ← City clock, opening hours, headcounts, city mood
│  ├─ realtime.ts               ← Room chat engine (local) — swap for Supabase
│  ├─ voice.ts                  ← Mic controls (local) — swap for LiveKit
│  ├─ avatar.ts                 ← Avatar options, shuffle, avatar-from-name
│  ├─ sound.ts                  ← Horn, pop and coin sounds
│  ├─ user-store.tsx            ← Profile, coins, stats, badges — swap for Supabase
│  ├─ types.ts                  Shared types
│  └─ utils.ts                  Helpers
├─ supabase/schema.sql          Database tables + security rules for later
├─ docs/                        Guides: connecting services, roadmap, how to edit
└─ .env.example                 Keys you'll need later
```

---

## Common edits

| I want to… | Edit |
| --- | --- |
| Add a new spot or room | `lib/data.ts` → add to `SPOTS` |
| Add a new city | `lib/data.ts` → `CITIES` and `CityId` in `lib/types.ts`, then add spots |
| Change bus stops | `stops` on the room in `lib/data.ts` |
| Change how fast the bus moves | `STOP_SECONDS` in `lib/realtime.ts` |
| Change colours | `tailwind.config.ts` → `colors` |
| Change opening hours | `openHours` / `openDays` on the room |
| Add a dash | `DASHES` in `lib/data.ts` |
| Add a badge | `BADGES` in `lib/data.ts` (each has a `test` on the user's stats) |
| Add a hairstyle, outfit or colour for avatars | Options in `lib/avatar.ts`, drawing in `components/AvatarArt.tsx` |
| Change the reaction emojis | `REACTIONS` in `lib/data.ts` |
| Change sounds | `lib/sound.ts` |
| Change the city mood text | `cityMood()` in `lib/schedule.ts` |
| Change the Pidgin copy | Search the text in VS Code (Ctrl/Cmd + Shift + F) |

More detail: [`docs/EDITING-GUIDE.md`](docs/EDITING-GUIDE.md).

---

## Going live: connecting real services

The app is built so the screens never talk to a database directly — they use three hooks:

- `useUser()` in `lib/user-store.tsx` — accounts, profile, coins
- `useRoom()` in `lib/realtime.ts` — chat and members
- `useVoice()` in `lib/voice.ts` — live audio

Replace the inside of those with **Supabase** (accounts + database + real-time chat) and **LiveKit** (voice), and every screen keeps working. Full step-by-step guide: [`docs/CONNECTING-SERVICES.md`](docs/CONNECTING-SERVICES.md).

Roadmap from here to launch: [`docs/ROADMAP.md`](docs/ROADMAP.md).

---

## Scripts

```bash
npm run dev     # start the development server on http://localhost:3000
npm run build   # production build (also checks TypeScript)
npm run start   # run the production build
npm run lint    # check code style
```

## Notes

- All spot, business and person names are placeholders.
- Web first: this runs on phones through the browser. It can be turned into an installable app later (PWA) or rebuilt in React Native / Flutter using the same design and logic.
