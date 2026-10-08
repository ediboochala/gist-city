-- ---------------------------------------------------------------------------
-- Gist City — Supabase schema
-- Run this in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- It creates the tables the app needs when you move from local mode to real
-- accounts and real-time chat. Row Level Security (RLS) is on for every table.
-- ---------------------------------------------------------------------------

-- People ---------------------------------------------------------------------
create table if not exists public.profiles (
  id              uuid primary key references auth.users (id) on delete cascade,
  nickname        text not null check (char_length(nickname) between 2 and 24),
  colour          text not null default '#F5BE1B',
  home_city       text not null check (home_city in ('lagos', 'abuja')),
  state_of_origin text,
  avatar          jsonb not null default '{}'::jsonb, -- the avatar builder config (see lib/avatar.ts)
  agreed_rules_at timestamptz not null default now(),
  is_moderator    boolean not null default false,
  banned_until    timestamptz,
  created_at      timestamptz not null default now()
);

-- The city -----------------------------------------------------------------
create table if not exists public.spots (
  id        text primary key,           -- e.g. 'lagos-ojuelegba-cms'
  city_id   text not null,
  name      text not null,
  area      text not null,
  category  text not null check (category in ('rides', 'hangouts', 'style', 'faith')),
  kind      text not null,
  blurb     text not null default '',
  sponsor   text                        -- later: brand sponsorships
);

create table if not exists public.rooms (
  id           text primary key,        -- e.g. 'bus-wahala-express' or a uuid for hosted buses
  spot_id      text references public.spots (id) on delete cascade,
  name         text not null,
  kind         text not null check (kind in ('ride', 'salon', 'table', 'department', 'lounge', 'state')),
  topic        text not null default '',
  mode         text not null default 'voice' check (mode in ('voice', 'text', 'quiet')),
  capacity     int  not null default 14,
  host_id      uuid references public.profiles (id),
  host_name    text not null,
  host_role    text not null,
  stops        text[],                  -- rides only
  adults_only  boolean not null default false,
  open_hours   int4range,               -- e.g. '[6,22)'
  open_days    int[],                   -- 0 = Sunday
  fare_coins   int not null default 0,  -- 0 during launch; set later to charge fares
  current_stop int not null default 0,
  created_at   timestamptz not null default now()
);

-- Chat -----------------------------------------------------------------------
create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  room_id    text not null references public.rooms (id) on delete cascade,
  author_id  uuid references public.profiles (id) on delete set null,
  type       text not null default 'chat' check (type in ('chat', 'system', 'owa', 'dash', 'voice-note')),
  text       text not null check (char_length(text) <= 500),
  created_at timestamptz not null default now()
);
create index if not exists messages_room_time on public.messages (room_id, created_at desc);

-- Coins, dashes and fares ------------------------------------------------------
create table if not exists public.wallet_entries (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  amount     int  not null,             -- positive = earned, negative = spent
  what       text not null,             -- 'Dashed suya', 'Bus fare', 'Daily check-in'
  room_id    text references public.rooms (id) on delete set null,
  created_at timestamptz not null default now()
);

create or replace view public.wallet_balances as
  select user_id, 250 + coalesce(sum(amount), 0) as balance
  from public.wallet_entries group by user_id;

-- Safety -------------------------------------------------------------------
create table if not exists public.reports (
  id          uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles (id) on delete set null,
  room_id     text references public.rooms (id) on delete set null,
  target_id   uuid references public.profiles (id) on delete set null,
  reason      text not null,
  details     text,
  status      text not null default 'open' check (status in ('open', 'reviewing', 'actioned', 'dismissed')),
  created_at  timestamptz not null default now()
);

create table if not exists public.blocks (
  blocker_id uuid references public.profiles (id) on delete cascade,
  blocked_id uuid references public.profiles (id) on delete cascade,
  primary key (blocker_id, blocked_id)
);

-- Row Level Security ----------------------------------------------------------
alter table public.profiles       enable row level security;
alter table public.spots          enable row level security;
alter table public.rooms          enable row level security;
alter table public.messages       enable row level security;
alter table public.wallet_entries enable row level security;
alter table public.reports        enable row level security;
alter table public.blocks         enable row level security;

-- Anyone signed in can see profiles' public fields, spots and rooms.
create policy "profiles readable" on public.profiles for select to authenticated using (true);
create policy "own profile insert" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "own profile update" on public.profiles for update to authenticated using (id = auth.uid());

create policy "spots readable" on public.spots for select to authenticated using (true);
create policy "rooms readable" on public.rooms for select to authenticated using (true);
create policy "host creates ride" on public.rooms for insert to authenticated
  with check (host_id = auth.uid() and kind = 'ride');
create policy "host updates own room" on public.rooms for update to authenticated using (host_id = auth.uid());

-- Messages: read rooms you are allowed in; write as yourself; banned people can't write.
create policy "messages readable" on public.messages for select to authenticated using (true);
create policy "messages insert" on public.messages for insert to authenticated with check (
  author_id = auth.uid()
  and exists (select 1 from public.profiles p where p.id = auth.uid() and (p.banned_until is null or p.banned_until < now()))
);

create policy "own wallet readable" on public.wallet_entries for select to authenticated using (user_id = auth.uid());
-- Wallet inserts should happen from a server function (Edge Function / API route) using the service key,
-- so people can't give themselves coins. No insert policy for normal users on purpose.

create policy "report insert" on public.reports for insert to authenticated with check (reporter_id = auth.uid());
create policy "moderators read reports" on public.reports for select to authenticated using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_moderator)
);

create policy "own blocks" on public.blocks for all to authenticated
  using (blocker_id = auth.uid()) with check (blocker_id = auth.uid());

-- Real-time: broadcast new messages to everyone in the room.
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.rooms;
