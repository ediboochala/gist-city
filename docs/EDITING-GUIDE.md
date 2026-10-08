# Editing guide

Tips for changing Gist City in VS Code. Search the whole project with **Ctrl/Cmd + Shift + F**; jump to a file with **Ctrl/Cmd + P**.

## Add a spot (a place in a city)

Open `lib/data.ts` and copy an existing spot inside `SPOTS`:

```ts
{
  id: "lagos-yaba-buka",          // unique, lowercase, dashes
  cityId: "lagos",
  name: "Mama Put, Yaba",
  area: "Yaba",
  category: "hangouts",           // rides | hangouts | style | faith
  kind: "lounge",                 // see SpotKind in lib/types.ts
  blurb: "Food gist and who cook pass debates.",
  rooms: [
    {
      id: "buka-yaba",
      spotId: "lagos-yaba-buka",
      name: "The Buka",
      kind: "lounge",             // ride | salon | table | department | lounge | state
      topic: "Which soup sweet pass: egusi or ogbono?",
      mode: "text",               // voice | text | quiet
      capacity: 60,
      host: { name: "Mama Put", role: "Cook" },
      openHours: [11, 21],        // optional
    },
  ],
},
```

Save — it appears in Lagos straight away. A spot with **one** room opens the room directly; a spot with **several** rooms shows a list first.

## Add a bus route

Use `kind: "ride"` and give it `stops`. The last stop ends the ride and clears the chat.

## 18+ rooms

Add `adultsOnly: true` to a room. Every room is open to everybody — men and women.

## Avatars

- Options (hairstyles, outfits, colours): `lib/avatar.ts`
- How each option is drawn: `components/AvatarArt.tsx` (each part is a small SVG shape — copy one and change it)
- The designer screen: `components/AvatarBuilder.tsx`

## Rooms that only open at certain times

- `openHours: [6, 22]` — open from 6am to 10pm (Lagos time)
- `openDays: [5]` — Fridays only (0 = Sunday … 6 = Saturday)
- `comingSoon: true` — shows as closed with "Opens in season"

## Change the look

- Colours: `tailwind.config.ts` → `theme.extend.colors`
- Fonts: `app/layout.tsx` (Google Fonts link) and `fontFamily` in `tailwind.config.ts`
- Room colour themes: `toneFor()` in `components/room/RoomScreen.tsx` and `TONES` in `components/TopBar.tsx`

## Change behaviour

- Bus speed: `STOP_SECONDS` in `lib/realtime.ts`
- Starting coins and daily check-in: `STARTING_COINS`, `DAILY_CHECKIN` in `lib/user-store.tsx`
- Demo chatter: `DEMO_GIST` and `DEMO_PEOPLE` in `lib/data.ts`; timing in `useRoom()`
- City mood lines: `cityMood()` in `lib/schedule.ts`

## Reset your local data

**Me → Settings → Sign out** clears everything on that browser. Or in the browser console: `localStorage.clear()`.
