-- ============================================================
-- Tally Accounting Hub Pro — Supabase Database Schema
-- Run this in Supabase SQL Editor to create all tables
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Videos ──────────────────────────────────────────────────
create table if not exists public.videos (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null,
  description  text,
  category     text not null,
  duration     text,
  url          text not null,
  thumbnail    text,
  views        integer not null default 0,
  price        text not null default 'Free',
  upload_date  date not null default current_date,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ── Courses ─────────────────────────────────────────────────
create table if not exists public.courses (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  instructor  text not null,
  description text,
  duration    text,
  lessons     integer not null default 0,
  rating      numeric(3,1) not null default 0,
  students    text not null default '0',
  thumbnail   text,
  category    text not null,
  price       text not null default 'Free',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── Movies ──────────────────────────────────────────────────
create table if not exists public.movies (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  description text,
  genre       text not null,
  rating      numeric(3,1) not null default 0,
  year        text,
  duration    text,
  language    text,
  director    text,
  cast        text[],
  poster      text,
  video_url   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── Sports ──────────────────────────────────────────────────
create table if not exists public.sports (
  id          uuid primary key default uuid_generate_v4(),
  sport       text not null,       -- 'cricket' | 'football'
  team_a      text not null,
  team_b      text not null,
  score_a     text,
  score_b     text,
  status      text not null default 'Upcoming',
  is_live     boolean not null default false,
  extra_info  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── Notes ───────────────────────────────────────────────────
create table if not exists public.notes (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  description   text,
  category      text not null,
  thumbnail_url text,
  pdf_url       text not null,
  tags          text[] not null default '{}',
  difficulty    text not null default 'Beginner'
                check (difficulty in ('Beginner','Intermediate','Advanced')),
  reading_time  text,
  page_count    integer not null default 0,
  author        text,
  status        text not null default 'draft'
                check (status in ('published','draft')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ── Users (mirrors Supabase Auth, extend as needed) ─────────
create table if not exists public.users (
  id                uuid primary key default uuid_generate_v4(),
  full_name         text not null,
  username          text unique not null,
  email             text unique,
  phone             text unique,
  avatar            text,
  purchased_courses text[] not null default '{}',
  purchased_videos  text[] not null default '{}',
  created_at        timestamptz not null default now()
);

-- ── Updated_at triggers ─────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger videos_updated_at  before update on public.videos  for each row execute procedure public.set_updated_at();
create trigger courses_updated_at before update on public.courses for each row execute procedure public.set_updated_at();
create trigger movies_updated_at  before update on public.movies  for each row execute procedure public.set_updated_at();
create trigger sports_updated_at  before update on public.sports  for each row execute procedure public.set_updated_at();
create trigger notes_updated_at   before update on public.notes   for each row execute procedure public.set_updated_at();

-- ── Row Level Security ───────────────────────────────────────
alter table public.videos  enable row level security;
alter table public.courses enable row level security;
alter table public.movies  enable row level security;
alter table public.sports  enable row level security;
alter table public.notes   enable row level security;
alter table public.users   enable row level security;

-- Public read access for published content
create policy "Public can read videos"  on public.videos  for select using (true);
create policy "Public can read courses" on public.courses for select using (true);
create policy "Public can read movies"  on public.movies  for select using (true);
create policy "Public can read sports"  on public.sports  for select using (true);
create policy "Public can read notes"   on public.notes   for select using (status = 'published');
create policy "Public can read users"   on public.users   for select using (true);

-- Service role (admin) has full access — use service_role key in admin panel
-- Or use anon key with additional auth checks
create policy "Anon full access videos"  on public.videos  for all using (true) with check (true);
create policy "Anon full access courses" on public.courses for all using (true) with check (true);
create policy "Anon full access movies"  on public.movies  for all using (true) with check (true);
create policy "Anon full access sports"  on public.sports  for all using (true) with check (true);
create policy "Anon full access notes"   on public.notes   for all using (true) with check (true);
create policy "Anon full access users"   on public.users   for all using (true) with check (true);
