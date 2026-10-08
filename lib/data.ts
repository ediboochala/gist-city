import type { BadgeDef, City, CityId, DashItem, Room, RoomKind, Spot } from "./types";

// ---------------------------------------------------------------------------
// Cities
// ---------------------------------------------------------------------------

export const CITIES: City[] = [
  {
    id: "lagos",
    name: "Lagos",
    tagline: "Danfo, go-slow, and Island vs Mainland",
    theme: "danfo",
    rideWord: "danfo",
    live: true,
  },
  {
    id: "abuja",
    name: "Abuja",
    tagline: "Taxi, keke, and Jabi Lake evenings",
    theme: "naija",
    rideWord: "taxi",
    live: true,
  },
];

export const COMING_SOON_CITIES = ["Port Harcourt", "Enugu", "Ibadan", "Kano"];

export function getCity(id: string): City | undefined {
  return CITIES.find((c) => c.id === id);
}

// ---------------------------------------------------------------------------
// Spots and rooms
// All names below are placeholders. Swap them for real partner venues later.
// ---------------------------------------------------------------------------

const SPOTS: Spot[] = [
  // ------------------------------- LAGOS ---------------------------------
  {
    id: "lagos-ojuelegba-cms",
    cityId: "lagos",
    name: "Ojuelegba to CMS",
    area: "Ojuelegba",
    category: "rides",
    kind: "bus",
    blurb: "The busiest danfo line in Gist City. Board, gist, shout Owa when you reach.",
    rooms: [
      {
        id: "bus-wahala-express",
        spotId: "lagos-ojuelegba-cms",
        name: "Wahala Express",
        kind: "ride",
        topic: "Relationship wahala — who don text their ex this week?",
        mode: "voice",
        capacity: 14,
        host: { name: "Tunde", role: "Conductor" },
        stops: ["Ojuelegba", "Breakup Junction", "Ex Don Text", "Owambe Gate", "CMS (last bus stop)"],
      },
      {
        id: "bus-money-matter",
        spotId: "lagos-ojuelegba-cms",
        name: "Money Matter Line",
        kind: "ride",
        topic: "Salary, side hustle, and how to survive till month end",
        mode: "voice",
        capacity: 14,
        host: { name: "Sade", role: "Conductor" },
        stops: ["Ojuelegba", "Salary Junction", "Hustle Roundabout", "Ajo Bus Stop", "CMS (last bus stop)"],
      },
    ],
  },
  {
    id: "lagos-third-mainland",
    cityId: "lagos",
    name: "Third Mainland Go-slow",
    area: "Third Mainland Bridge",
    category: "rides",
    kind: "bus",
    blurb: "Rush-hour bus. Opens in the morning and evening traffic.",
    rooms: [
      {
        id: "bus-go-slow",
        spotId: "lagos-third-mainland",
        name: "Go-slow Gist Bus",
        kind: "ride",
        topic: "Traffic don hold us — tell us your own story",
        mode: "voice",
        capacity: 14,
        host: { name: "Kunle", role: "Conductor" },
        stops: ["Oworonshoki", "Middle of the Bridge", "Adeniji", "Obalende (last bus stop)"],
        openHours: [6, 22],
      },
    ],
  },
  {
    id: "lagos-baba-sola",
    cityId: "lagos",
    name: "Baba Sola Spot",
    area: "Surulere",
    category: "hangouts",
    kind: "parlour",
    blurb: "Beer parlour. Pick a table, pull up a stool. 18+ only.",
    rooms: [
      {
        id: "table-football",
        spotId: "lagos-baba-sola",
        name: "Table 1 · Football",
        kind: "table",
        topic: "Who go carry this season league? Arsenal fans, come defend una self.",
        mode: "voice",
        capacity: 8,
        host: { name: "Sola", role: "Barman" },
        adultsOnly: true,
      },
      {
        id: "table-hustle",
        spotId: "lagos-baba-sola",
        name: "Table 2 · Hustle",
        kind: "table",
        topic: "Side hustle wey dey pay pass salary — share your own.",
        mode: "voice",
        capacity: 8,
        host: { name: "Sola", role: "Barman" },
        adultsOnly: true,
      },
      {
        id: "table-pepper-soup",
        spotId: "lagos-baba-sola",
        name: "Table 3 · Pepper soup corner",
        kind: "table",
        topic: "Chill talk only. No argument for this table.",
        mode: "text",
        capacity: 8,
        host: { name: "Sola", role: "Barman" },
        adultsOnly: true,
      },
    ],
  },
  {
    id: "lagos-island-mainland",
    cityId: "lagos",
    name: "Island vs Mainland Debate",
    area: "Lagos",
    category: "hangouts",
    kind: "lounge",
    blurb: "Which side sweet pass? Settle am once and for all.",
    rooms: [
      {
        id: "lounge-island-mainland",
        spotId: "lagos-island-mainland",
        name: "The Big Debate",
        kind: "lounge",
        topic: "Island or Mainland — which side get better life?",
        mode: "voice",
        capacity: 120,
        host: { name: "Bimbo", role: "Moderator" },
      },
    ],
  },
  {
    id: "lagos-balogun",
    cityId: "lagos",
    name: "Balogun Market",
    area: "Lagos Island",
    category: "hangouts",
    kind: "market",
    blurb: "Price matter, market gist, and who get the best deal.",
    rooms: [
      {
        id: "market-balogun",
        spotId: "lagos-balogun",
        name: "Market Square",
        kind: "lounge",
        topic: "Wetin you buy this week and how much dem sell am?",
        mode: "text",
        capacity: 200,
        host: { name: "Iya Basira", role: "Market leader" },
        openHours: [7, 19],
      },
    ],
  },
  {
    id: "lagos-aunty-bisi",
    cityId: "lagos",
    name: "Aunty Bisi's Salon",
    area: "Ikeja",
    category: "style",
    kind: "salon",
    blurb: "Hair, heart matters, business and the classic salon gist. Everybody welcome.",
    rooms: [
      {
        id: "salon-aunty-bisi",
        spotId: "lagos-aunty-bisi",
        name: "Aunty Bisi's Salon",
        kind: "salon",
        topic: "If your friend husband dey cheat, you go tell am?",
        mode: "voice",
        capacity: 40,
        host: { name: "Aunty Bisi", role: "Salon owner" },
      },
    ],
  },
  {
    id: "lagos-kingsley-cutz",
    cityId: "lagos",
    name: "Kingsley Cutz",
    area: "Yaba",
    category: "style",
    kind: "barber",
    blurb: "Barbershop gist: football, money, relationships and fresh lineups.",
    rooms: [
      {
        id: "barber-kingsley-cutz",
        spotId: "lagos-kingsley-cutz",
        name: "Kingsley Cutz",
        kind: "salon",
        topic: "Who suppose pay for first date — man, woman, or split am?",
        mode: "voice",
        capacity: 40,
        host: { name: "Kingsley", role: "Barber" },
      },
    ],
  },
  {
    id: "lagos-grace-assembly",
    cityId: "lagos",
    name: "Grace Assembly",
    area: "Surulere",
    category: "faith",
    kind: "church",
    blurb: "Church departments: choir, ushers, fellowships, prayer room and the back pew.",
    rooms: [
      {
        id: "church-lagos-choir",
        spotId: "lagos-grace-assembly",
        name: "Choir",
        kind: "department",
        topic: "Rehearsing for Sunday. Drop your song request.",
        mode: "voice",
        capacity: 60,
        host: { name: "Femi", role: "Choir master" },
      },
      {
        id: "church-lagos-ushers",
        spotId: "lagos-grace-assembly",
        name: "Ushers",
        kind: "department",
        topic: "Who go stand for gate this Sunday? Rota and small gist.",
        mode: "text",
        capacity: 40,
        host: { name: "Grace", role: "Head usher" },
      },
      {
        id: "church-lagos-youth",
        spotId: "lagos-grace-assembly",
        name: "Youth Fellowship",
        kind: "department",
        topic: "You fit date person from another church? Talk am with respect.",
        mode: "voice",
        capacity: 100,
        host: { name: "Dayo", role: "Youth leader" },
      },
      {
        id: "church-lagos-women",
        spotId: "lagos-grace-assembly",
        name: "Women's Fellowship",
        kind: "department",
        topic: "Harvest planning, recipes, and balancing home and work.",
        mode: "text",
        capacity: 60,
        host: { name: "Mama Adeyemi", role: "Fellowship leader" },
      },
      {
        id: "church-lagos-men",
        spotId: "lagos-grace-assembly",
        name: "Men's Fellowship",
        kind: "department",
        topic: "Being husband and provider for this economy. Real talk.",
        mode: "voice",
        capacity: 60,
        host: { name: "Deacon Okafor", role: "Fellowship leader" },
      },
      {
        id: "church-lagos-prayer",
        spotId: "lagos-grace-assembly",
        name: "Prayer Room",
        kind: "department",
        topic: "Drop your prayer request. People go pray along with you.",
        mode: "quiet",
        capacity: 200,
        host: { name: "Prayer team", role: "Prayer team" },
      },
      {
        id: "church-lagos-back-pew",
        spotId: "lagos-grace-assembly",
        name: "Back Pew",
        kind: "department",
        topic: "Light gist from the back seat. Respect still apply.",
        mode: "text",
        capacity: 60,
        host: { name: "Usher on duty", role: "Usher" },
      },
    ],
  },
  {
    id: "lagos-island-mosque",
    cityId: "lagos",
    name: "Lagos Island Mosque Room",
    area: "Lagos Island",
    category: "faith",
    kind: "mosque",
    blurb: "Youth, sisters, brothers and Jumu'ah gist.",
    rooms: [
      {
        id: "mosque-lagos-jumuah",
        spotId: "lagos-island-mosque",
        name: "Jumu'ah Gist",
        kind: "department",
        topic: "After Jumu'ah, come reflect on the khutbah together.",
        mode: "voice",
        capacity: 150,
        host: { name: "Bashir", role: "Imam's assistant" },
        openDays: [5],
      },
      {
        id: "mosque-lagos-youth",
        spotId: "lagos-island-mosque",
        name: "Youth Circle",
        kind: "department",
        topic: "Career, marriage, and staying focused in Lagos.",
        mode: "voice",
        capacity: 80,
        host: { name: "Abdullahi", role: "Youth leader" },
      },
      {
        id: "mosque-lagos-sisters",
        spotId: "lagos-island-mosque",
        name: "Sisters' Circle",
        kind: "department",
        topic: "Home, business and sisterly advice.",
        mode: "text",
        capacity: 60,
        host: { name: "Hajiya Aisha", role: "Circle leader" },
      },
      {
        id: "mosque-lagos-brothers",
        spotId: "lagos-island-mosque",
        name: "Brothers' Circle",
        kind: "department",
        topic: "Work, family and good character in Lagos.",
        mode: "voice",
        capacity: 60,
        host: { name: "Mallam Yusuf", role: "Circle leader" },
      },
    ],
  },

  // ------------------------------- ABUJA ---------------------------------
  {
    id: "abuja-wuse-kubwa",
    cityId: "abuja",
    name: "Wuse to Kubwa Taxi",
    area: "Wuse",
    category: "rides",
    kind: "taxi",
    blurb: "Small ride, big gist. Four seats only.",
    rooms: [
      {
        id: "taxi-wuse-kubwa",
        spotId: "abuja-wuse-kubwa",
        name: "Kubwa Express Taxi",
        kind: "ride",
        topic: "Abuja rent don cast — where una dey stay?",
        mode: "voice",
        capacity: 4,
        host: { name: "Musa", role: "Driver" },
        stops: ["Wuse", "Berger", "Dutse Junction", "Kubwa (last stop)"],
      },
    ],
  },
  {
    id: "abuja-garki-keke",
    cityId: "abuja",
    name: "Keke around Garki",
    area: "Garki",
    category: "rides",
    kind: "keke",
    blurb: "Quick drops, short gist. Three seats.",
    rooms: [
      {
        id: "keke-garki",
        spotId: "abuja-garki-keke",
        name: "Garki Keke",
        kind: "ride",
        topic: "Quick one: which suya spot sweet pass for Abuja?",
        mode: "text",
        capacity: 3,
        host: { name: "Idris", role: "Keke rider" },
        stops: ["Area 1", "Area 3", "Area 10", "Garki Market (last stop)"],
      },
    ],
  },
  {
    id: "abuja-jabi-lake",
    cityId: "abuja",
    name: "Jabi Lake Evening Hangout",
    area: "Jabi",
    category: "hangouts",
    kind: "lounge",
    blurb: "Chill, music and relationship talk by the lake.",
    rooms: [
      {
        id: "lounge-jabi-lake",
        spotId: "abuja-jabi-lake",
        name: "Lakeside",
        kind: "lounge",
        topic: "Abuja dating: soft life or serious relationship?",
        mode: "voice",
        capacity: 120,
        host: { name: "Zara", role: "Host" },
        openHours: [15, 23],
      },
    ],
  },
  {
    id: "abuja-mama-ngozi",
    cityId: "abuja",
    name: "Mama Ngozi Spot",
    area: "Garki",
    category: "hangouts",
    kind: "parlour",
    blurb: "Suya, drinks and football tables. 18+ only.",
    rooms: [
      {
        id: "table-abuja-football",
        spotId: "abuja-mama-ngozi",
        name: "Table 1 · Football",
        kind: "table",
        topic: "Super Eagles: who suppose dey the starting eleven?",
        mode: "voice",
        capacity: 8,
        host: { name: "Mama Ngozi", role: "Barman" },
        adultsOnly: true,
      },
      {
        id: "table-abuja-suya",
        spotId: "abuja-mama-ngozi",
        name: "Table 2 · Suya corner",
        kind: "table",
        topic: "Easy evening talk. Bring your gist, leave your stress.",
        mode: "text",
        capacity: 8,
        host: { name: "Mama Ngozi", role: "Barman" },
        adultsOnly: true,
      },
    ],
  },
  {
    id: "abuja-civil-servants",
    cityId: "abuja",
    name: "Civil Servants Break Room",
    area: "Central Area",
    category: "hangouts",
    kind: "office",
    blurb: "Office wahala, salary talk and promotion matter.",
    rooms: [
      {
        id: "office-break-room",
        spotId: "abuja-civil-servants",
        name: "Break Room",
        kind: "lounge",
        topic: "Your oga don ever take credit for your work?",
        mode: "text",
        capacity: 80,
        host: { name: "Chinedu", role: "Host" },
      },
    ],
  },
  {
    id: "abuja-wuse-market",
    cityId: "abuja",
    name: "Wuse Market",
    area: "Wuse",
    category: "hangouts",
    kind: "market",
    blurb: "Price matter and market gist.",
    rooms: [
      {
        id: "market-wuse",
        spotId: "abuja-wuse-market",
        name: "Market Square",
        kind: "lounge",
        topic: "Foodstuff price this week — una feel am?",
        mode: "text",
        capacity: 200,
        host: { name: "Mama Blessing", role: "Market leader" },
        openHours: [7, 19],
      },
    ],
  },
  {
    id: "abuja-glam-salon",
    cityId: "abuja",
    name: "Glam Salon",
    area: "Wuse 2",
    category: "style",
    kind: "salon",
    blurb: "Hair, style and heart matters. Everybody welcome.",
    rooms: [
      {
        id: "salon-glam-wuse",
        spotId: "abuja-glam-salon",
        name: "Glam Salon",
        kind: "salon",
        topic: "Wig or natural hair: which one dey give confidence?",
        mode: "voice",
        capacity: 40,
        host: { name: "Hauwa", role: "Salon owner" },
      },
    ],
  },
  {
    id: "abuja-fresh-cut",
    cityId: "abuja",
    name: "Fresh Cut Barbershop",
    area: "Garki",
    category: "style",
    kind: "barber",
    blurb: "Lineups, beard gist and Abuja hustle talk.",
    rooms: [
      {
        id: "barber-fresh-cut",
        spotId: "abuja-fresh-cut",
        name: "Fresh Cut",
        kind: "salon",
        topic: "Abuja or Lagos: which city better for young people?",
        mode: "voice",
        capacity: 40,
        host: { name: "Musa Cuts", role: "Barber" },
      },
    ],
  },
  {
    id: "abuja-hope-chapel",
    cityId: "abuja",
    name: "Hope Chapel",
    area: "Gwarinpa",
    category: "faith",
    kind: "church",
    blurb: "Youth fellowship live tonight.",
    rooms: [
      {
        id: "church-abuja-youth",
        spotId: "abuja-hope-chapel",
        name: "Youth Fellowship",
        kind: "department",
        topic: "Faith and career in Abuja — how una dey balance am?",
        mode: "voice",
        capacity: 100,
        host: { name: "Pastor Emeka", role: "Youth pastor" },
      },
      {
        id: "church-abuja-choir",
        spotId: "abuja-hope-chapel",
        name: "Choir",
        kind: "department",
        topic: "Which hymn you no fit forget since childhood?",
        mode: "voice",
        capacity: 60,
        host: { name: "Ruth", role: "Choir mistress" },
      },
      {
        id: "church-abuja-prayer",
        spotId: "abuja-hope-chapel",
        name: "Prayer Room",
        kind: "department",
        topic: "Drop your prayer request.",
        mode: "quiet",
        capacity: 200,
        host: { name: "Prayer team", role: "Prayer team" },
      },
    ],
  },
  {
    id: "abuja-al-noor",
    cityId: "abuja",
    name: "Al-Noor Mosque Room",
    area: "Wuse",
    category: "faith",
    kind: "mosque",
    blurb: "Jumu'ah gist, youth, sisters, brothers and reflection.",
    rooms: [
      {
        id: "mosque-abuja-jumuah",
        spotId: "abuja-al-noor",
        name: "Jumu'ah Gist",
        kind: "department",
        topic: "After Jumu'ah, come reflect on the khutbah together.",
        mode: "voice",
        capacity: 150,
        host: { name: "Bashir", role: "Imam's assistant" },
        openDays: [5],
      },
      {
        id: "mosque-abuja-youth",
        spotId: "abuja-al-noor",
        name: "Youth Circle",
        kind: "department",
        topic: "Career, marriage and staying focused for this Abuja hustle.",
        mode: "voice",
        capacity: 80,
        host: { name: "Abdullahi", role: "Youth leader" },
      },
      {
        id: "mosque-abuja-sisters",
        spotId: "abuja-al-noor",
        name: "Sisters' Circle",
        kind: "department",
        topic: "Hijab styles, home, business and sisterly advice.",
        mode: "text",
        capacity: 60,
        host: { name: "Hajiya Zainab", role: "Circle leader" },
      },
      {
        id: "mosque-abuja-brothers",
        spotId: "abuja-al-noor",
        name: "Brothers' Circle",
        kind: "department",
        topic: "Being a good husband and provider. Honest talk, good manners.",
        mode: "voice",
        capacity: 60,
        host: { name: "Mallam Sani", role: "Circle leader" },
      },
      {
        id: "mosque-abuja-reflection",
        spotId: "abuja-al-noor",
        name: "Quran and Reflection",
        kind: "department",
        topic: "Share a verse that touched you this week.",
        mode: "quiet",
        capacity: 100,
        host: { name: "Ustaz Ibrahim", role: "Teacher" },
      },
      {
        id: "mosque-abuja-sallah",
        spotId: "abuja-al-noor",
        name: "Ramadan and Sallah",
        kind: "department",
        topic: "Iftar ideas and Sallah plans when the season reach.",
        mode: "text",
        capacity: 200,
        host: { name: "Community team", role: "Hosts" },
        comingSoon: true,
      },
    ],
  },
];

export function getSpots(cityId?: CityId): Spot[] {
  return cityId ? SPOTS.filter((s) => s.cityId === cityId) : SPOTS;
}

export function getSpot(id: string): Spot | undefined {
  return SPOTS.find((s) => s.id === id);
}

// ---------------------------------------------------------------------------
// States (36 + FCT) — each becomes a text notice-board room
// ---------------------------------------------------------------------------

export const STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT Abuja", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
  "Taraba", "Yobe", "Zamfara",
];

export function stateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function stateRoom(slug: string): Room | undefined {
  const name = STATES.find((s) => stateSlug(s) === slug);
  if (!name) return undefined;
  return {
    id: `state-${slug}`,
    spotId: "naija",
    name: `${name} Room`,
    kind: "state",
    topic: `News, events and gist from ${name}. Wetin dey happen for home?`,
    mode: "text",
    capacity: 5000,
    host: { name: `${name} hosts`, role: "State hosts" },
  };
}

/** Find any room by id, including generated state rooms. */
export function getRoom(id: string): { room: Room; spot?: Spot } | undefined {
  if (id.startsWith("state-")) {
    const room = stateRoom(id.replace("state-", ""));
    return room ? { room } : undefined;
  }
  for (const spot of SPOTS) {
    const room = spot.rooms.find((r) => r.id === id);
    if (room) return { room, spot };
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Dashes, badges and house rules
// ---------------------------------------------------------------------------

export const DASHES: DashItem[] = [
  { id: "zobo", name: "zobo", cost: 5 },
  { id: "puff-puff", name: "puff-puff", cost: 5 },
  { id: "chin-chin", name: "chin chin", cost: 5 },
  { id: "suya", name: "suya", cost: 10 },
  { id: "malt", name: "malt", cost: 10 },
  { id: "attachment", name: "attachment", cost: 20 },
];

export const BADGES: BadgeDef[] = [
  { id: "first-ride", tag: "BUS", name: "First Ride", how: "Board your first bus", test: (s) => s.rides >= 1 },
  { id: "danfo-veteran", tag: "VET", name: "Danfo Veteran", how: "Ride 25 buses", test: (s) => s.rides >= 25 },
  { id: "smooth-drop", tag: "OWA", name: "Smooth Drop", how: "Shout Owa 10 times", test: (s) => s.owaDrops >= 10 },
  { id: "front-seat", tag: "MIC", name: "Front Seat Regular", how: "Send 50 messages", test: (s) => s.messagesSent >= 50 },
  { id: "salon-vip", tag: "CUT", name: "Chair Regular", how: "Visit a salon or barbershop 10 times", test: (s) => s.salonVisits >= 10 },
  { id: "big-heart", tag: "DSH", name: "Big Heart", how: "Send 20 dashes", test: (s) => s.dashesSent >= 20 },
  { id: "abuja-visitor", tag: "ABJ", name: "Abuja Visitor", how: "Visit 5 Abuja spots", test: (s) => s.abujaSpots >= 5 },
  { id: "lagos-visitor", tag: "LAG", name: "Lagos Visitor", how: "Visit 5 Lagos spots", test: (s) => s.lagosSpots >= 5 },
  { id: "conductor", tag: "CON", name: "Conductor", how: "Host your first bus", test: (s) => s.hosted >= 1 },
];

export const HOUSE_RULES = [
  { title: "Gist, no destroy person", body: "No naming and shaming real people. No spreading people private matter." },
  { title: "Respect everybody faith and tribe", body: "Argue the matter, no attack the person." },
  { title: "Host get last word", body: "Conductors, salon owners and barmen fit mute or drop anybody wey dey cause wahala." },
  { title: "See something? Report am", body: "Every room get report button. The team dey check every report." },
];

// ---------------------------------------------------------------------------
// Demo activity — keeps rooms lively in local mode.
// Replace with real users once Supabase is connected.
// ---------------------------------------------------------------------------

export const DEMO_PEOPLE = [
  { name: "Ngozi", colour: "#F6D9CC" }, { name: "Bayo", colour: "#D7EBDD" },
  { name: "Kemi", colour: "#FDE9A8" }, { name: "Emeka", colour: "#E4E0F5" },
  { name: "Halima", colour: "#D3E8E6" }, { name: "Chidi", colour: "#F6A88A" },
  { name: "Tobi", colour: "#7BD389" }, { name: "Aisha", colour: "#A99BF0" },
  { name: "Uche", colour: "#6EC6E8" }, { name: "Funke", colour: "#F5BE1B" },
  { name: "Yusuf", colour: "#D7EBDD" }, { name: "Segun", colour: "#F6D9CC" },
];

/** Quick reactions people can throw into a room or put on a message. */
export const REACTIONS = ["😂", "🔥", "👏", "❤️", "😮", "🙏"];

export const DEMO_GIST: Record<RoomKind, string[]> = {
  ride: [
    "Abeg, finish the story. Wetin happen after?",
    "This bus get gist pass Sunday service",
    "Conductor, make we no reach last stop o, I never hear the end",
    "Na so my own ex take do me too",
    "Who get better advice for this matter?",
    "I dey laugh for inside this traffic",
    "Make una hold, I wan talk",
  ],
  salon: [
    "I go tell am o. Na my sister be that.",
    "Make you hold evidence first before you open mouth",
    "Guys, una no dey hear this one?",
    "This topic don touch my heart",
    "Who cut your hair? E fine well well",
    "Abeg pass me the comb small",
    "Na why I no dey trust anybody again",
    "Ladies and guys, make we settle am today",
  ],
  table: [
    "Barman, bring another round!",
    "Una no sabi ball, make I explain",
    "This one na correct gist",
    "Make we no fight, na just talk",
    "Pepper soup don reach?",
  ],
  department: [
    "Amen to that",
    "Thank you for sharing, e touch me",
    "Make we keep each other for prayer",
    "That point sweet well",
    "God bless una all",
  ],
  lounge: [
    "Island get vibe but Mainland get life",
    "Make una talk true, which side cheap pass?",
    "Price don go up again this week",
    "I agree with the last person",
    "This na the realest talk today",
  ],
  state: [
    "Who dey go home this December?",
    "Road from Lagos don better small",
    "Our people, una well done",
    "Any event for this weekend?",
  ],
};
